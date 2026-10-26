import { ConversionMetrics } from './RateConfig'
import { WorkflowStatus } from './WorkflowStatus'

/**
 * The dashboard to check the status, configure, and fast-forward.
 */
export const Dashboard = () => {
  return (
    <div id='dashboard'>
      <WorkflowStatus></WorkflowStatus>
      <ConversionMetrics />
    </div>
  )
}
