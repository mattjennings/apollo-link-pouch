import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import * as PouchDB from 'pouchdb'
import { createPouchLink } from '../../../index'

PouchDB.plugin(require('pouchdb-adapter-memory'))

let db: PouchDB.Database
let client: ApolloClient<any>

describe('@pdbPost', () => {
  beforeEach(async () => {
    db = new PouchDB('test', { adapter: 'memory' })
    client = new ApolloClient({
      link: createPouchLink({
        database: db
      }),
      cache: new InMemoryCache({})
    })
  })

  afterEach(async () => {
    await db.destroy()
  })

  it('should post a document', async () => {
    const mutation = gql`
      fragment PersonInput on pouchdb {
        _id: String
        _rev: string
        name: String
      }

      mutation postDoc($input: PersonInput!) {
        createPerson(input: $input) @pdbPost {
          _id
          _rev
          name
        }
      }
    `

    const { data } = await client.mutate<{ createPerson: any }>({
      mutation,
      variables: { input: { _id: '1', name: 'bill' } }
    })
    expect(data.createPerson._id).toBeDefined()
    expect(data.createPerson._rev).toBeDefined()
    expect(data.createPerson.name).toEqual('bill')
  })
})
