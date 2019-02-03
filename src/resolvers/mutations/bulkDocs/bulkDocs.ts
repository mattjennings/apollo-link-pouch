import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import { MutationResolverContext, MutationResolverRoot } from '../../../types'
import { MutationDirective } from '../directives'

export const bulkDocs: Resolver = async (
  fieldName: string,
  root: MutationResolverRoot,
  args: any,
  context: MutationResolverContext,
  info: ExecInfo
) => {
  const { resultKey, directives, isLeaf } = info
  const { database } = context

  const directiveArgs = directives[MutationDirective.BULK_DOCS] || {}
  const rows = await database.bulkDocs(args, directiveArgs.options || {})

  return rows.map((row, index) => {
    if ((row as PouchDB.Core.Response).ok) {
      const { id, rev, ...rest } = row

      return {
        // include mutation input on response
        ...args[index],

        // Map id and rev to _id and _rev
        _id: id,
        _rev: rev,

        // include the rest of the row
        ...rest
      }
    }

    return row
  })
}
