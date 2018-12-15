import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import * as has from 'lodash/has'
import { ResolverContext, ResolverRoot } from '../../types'
import { allDocs } from './allDocs'
import { bulkGet } from './bulkGet'
import { QueryDirective } from './directives'
import { get } from './get'
import { plugin } from './plugin'

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
    if (typeof root[resultKey] === 'undefined') {
      return null
    }

    return root[resultKey]
  }

  if (has(directives, QueryDirective.GET)) {
    return get(fieldName, root, args, context, info)
  }

  if (has(directives, QueryDirective.BULK_GET)) {
    return bulkGet(fieldName, root, args, context, info)
  }

  if (has(directives, QueryDirective.ALL_DOCS)) {
    return allDocs(fieldName, root, args, context, info)
  }

  if (has(directives, QueryDirective.PLUGIN)) {
    return plugin(fieldName, root, args, context, info)
  }

  if (typeof root[fieldName] === 'undefined') {
    return null
  }

  return root[fieldName]
}

export default queryResolver
