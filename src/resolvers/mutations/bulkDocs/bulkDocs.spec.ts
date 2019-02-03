import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import PouchDB from 'pouchdb'
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

  it('should save multiple documents', async () => {
    const mutation = gql`
      fragment PersonInput on pouchdb {
        _id: String
        _rev: string
        name: String
      }

      mutation postDoc($input: [PersonInput]!) {
        savePeople(input: $input) @pdbBulkDocs {
          _id
          _rev
          name
        }
      }
    `

    const { data } = await client.mutate<{ savePeople: any }>({
      mutation,
      variables: {
        input: [{ _id: '1', name: 'bill' }, { _id: '2', name: 'alex' }]
      }
    })

    expect(data.savePeople).toHaveLength(2)
    expect(data.savePeople[0]._id).toEqual('1')
    expect(data.savePeople[0].name).toEqual('bill')
    expect(data.savePeople[1]._id).toEqual('2')
    expect(data.savePeople[1].name).toEqual('alex')
  })
})
