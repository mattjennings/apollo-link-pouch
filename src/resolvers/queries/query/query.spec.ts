import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import * as PouchDB from 'pouchdb'
import { createPouchLink } from '../../../index'

PouchDB.plugin(require('pouchdb-adapter-memory'))

let db: PouchDB.Database
let client: ApolloClient<any>
declare var emit: any

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

describe('@pdbQuery', () => {
  beforeEach(async () => {
    db = new PouchDB('test', { adapter: 'memory' })
    client = new ApolloClient({
      link: createPouchLink({
        database: db
      }),
      cache: new InMemoryCache({})
    })
    await db.bulkDocs(people)
    await db.put({
      _id: '_design/index',
      views: {
        index: {
          map: function mapFun(doc) {
            emit(doc._id)
          }.toString()
        }
      }
    } as any)
  })

  afterEach(async () => {
    await db.destroy()
  })

  it('should query the database', async () => {
    const query = gql`
      query queryPeople {
        people @pdbQuery(view: "index", include_docs: true) {
          rows {
            doc {
              name
              type
            }
          }
          total_rows
        }
      }
    `

    const { data } = await client.query<{ people: any }>({ query })

    expect(data.people.rows).toHaveLength(2)
  })
})
