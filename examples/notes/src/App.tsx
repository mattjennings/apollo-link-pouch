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
import grey from '@material-ui/core/colors/grey'

import client from './client'
import Notes from './components/Notes'
import Page from './components/Page'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    background: {
      default: grey[100]
    },
    primary: indigo,
    secondary: red
  }
})

class App extends Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Page>
            <Notes />
          </Page>
        </MuiThemeProvider>
      </ApolloProvider>
    )
  }
}

export default hot(module)(App)
