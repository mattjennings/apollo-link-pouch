import { ApolloLink, concat } from 'apollo-link'
import PouchQueryLink from './link'

export const createPouchLink = ({
  database
}: {
  database: PouchDB.Database
}) => {
  return new PouchQueryLink({ database })
}
