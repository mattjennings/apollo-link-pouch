import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import { MutationResolverContext, MutationResolverRoot } from '../../../types'
import { MutationDirective } from '../directives'

export const put: Resolver = async (
  fieldName: string,
  root: MutationResolverRoot,
  args: any,
  context: MutationResolverContext,
  info: ExecInfo
) => {
  const { resultKey, directives, isLeaf } = info
  const { database } = context

  const directiveArgs = directives[MutationDirective.PUT] || {}
  const res = await database.put(args, directiveArgs.options || {})

  if (res.ok) {
    return {
      ...args,
      _rev: res.rev
    }
  } else {
    throw res
  }
}
