import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import * as has from 'lodash/has'
import { ResolverContext, ResolverRoot } from '../../types'
import bulkGet from './bulkGet'
import { QueryDirective } from './directives'
import get from './get'

const queryResolver: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  if (isLeaf) {
    return (root && root[resultKey]) || null
  }

  if (has(directives, QueryDirective.GET)) {
    return get(fieldName, root, args, context, info)
  }

  if (has(directives, QueryDirective.BULK_GET)) {
    return bulkGet(fieldName, root, args, context, info)
  }

  return (root && root[fieldName]) || null
}

export default queryResolver
