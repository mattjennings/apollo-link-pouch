import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import * as has from 'lodash/has'
import { MutationResolverContext, MutationResolverRoot } from '../../types'
import { bulkDocs } from './bulkDocs'
import { MutationDirective } from './directives'
import { post } from './post'
import { put } from './put'

export const mutationsResolver: Resolver = async (
  fieldName: string,
  root: MutationResolverRoot,
  args: any,
  context: MutationResolverContext,
  info: ExecInfo
) => {
  const { resultKey, directives, isLeaf } = info
  const { database } = context
  const hasTypeDirective = has(directives, 'type')

  if (isLeaf) {
    // Return doc.type as __typename if it exists
    if (resultKey === '__typename') {
      return root.type || root[resultKey] || null
    }

    return typeof root[resultKey] !== 'undefined' ? root[resultKey] : null
  }

  // By convention GraphQL recommends mutations having a single argument named 'input'
  // https://dev-blog.apollodata.com/designing-graphql-mutations-e09de826ed97
  const payload: any = args && args.input

  // todo: warn if no args.input is found

  if (has(directives, MutationDirective.PUT)) {
    return put(fieldName, root, payload, context, info)
  }

  if (has(directives, MutationDirective.POST)) {
    return post(fieldName, root, payload, context, info)
  }

  if (has(directives, MutationDirective.BULK_DOCS)) {
    return bulkDocs(fieldName, root, payload, context, info)
  }

  return null
}
