import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import { ResolverContext, ResolverRoot } from '../../types'
import { QueryDirective } from './directives'

const bulkGet: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  const { docs, revs, attachments, binary } = directives[
    QueryDirective.BULK_GET
  ]

  const { results } = await database.bulkGet({
    docs,
    revs,
    attachments,
    binary
  })

  return {
    results
  }
}

export default bulkGet
