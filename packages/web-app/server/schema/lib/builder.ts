import SchemaBuilder from '@pothos/core'
import { GraphQLScalarType } from 'graphql'
import type { pubsub } from '../../util/pubsub'
import type { Prospect, User } from '../../util/types'

type TemporalInstant = {
  epochMilliseconds: number
}

const isTemporalInstant = (value: unknown): value is TemporalInstant =>
  typeof value === 'object' &&
  value !== null &&
  'epochMilliseconds' in value &&
  typeof value.epochMilliseconds === 'number' &&
  Number.isFinite(value.epochMilliseconds)

/** Convert a Temporal.Instant value to the Date used by the GraphQL schema. */
export const resolveDateTime = (value: TemporalInstant): Date =>
  new Date(value.epochMilliseconds)

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

builder.subscriptionType({
  description: `The schema root for subscriptions`,
})
