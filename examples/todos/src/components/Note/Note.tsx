import {
  createStyles,
  Input,
  TextField,
  withStyles,
  WithStyles
} from '@material-ui/core'
import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import NoteForm from './NoteForm'
import uuidv4 from 'uuid/v4'
import { ALL_NOTES_QUERY } from '../Notes'

export type NoteDocument = PouchDB.Core.Document<{
  id?: string
  title: string
  content: string
}>

export interface NoteProps extends WithStyles<typeof styles> {
  id?: string
  new?: boolean
}

const styles = () =>
  createStyles({
    root: {}
  })

export const GET_NOTE_QUERY = gql`
  query getNote($id: String) {
    note @pdbGet(id: $id) {
      _id
      _rev
      title
      content
    }
  }
`

const mutation = gql`
  fragment Input on Note {
    _id: String
    title: String
    content: String
  }

  mutation saveNote($input: Input!) {
    saveResponse(input: $input) @pdbPut {
      _id
      _rev
      title
      content
      type
    }
  }
`

function Note(props: NoteProps) {
  const { classes, id } = props

  return (
    <Mutation mutation={mutation}>
      {(saveNote, { loading, error, data }) => {
        return id ? (
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
                      variables: { input: { ...data.note, ...editedNote } },
                      refetchQueries: [ALL_NOTES_QUERY, GET_NOTE_QUERY]
                    })
                  }
                />
              )
            }}
          </Query>
        ) : (
          <NoteForm
            onSave={editedNote =>
              saveNote({
                variables: {
                  input: { _id: uuidv4(), ...editedNote, type: 'note' }
                },
                refetchQueries: ALL_NOTES_QUERY
              })
            }
          />
        )
      }}
    </Mutation>
  )
}

export default withStyles(styles)(Note)
