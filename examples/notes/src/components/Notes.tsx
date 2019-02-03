import React, { useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Query } from 'react-apollo'
import ALL_NOTES_QUERY from '../queries/ALL_NOTES.gql'
import Note from './Note'
import Drawer from './Drawer'

function Notes() {
  const [currentNoteId, setCurrentNoteId] = useState<string>('')

  return (
    <Query query={ALL_NOTES_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error: {error.toString()}</p>

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
            <Note
              id={currentNoteId}
              onDelete={() => setCurrentNoteId('')}
              onCreate={id => setCurrentNoteId(id)}
            />
          </Drawer>
        )
      }}
    </Query>
  )
}

export default Notes
