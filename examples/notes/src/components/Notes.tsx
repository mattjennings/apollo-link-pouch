import React, { useState } from 'react'
import { Query } from 'react-apollo'
import ALL_NOTES_QUERY from '../queries/ALL_NOTES.gql'
import Note from './Note'
import { Typography, IconButton, Grid } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import { Note as NoteInterface } from '../../typings/notes'
import NoteDialog from './NoteDialog'

function Notes() {
  const [selectedNote, setSelectedNote] = useState('')
  const [isNewNote, setIsNewNote] = useState(false)

  function closeDialog() {
    setIsNewNote(false)
    setSelectedNote('')
  }

  return (
    <div>
      <Typography variant="h3">
        Notes{' '}
        <IconButton color="primary" onClick={() => setIsNewNote(true)}>
          <Add />
        </IconButton>
      </Typography>
      <Query query={ALL_NOTES_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error: {error.toString()}</p>

          const { notes } = data

          return (
            <Grid container>
              {notes.docs.map(
                (note: PouchDB.Core.ExistingDocument<NoteInterface>) => (
                  <Grid item key={note._id} xs={12} sm={6} md={4}>
                    <Note
                      id={note._id}
                      title={note.title}
                      content={note.content}
                      onClick={() => setSelectedNote(note._id)}
                    />
                  </Grid>
                )
              )}
            </Grid>
          )
        }}
      </Query>
      <NoteDialog
        id={selectedNote}
        open={isNewNote || !!selectedNote}
        onSave={closeDialog}
        onCancel={closeDialog}
        onExit={closeDialog}
        onClose={closeDialog}
      />
    </div>
  )
}

export default Notes
