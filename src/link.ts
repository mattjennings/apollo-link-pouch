import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation
} from 'apollo-link'
import {
  addTypenameToDocument,
  getMainDefinition,
  hasDirectives
} from 'apollo-utilities'
import { OperationTypeNode } from 'graphql'
import { Resolver } from 'graphql-anywhere'
import { graphql } from 'graphql-anywhere/lib/async'
import { ResolverContext } from './types'

// resolvers
import { mutationsResolver } from './resolvers/mutations'
import { MutationDirective } from './resolvers/mutations/directives'
import { queriesResolver } from './resolvers/queries'
import { QueryDirective } from './resolvers/queries/directives'

const getResolver = (operationType: string): Resolver => {
  switch (operationType) {
    case 'query':
      return queriesResolver
    case 'mutation':
      return mutationsResolver
    default:
      throw new Error(`${operationType} not supported`)
  }
}

export default class PouchLink extends ApolloLink {
  private database: PouchDB.Database

  constructor({ database }: { database: PouchDB.Database }) {
    super()
    this.database = database
  }

  public request(
    operation: Operation,
    forward?: NextLink
  ): Observable<FetchResult> {
    const { query } = operation

    // Combine all directives to determine if applicable for this link
    const combDirectives = { ...MutationDirective, ...QueryDirective }
    const pouchDirectives = Object.keys(combDirectives).map(key => {
      return combDirectives[key]
    })

    const isPouchQuery = hasDirectives(pouchDirectives, query)

    if (!isPouchQuery && forward) {
      return forward(operation)
    }

    const queryWithTypename = addTypenameToDocument(query)

    const mainDefinition = getMainDefinition(query)
    const operationType: OperationTypeNode =
      (mainDefinition || ({} as any)).operation || 'query'

    // context for graphql-anywhere resolver
    const context: ResolverContext = {
      database: this.database
    }

    // rootValue for graphql-anywhere resolver
    const rootValue = {}

    return new Observable(observer => {
      graphql(
        getResolver(operationType),
        queryWithTypename,
        rootValue,
        context,
        operation.variables
      )
        .then(data => {
          observer.next({ data })
          observer.complete()
        })
        .catch(err => {
          if (err.name === 'AbortError') {
            return
          }
          if (err.result && err.result.errors) {
            observer.next(err.result)
          }
          observer.error(err)
        })
    })
  }
}
