import React from 'react'
import { Grid } from '@material-ui/core'

export default function Page(props: { children: React.ReactNode }) {
  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={10} md={8}>
        {props.children}
      </Grid>
    </Grid>
  )
}
