import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import { ResolverContext, ResolverRoot } from '../../../types'
import { QueriesDirective } from '../directives'

export const allDocs: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  const {
    keys,
    include_docs,
    conflicts,
    attachments,
    binary,
    startkey,
    endkey,
    inclusive_end,
    limit,
    skip,
    descending
  } = directives[QueriesDirective.ALL_DOCS]

  return database.allDocs({
    keys,
    include_docs,
    conflicts,
    attachments,
    binary,
    startkey,
    endkey,
    inclusive_end,
    limit,
    skip,
    descending
  })
}
