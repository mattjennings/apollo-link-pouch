import { Resolver } from 'graphql-anywhere'
import { ExecInfo } from 'graphql-anywhere/lib/async'
import * as omit from 'lodash/omit'
import { ResolverContext, ResolverRoot } from '../../../types'
import { QueryDirective } from '../directives'

export const plugin: Resolver = async (
  fieldName: string,
  root: ResolverRoot,
  args: any,
  context: ResolverContext,
  info: ExecInfo
) => {
  const { directives, isLeaf, resultKey } = info
  const { database } = context

  const plugins = omit(directives, QueryDirective.PLUGIN)
  const [pluginFunction] = Object.keys(plugins)

  if (!database[pluginFunction]) {
    throw new Error(`No plugin found for @${pluginFunction}`)
  }

  const pluginArgs = plugins[pluginFunction]

  return database[pluginFunction](pluginArgs)
}
