import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core'
import { CardProps } from '@material-ui/core/Card'

export interface NoteProps extends CardProps {
  id: string
  title: string
  content: string
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      margin: theme.spacing.unit
    }
  })

function Note({
  id,
  title,
  content,
  classes,
  ...cardProps
}: NoteProps & WithStyles<typeof styles>) {
  return (
    <Card {...cardProps} className={classes.root}>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="body1">{content}</Typography>
      </CardContent>
    </Card>
  )
}

export default withStyles(styles)(Note)
