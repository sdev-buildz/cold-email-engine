import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import type { Mutation, Query } from '@types-gen-react-apollo'
import { useState } from 'react'

/**
 * The dashboard to check the status, configure, and fast-forward.
 */
export const WorkflowStatus = () => {
  const workflowStatus = useQuery(
    gql`
      query workflowStatusQuery {
        workflowStatus {
          currentTime
          waitIntervalDays
        }
      }
    ` as TypedDocumentNode<Pick<Query, 'workflowStatus'>>,
    {
      fetchPolicy: 'network-only',
    }
  )

  const [ffDays, setFfDays] = useState(1)
  const [waitDays, setWaitDays] = useState(1)

  const [fastForward] = useMutation(
    gql`
      mutation fastForward($days: Int!) {
        fastForward(days: $days) {
          currentTime
        }
      }
    ` as TypedDocumentNode<Pick<Mutation, 'fastForward'>>,
    {
      refetchQueries: ['workflowStatusQuery'],
    }
  )

  const [configureWaitDays] = useMutation(
    gql`
      mutation configureWaitInterval($days: Int!) {
        configureWaitInterval(days: $days) {
          waitIntervalDays
        }
      }
    ` as TypedDocumentNode<Pick<Mutation, 'configureWaitInterval'>>,
    {
      refetchQueries: ['workflowStatusQuery'],
    }
  )

  return (
    <div id='workflow-status-container'>
      <dl id='workflow-status'>
        <h3>Workflow Status</h3>
        <dt>Current Time :</dt>
        <dd>
          {workflowStatus.data?.workflowStatus?.currentTime?.toLocaleString()}
        </dd>
        <br />
        <dt>Wait Interval (days) :</dt>
        <dd>{workflowStatus.data?.workflowStatus?.waitIntervalDays}</dd>
      </dl>

      {/* Form to fast-forward */}
      <form id='fast-forward-form'>
        <label htmlFor='ff-days-input'>Number of days to fast forward</label>
        <input
          id='ff-days-input'
          type='number'
          value={ffDays}
          onChange={(e) => setFfDays(Number(e.target.value))}
          min='1'
          max='30'
        ></input>
        <button
          type='button'
          onClick={() => {
            fastForward({ variables: { days: ffDays } })
          }}
        >
          Fast Forward
        </button>
      </form>

      {/* Form to configure wait interval days */}
      <form id='wait-days-form'>
        <label htmlFor='wait-days-input'>
          Number of days to wait between emails
        </label>
        <input
          id='wait-days-input'
          type='number'
          value={waitDays}
          onChange={(e) => setWaitDays(Number(e.target.value))}
          min='1'
          max='30'
        ></input>
        <button
          type='button'
          onClick={() => configureWaitDays({ variables: { days: waitDays } })}
        >
          Configure Wait Interval
        </button>
      </form>
    </div>
  )
}
