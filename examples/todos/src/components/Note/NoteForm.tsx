import {
  createStyles,
  Input,
  TextField,
  withStyles,
  WithStyles,
  Button
} from '@material-ui/core'
import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

export interface NoteFormProps extends WithStyles<typeof styles> {
  title?: string
  content?: string

  onSave: (note: { title: string; content: string }) => any
  onDelete?: () => any
}

const styles = () =>
  createStyles({
    root: {}
  })

function NoteForm(props: NoteFormProps) {
  const { classes, onDelete, onSave } = props

  const [title, setTitle] = useState(props.title || '')
  const [content, setContent] = useState(props.content || '')

  return (
    <div className={classes.root}>
      <TextField
        label="Title"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        fullWidth={true}
        margin="dense"
      />
      <TextField
        value={content}
        fullWidth={true}
        multiline={true}
        margin="dense"
        onChange={ev => setContent(ev.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSave({ title, content })}
      >
        SAVE
      </Button>
      {onDelete && (
        <Button variant="text" color="secondary" onClick={onDelete}>
          DELETE
        </Button>
      )}
    </div>
  )
}

export default withStyles(styles)(NoteForm)
