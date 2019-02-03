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

describe('@pdbAllDocs', () => {
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
    const query = gql`
      query allDocs {
        people @pdbAllDocs(keys: ["1", "2"], include_docs: true) {
          rows {
            id
            rev
            doc
            value
          }
          total_rows
          offset
        }
      }
    `

    const { data } = await client.query<any>({ query })

    expect(data.people.total_rows).toEqual(2)
    expect(data.people.offset).toEqual(0)
    expect(data.people.rows).toHaveLength(2)
    expect(data.people.rows[0].doc.name).toEqual('bob')
  })
})
