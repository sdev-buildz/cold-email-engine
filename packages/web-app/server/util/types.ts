import type { Models } from '@packages/db/types'

/**
 * User
 */
export type User = {
  id: string
}

/**
 * Product
 */
export type Product = {
  id: number
  name: string
  summary: string
  description: string
  price: number
  stockCount: number
  imageUrl: string
}

type FilterTemporalType<
  PrismaT extends Record<string, unknown>,
  Temporals extends keyof PrismaT,
> = {
  [Prop in keyof PrismaT]: Prop extends Temporals ? Date : PrismaT[Prop]
}

/**
 * Email Record
 */
export type EmailRecord = FilterTemporalType<
  Omit<Models.public_EmailRecord, 'prospect'>,
  'sentAt'
> & {
  prospect?: Prospect | null
}

/**
 * Prospect
 */
export type Prospect = Omit<
  Models.public_Prospect,
  'nextEmail' | 'replyEmail' | 'sentEmails'
> & {
  nextEmail?: EmailRecord
  replyEmail?: EmailRecord
  sentEmails?: EmailRecord[]
}

/**
 * Workflow Status
 */
export type WorkflowStatus = FilterTemporalType<
  Models.public_WorkflowStatus,
  'currentTime'
>
