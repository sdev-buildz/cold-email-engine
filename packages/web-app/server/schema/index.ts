import './conversionMetrics'
import './email'
import { builder } from './lib/builder'
import './products'
import './workflowStats'

/**
 * The Pothos GraphQL Schema
 */
export const schema = builder.toSchema()
