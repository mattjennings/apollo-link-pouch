import {
  createStyles,
  Input,
  TextField,
  withStyles,
  WithStyles,
  Theme
} from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import React, { Component, useState } from 'react'
import Note from './/Note'
import Drawer from './Drawer'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export interface NotesProps extends WithStyles<typeof styles> {}

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    addButton: {
      position: 'absolute',
      bottom: theme.spacing.unit * 2,
      right: theme.spacing.unit * 2
    }
  })

export const ALL_NOTES_QUERY = gql`
  query getNotes {
    notes @pdbPlugin @find(selector: { type: "note" }) {
      docs {
        _id
        title
        content
        type
      }
    }
  }
`

function Notes(props: NotesProps) {
  const { classes } = props

  const [currentNoteId, setCurrentNoteId] = useState<string>('')

  return (
    <Query query={ALL_NOTES_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error: {error.toString()}</p>
        console.log(data.notes.docs)
        return (
          <Drawer
            menu={
              <List>
                <ListItem
                  key={'__new__'}
                  button={true}
                  onClick={() => setCurrentNoteId('')}
                >
                  <ListItemText primary={'+ Create New Note'} />
                </ListItem>
                {data.notes.docs.map((note: any) => (
                  <ListItem
                    key={note._id}
                    button={true}
                    onClick={() => setCurrentNoteId(note._id)}
                  >
                    <ListItemText primary={note.title} />
                  </ListItem>
                ))}
              </List>
            }
          >
            <Note id={currentNoteId} />
          </Drawer>
        )
      }}
    </Query>
  )
}

export default withStyles(styles)(Notes)
