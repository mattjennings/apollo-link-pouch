import {
  createStyles,
  Input,
  TextField,
  withStyles,
  WithStyles
} from '@material-ui/core'
import React from 'react'

export interface NoteProps extends WithStyles<typeof styles> {
  title: string
  content: string
}

const styles = () =>
  createStyles({
    root: {}
  })

function Note(props: NoteProps) {
  const { classes } = props
  return (
    <div className={classes.root}>
      <TextField label="Title" value={props.title} fullWidth={true} />
      <TextField
        value={props.content}
        fullWidth={true}
        multiline={true}
        variant="outlined"
      />
    </div>
  )
}

export default withStyles(styles)(Note)
