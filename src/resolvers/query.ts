import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import * as has from 'lodash/has'
import { ResolverContext, ResolverRoot } from '../types'

export enum QueryDirective {
  GET = 'pouchGet'
}

const queryResolver: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database, exportVal } = context

  if (isLeaf) {
    return root[resultKey] || null
  }

  if (has(directives, QueryDirective.GET)) {
    const { id, type } = directives[QueryDirective.GET]
    const doc = await database.get(id)

    return {
      ...doc,
      __typename: type || (doc as any).type
    }
  }

  return null
}

export default queryResolver
