import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import {
  CssBaseline,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
import { ApolloProvider } from 'react-apollo'
import indigo from '@material-ui/core/colors/indigo'
import red from '@material-ui/core/colors/red'

import client from './client'
import Notes from './components/Notes'
class App extends Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <CssBaseline />
        <MuiThemeProvider
          theme={createMuiTheme({
            typography: {
              useNextVariants: true
            },
            palette: {
              primary: indigo,
              secondary: red
            }
          })}
        >
          <Notes />
        </MuiThemeProvider>
      </ApolloProvider>
    )
  }
}

export default hot(module)(App)
