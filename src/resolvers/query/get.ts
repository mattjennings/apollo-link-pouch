import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import * as has from 'lodash/has'
import { ResolverContext, ResolverRoot } from '../../types'
import { QueryDirective } from './directives'

const get: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  const {
    _id,
    _rev,
    conflicts,
    revs,
    revs_info,
    attachments,
    binary,
    latest,
    type
  } = directives[QueryDirective.GET]

  const getOptions = {
    rev: _rev,
    conflicts,
    revs,
    revs_info,
    attachments,
    binary,
    latest
  }
  const doc = await database.get(_id, getOptions)

  return {
    ...doc,
    __typename: type || (doc as any).type
  }
}

export default get
