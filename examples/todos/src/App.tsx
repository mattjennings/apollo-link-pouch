import { CssBaseline } from '@material-ui/core'
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import Drawer from './components/Drawer'
import Note from './components/Note'

class App extends Component {
  public render() {
    return (
      <div className="App">
        <CssBaseline />
        <Drawer>
          <Note title={'test'} content="" />
        </Drawer>
      </div>
    )
  }
}

export default hot(App)
