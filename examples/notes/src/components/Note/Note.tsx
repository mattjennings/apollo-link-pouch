import {
  createStyles,
  Input,
  TextField,
  withStyles,
  WithStyles
} from '@material-ui/core'
import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import NoteForm from './NoteForm'
import uuidv4 from 'uuid/v4'
import ALL_NOTES_QUERY from '../../queries/ALL_NOTES.gql'
import GET_NOTE_QUERY from '../../queries/GET_NOTE.gql'
import SAVE_NOTE_MUTATION from '../../mutations/SAVE_NOTE.gql'

export type NoteDocument = PouchDB.Core.Document<{
  id?: string
  title: string
  content: string
}>

export interface NoteProps {
  id?: string
  new?: boolean

  onCreate: (id: string) => any
  onDelete: () => any
}

function Note(props: NoteProps) {
  const { id, onDelete, onCreate } = props

  return (
    <Mutation mutation={SAVE_NOTE_MUTATION}>
      {(saveNote, { loading, error, data }) => {
        return id ? (
          // fetch note data and fill in NoteForm
          <Query query={GET_NOTE_QUERY} variables={{ id }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading</p>
              if (error) return <p>Error: {error.toString()}</p>

              return (
                <NoteForm
                  title={data.note.title}
                  content={data.note.content}
                  onSave={editedNote =>
                    saveNote({
                      variables: {
                        input: { ...data.note, ...editedNote }
                      }
                    })
                  }
                  onDelete={() => {
                    saveNote({
                      variables: {
                        input: { ...data.note, _deleted: true }
                      },
                      refetchQueries: [
                        {
                          query: ALL_NOTES_QUERY
                        }
                      ]
                    })

                    onDelete()
                  }}
                />
              )
            }}
          </Query>
        ) : (
          // show new NoteForm
          <NoteForm
            onSave={async editedNote => {
              const res = await saveNote({
                variables: {
                  input: { _id: uuidv4(), ...editedNote, type: 'note' }
                },
                refetchQueries: [
                  {
                    query: ALL_NOTES_QUERY
                  }
                ]
              })

              if (res) {
                onCreate(res.data.saveResponse._id)
              }
            }}
          />
        )
      }}
    </Mutation>
  )
}

export default Note
