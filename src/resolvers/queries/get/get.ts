import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import { ResolverContext, ResolverRoot } from '../../../types'
import { QueriesDirective } from '../directives'

export const get: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  const {
    id,
    rev,
    conflicts,
    revs,
    revs_info,
    attachments,
    binary,
    latest,
    type
  } = directives[QueriesDirective.GET]

  const getOptions = {
    rev,
    conflicts,
    revs,
    revs_info,
    attachments,
    binary,
    latest
  }

  return database.get(id, getOptions)
}
