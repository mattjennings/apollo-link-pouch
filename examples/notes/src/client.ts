import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createPouchLink } from 'apollo-link-pouch'
import PouchDB from 'pouchdb'

const db = new PouchDB('notes')
PouchDB.plugin(require('pouchdb-find').default)

//@ts-ignore
window.db = db

export default new ApolloClient({
  link: createPouchLink({
    database: db
  }),
  cache: new InMemoryCache({ addTypename: false })
})
