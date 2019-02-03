import { CssBaseline } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import React, { Component } from 'react'
import Notes from './components/Notes'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createPouchLink } from '../../../'
import PouchDB from 'pouchdb'

const db = new PouchDB('notes')
PouchDB.plugin(require('pouchdb-find').default)

const client = new ApolloClient({
  link: createPouchLink({
    database: db
  }),
  cache: new InMemoryCache({ addTypename: false })
})

class App extends Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <CssBaseline />
        <Notes />
      </ApolloProvider>
    )
  }
}

export default App
