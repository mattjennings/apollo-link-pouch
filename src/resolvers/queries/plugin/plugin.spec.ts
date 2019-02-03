import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import PouchDB from 'pouchdb'
import { createPouchLink } from '../../../index'

PouchDB.plugin(require('pouchdb-adapter-memory'))
PouchDB.plugin(require('pouchdb-quick-search'))

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

describe('@pdbPlugin', () => {
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

  it('should use the plugin', async () => {
    const query = gql`
      query searchPlugin {
        search @pdbPlugin @search(query: "bob", fields: ["name"]) {
          rows {
            id
            score
          }
          total_rows
        }
      }
    `

    const { data } = await client.query<{ search: any }>({ query })
    expect(data.search.rows).toBeDefined()
    expect(data.search.total_rows).toBeDefined()
  })

  it('should error when no plugin is found', async () => {
    const query = gql`
      query searchPlugin {
        search @pdbPlugin @wrongplugin(query: "bob", fields: ["name"]) {
          rows {
            id
            score
          }
          total_rows
        }
      }
    `

    let error

    try {
      await client.query<{ search: any }>({ query })
    } catch (e) {
      error = e
    }
    expect(error.toString()).toEqual(
      'Error: Network error: No plugin found for @wrongplugin'
    )
  })
})
