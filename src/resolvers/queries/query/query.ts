import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import { ResolverContext, ResolverRoot } from '../../../types'
import { QueryDirective } from '../directives'

export const query: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  const {
    view,
    reduce,
    startkey,
    endkey,
    inclusive_end,
    include_docs,
    limit,
    skip,
    descending,
    key,
    keys,
    group,
    group_level,
    stale,
    update_seq
  } = directives[QueryDirective.QUERY]

  const queryOptions = {
    reduce,
    startkey,
    endkey,
    inclusive_end,
    include_docs,
    limit,
    skip,
    descending,
    key,
    keys,
    group,
    group_level,
    stale,
    update_seq
  }

  return database.query(view, queryOptions)
}
