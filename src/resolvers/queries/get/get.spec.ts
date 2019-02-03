import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import PouchDB from 'pouchdb'
import { createPouchLink } from '../../../index'

PouchDB.plugin(require('pouchdb-adapter-memory'))

let db: PouchDB.Database
let client: ApolloClient<any>

interface Person {
  _id?: string
  _rev?: string
  name: string
  type: 'person'
}

const people = [
  {
    _id: '1',
    name: 'bob',
    type: 'person'
  },
  {
    _id: '2',
    name: 'alex',
    type: 'person'
  }
]

describe('@pdbGet', () => {
  beforeEach(async () => {
    db = new PouchDB('test', { adapter: 'memory' })
    client = new ApolloClient({
      link: createPouchLink({
        database: db
      }),
      cache: new InMemoryCache({})
    })
    await db.bulkDocs(people)
  })

  afterEach(async () => {
    await db.destroy()
  })

  it('should get a document', async () => {
    const query = gql`
      query getDoc {
        doc @pdbGet(id: "1") {
          _id
          _rev
          name
        }
      }
    `

    const { data } = await client.query<{ doc: Person }>({ query })
    expect(data.doc._id).toEqual(people[0]._id)
    expect(data.doc._rev).toBeDefined()
    expect(data.doc.name).toEqual(people[0].name)
  })

  it('should get a specific revision', async () => {
    const doc = await db.get('1')
    const { rev } = await db.put({ ...doc, name: 'stan' })

    const query = gql`
      query getDoc {
        doc @pdbGet(id: "1", rev: "${rev}") {
          _id
          _rev
          name
        }
      }
    `

    const { data } = await client.query<{ doc: Person }>({ query })
    expect(data.doc._id).toEqual('1')
    expect(data.doc._rev).toEqual(rev)
    expect(data.doc.name).toEqual('stan')
  })

  it('should get a document with revisions', async () => {
    const doc = await db.get('1')
    await db.put(doc)

    const query = gql`
      query getDoc {
        doc @pdbGet(id: "1", revs: true) {
          _revisions
        }
      }
    `

    const { data } = await client.query<{ doc: any }>({ query })
    expect(data.doc._revisions).toBeDefined()
  })

  it('should get a document with conflicts', async () => {
    await db.put({
      _id: 'conflict',
      name: 'bill',
      type: 'person'
    })

    await db.put(
      {
        _id: 'conflict',
        _rev: '1-asdfasdf',
        name: 'billy',
        type: 'person'
      },
      { force: true }
    )

    const query = gql`
      query getDoc {
        doc @pdbGet(id: "conflict", conflicts: true) {
          _id
          _rev
          _conflicts
          name
        }
      }
    `

    const { data } = await client.query<{ doc: any }>({ query })
    expect(data.doc._conflicts).toBeDefined()
  })
})
