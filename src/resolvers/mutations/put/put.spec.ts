import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import PouchDB from 'pouchdb'
import { createPouchLink } from '../../../index'

PouchDB.plugin(require('pouchdb-adapter-memory'))

let db: PouchDB.Database
let client: ApolloClient<any>

describe('@pdbPut', () => {
  beforeEach(async () => {
    db = new PouchDB('test', { adapter: 'memory' })
    client = new ApolloClient({
      link: createPouchLink({
        database: db
      }),
      cache: new InMemoryCache({})
    })

    await db.put({
      _id: '1',
      name: 'bob',
      type: 'person'
    })
  })

  afterEach(async () => {
    await db.destroy()
  })

  it('should put a document', async () => {
    const mutation = gql`
      fragment PersonInput on pouchdb {
        _id: String
        _rev: string
        name: String
      }

      mutation putDoc($input: PersonInput!) {
        updatePerson(input: $input) @pdbPut {
          _rev
          name
        }
      }
    `

    const doc = await db.get('1')

    const { data } = await client.mutate<{ updatePerson: any }>({
      mutation,
      variables: { input: { ...doc, name: 'bill' } }
    })

    expect(data.updatePerson._rev).not.toEqual(doc._rev)
    expect(data.updatePerson.name).toEqual('bill')
  })

  it('should throw error on conflict', async () => {
    const mutation = gql`
      fragment PersonInput on pouchdb {
        _id: String
        _rev: string
        name: String
      }

      mutation putDoc($input: PersonInput!) {
        updatePerson(input: $input) @pdbPut {
          _rev
          name
        }
      }
    `

    const doc = await db.get('1')
    await db.put(doc)

    let error
    try {
      await client.mutate<{ updatePerson: any }>({
        mutation,
        variables: { input: { ...doc, name: 'bill' } }
      })
    } catch (e) {
      error = e
    }

    expect(error.toString()).toEqual(
      'Error: Network error: Document update conflict'
    )
  })

  it('should force a put on conflict', async () => {
    const mutation = gql`
      fragment PersonInput on pouchdb {
        _id: String
        _rev: string
        name: String
      }

      fragment PutOptions on pouchdb {
        force: Boolean
      }

      mutation putDoc($input: PersonInput!, $options: PutOptions) {
        updatePerson(input: $input) @pdbPut(options: $options) {
          _rev
          name
        }
      }
    `

    const doc = await db.get('1')
    await db.put(doc)

    const { data } = await client.mutate<{ updatePerson: any }>({
      mutation,
      variables: { input: { ...doc, name: 'bill' }, options: { force: true } }
    })
    expect(data.updatePerson.name).toEqual('bill')
  })
})
