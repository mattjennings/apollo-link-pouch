import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import * as PouchDB from 'pouchdb'
import { createPouchLink } from '../index'
PouchDB.plugin(require('pouchdb-adapter-memory'))

const db = new PouchDB('test', { adapter: 'memory' })
const client = new ApolloClient({
  link: createPouchLink({
    database: db
  }),
  cache: new InMemoryCache({})
})

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
describe('query resolver', () => {
  beforeAll(async () => {
    await db.bulkDocs(people)
  })
  it('should get a document', async () => {
    const query = gql`
      query getDoc {
        doc @pouchGet(id: "1") {
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
})
