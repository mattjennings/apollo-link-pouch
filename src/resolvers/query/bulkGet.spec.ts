import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import * as PouchDB from 'pouchdb'
import { createPouchLink } from '../../index'

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

describe('@pdbBulkGet', () => {
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

  it('should get multiple docs', async () => {
    const { _rev: rev1 } = await db.get('1')
    const { _rev: rev2 } = await db.get('2')

    const query = gql`
      query bulkGet {
        people @pdbBulkGet(docs: [{ id: "1", _rev: "${rev1}" }, { id: "2", _rev: "${rev2}" }]) {
          results {
            docs {
              ok {
                _id
                _rev
                name
              }
            }
          }
        }
      }
    `

    const { data } = await client.query<any>({ query })
    expect(data.people).toBeDefined()
    expect(data.people.results).toHaveLength(2)
    expect(data.people.results[0].docs).toHaveLength(1)
    expect(data.people.results[0].docs[0].ok._id).toEqual('1')
    expect(data.people.results[0].docs[0].ok._rev).toEqual(rev1)
    expect(data.people.results[0].docs[0].ok.name).toEqual('bob')
    expect(data.people.results[1].docs).toHaveLength(1)
    expect(data.people.results[1].docs[0].ok._id).toEqual('2')
    expect(data.people.results[1].docs[0].ok._rev).toEqual(rev2)
    expect(data.people.results[1].docs[0].ok.name).toEqual('alex')
  })
})
