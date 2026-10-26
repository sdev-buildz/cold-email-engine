import { gql, type TypedDocumentNode } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { Button } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { Mutation, Query } from '@types-gen-react-apollo'
import { useEffect, useReducer } from 'react'
import { typedObjectEntries } from 'ts-strict-utils'

type ConversionMetricValues = NonNullable<Query['conversionMetrics']>
type ConversionMetric = Exclude<keyof ConversionMetricValues, 'id'>

const getMetricTotal = (metrics: ConversionMetricValues) =>
  typedObjectEntries(metrics).reduce(
    (total, [metric, value]) =>
      metric !== 'id' && typeof value === 'number' ? total + value : total,
    0
  )

type ConversionMetricsAction =
  | { type: 'replace'; metrics: ConversionMetricValues }
  | { type: 'change'; metric: ConversionMetric; value: number }

/** Prevents the sum total of rates from exceeding 100%. */
const conversionMetricsReducer = (
  state: ConversionMetricValues | undefined,
  action: ConversionMetricsAction
): ConversionMetricValues | undefined => {
  if (action.type === 'replace') {
    return action.metrics
  }

  if (!state) {
    return state
  }

  const nextMetrics = {
    ...state,
    [action.metric]: action.value,
  }

  return getMetricTotal(nextMetrics) > 100 ? state : nextMetrics
}

/**
 * Allows configuring rates of bounces, replies,
 *  acceptances, unsubscriptions, etc...
 */
export const ConversionMetrics = () => {
  const metrics = useQuery(
    gql`
      query conversionMetricsQuery {
        conversionMetrics {
          id
          bounceRate
          ignoreRate
          unsubscribeRate
          notInterested
          oooRate
          referralRate
          interested
          meetingRate
        }
      }
    ` as TypedDocumentNode<Pick<Query, 'conversionMetrics'>>
  )

  const fetchedMetrics = metrics.data?.conversionMetrics
  const [conversionMetrics, dispatchMetrics] = useReducer(
    conversionMetricsReducer,
    undefined
  )
  const currentMetrics = { ...(conversionMetrics ?? fetchedMetrics) }
  delete currentMetrics?.__typename
  delete currentMetrics?.id

  const [commitNewMetrics] = useMutation(
    gql`
      mutation configureConversionMetricsMutation(
        $metrics: ConversionMetricsInput!
      ) {
        configureConversionMetrics(metrics: $metrics) {
          id
        }
      }
    ` as TypedDocumentNode<Pick<Mutation, 'configureConversionMetrics'>>,
    {
      onCompleted: () => {
        metrics.refetch()
      },
      variables: {
        metrics: currentMetrics,
      },
    }
  )

  useEffect(() => {
    if (fetchedMetrics) {
      dispatchMetrics({ type: 'replace', metrics: fetchedMetrics })
    }
  }, [fetchedMetrics])

  return (
    <Paper
      component='section'
      id='conversion-metrics'
      elevation={1}
      sx={{ p: 3, mt: 3 }}
    >
      <Typography component='h2' variant='h6' gutterBottom>
        Conversion Metrics
      </Typography>
      <Typography color='text.secondary' variant='body2' sx={{ mb: 2 }}>
        Configure rates for conversion outcomes. The total must not exceed 100%.
      </Typography>

      <form
        id='conversion-metrics-form'
        onSubmit={(event) => event.preventDefault()}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ flexWrap: 'wrap', gap: '1rem' }}
        >
          {typedObjectEntries(currentMetrics ?? {}).map(([metric, value]) => {
            if (metric === 'id' || metric === '__typename') {
              return null
            }

            const label = metric
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (firstLetter) => firstLetter.toUpperCase())

            return (
              <>
                <TextField
                  key={metric}
                  id={`input-${metric}`}
                  label={label}
                  type='number'
                  value={typeof value === 'number' ? value : ''}
                  slotProps={{
                    htmlInput: { min: 0, max: 100 },
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>%</InputAdornment>
                      ),
                    },
                  }}
                  onChange={(event) =>
                    dispatchMetrics({
                      type: 'change',
                      metric,
                      value: Number(event.currentTarget.value),
                    })
                  }
                  sx={{ flex: '1 1 180px', minWidth: '2rem', margin: '0px' }}
                />
              </>
            )
          })}
        </Stack>
        <Button
          type='button'
          onClick={() => commitNewMetrics()}
          variant='outlined'
          sx={{ marginTop: '1rem' }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  )
}
