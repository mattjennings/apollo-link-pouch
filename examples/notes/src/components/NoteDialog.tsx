import React, { useState, useEffect } from 'react'
import ALL_NOTES_QUERY from '../queries/ALL_NOTES.gql'
import GET_NOTE_QUERY from '../queries/GET_NOTE.gql'
import SAVE_NOTE_MUTATION from '../mutations/SAVE_NOTE.gql'
import { Mutation, Query } from 'react-apollo'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  Grid
} from '@material-ui/core'
import { DialogProps } from '@material-ui/core/Dialog'
import { Note, NoteDocument } from '../../typings/notes'
import uuidv4 from 'uuid/v4'

export interface NoteDialogProps extends DialogProps {
  id: string

  onSave: () => any
  onCancel: () => any
}

function NoteDialog({ id, onSave, onCancel, ...dialogProps }: NoteDialogProps) {
  const [note, setNote] = useState<NoteDocument | Note | null>(null)

  return (
    <Mutation mutation={SAVE_NOTE_MUTATION}>
      {(saveNote, { loading: mutating, error: mutationError }) => (
        <Query query={GET_NOTE_QUERY} skip={!id} variables={{ id }}>
          {({ loading, error, data }) => {
            if (error) {
              return null
            }

            // todo: make sure setNote is called when data.note comes through

            return (
              <Dialog {...dialogProps} keepMounted={false}>
                <DialogTitle>Note</DialogTitle>
                <DialogContent>
                  <>
                    {mutationError && mutationError.toString()}
                    <Form
                      note={data ? data.note : null}
                      onChange={newNote =>
                        setNote({ ...note, ...newNote, type: 'note' })
                      }
                    />
                  </>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="secondary"
                    disabled={!data || !data.note}
                    onClick={async () => {
                      await saveNote({
                        variables: {
                          input: { ...note, _deleted: true }
                        },
                        refetchQueries: [
                          {
                            query: ALL_NOTES_QUERY
                          }
                        ]
                      })

                      onSave()
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={async () => {
                      await saveNote({
                        variables: {
                          input: { ...note, _id: id || uuidv4() }
                        },
                        refetchQueries: id
                          ? [
                              {
                                query: ALL_NOTES_QUERY
                              }
                            ]
                          : []
                      })

                      onSave()
                    }}
                    disabled={!note || mutating}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            )
          }}
        </Query>
      )}
    </Mutation>
  )
}

function Form(props: { note?: Note; onChange: (note: Note) => any }) {
  // todo: fix updating when props.note changes

  const [note, setNote] = useState<Note>(
    props.note || {
      title: '',
      content: ''
    }
  )

  return (
    <Grid container direction="column">
      <Grid item>
        <TextField
          variant="outlined"
          label="Title"
          fullWidth={true}
          margin="dense"
          value={note.title}
          onChange={ev => {
            setNote({ ...note, title: ev.target.value })
            props.onChange(note)
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          variant="outlined"
          multiline={true}
          fullWidth={true}
          margin="dense"
          rows={5}
          onChange={ev => {
            setNote({ ...note, content: ev.target.value })
            props.onChange(note)
          }}
        />
      </Grid>
    </Grid>
  )
}

/*
    <Mutation mutation={SAVE_NOTE_MUTATION}>
      {(saveNote, { loading, error, data }) => {
        return id ? (
          
          <Query query={GET_NOTE_QUERY} variables={{ id }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading</p>
              if (error) return <p>Error: {error.toString()}</p>

              return (
                <div>dialog content</div>)
            }}
          </Query>
        ) : (
         
        )
      }}
    </Mutation>
    */
export default NoteDialog
