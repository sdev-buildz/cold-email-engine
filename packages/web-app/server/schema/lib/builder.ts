import SchemaBuilder from '@pothos/core'
import { GraphQLScalarType } from 'graphql'
import type { Temporal } from 'temporal-polyfill'
import 'temporal-polyfill/full/global'
import type { pubsub } from '../../util/pubsub'
import { resolveDateTime } from '../../util/resolveDateTime'
import type { Prospect, User } from '../../util/types'

const isTemporalInstant = (value: unknown): value is Temporal.Instant =>
  typeof value === 'object' &&
  value !== null &&
  'epochMilliseconds' in value &&
  typeof value.epochMilliseconds === 'number' &&
  Number.isFinite(value.epochMilliseconds)

/**
 *  The custom objects added to the context.
 */
export type CustomGraphqlContextType = {
  currentUser: User | undefined
  reqOrigin: string
  pubsub: typeof pubsub
}

/**
 * The Pothos GraphQL schema builder instance.
 */
export const builder = new SchemaBuilder<{
  Scalars: {
    DateTime: {
      Input: unknown
      Output: Date
    }
    ReplyIntent: {
      Input: Prospect['replyIntent']
      Output: Prospect['replyIntent']
    }
  }
  Context: CustomGraphqlContextType
}>({})

builder.addScalarType(
  'DateTime',
  new GraphQLScalarType<unknown, Date>({
    name: 'DateTime',
    serialize: (value) => {
      if (!isTemporalInstant(value)) {
        throw new TypeError(
          'DateTime values must expose finite epochMilliseconds'
        )
      }

      return resolveDateTime(value)
    },
  }),
  {}
)
builder.addScalarType(
  'ReplyIntent',
  new GraphQLScalarType<Prospect['replyIntent'], Prospect['replyIntent']>({
    name: 'ReplyIntent',
    serialize: (value) => {
      return value as Prospect['replyIntent']
    },
  }),
  {}
)

builder.queryType({
  description: 'The schema root for fetching data.',
})

builder.mutationType({
  description: `The schema root for mutating data`,
})
