export interface Note {
  title: string
  content: string
}

export type NoteDocument = PouchDB.Core.ExistingDocument<
  Note & {
    type: string
  }
>
