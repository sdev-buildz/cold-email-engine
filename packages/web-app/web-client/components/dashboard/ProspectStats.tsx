import { gql, type TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import type { Query } from '@types-gen-react-apollo'

const formatCount = (value: number | null | undefined) =>
  typeof value === 'number' ? value.toLocaleString() : '—'

const formatPercent = (value: number | null | undefined) =>
  typeof value === 'number' ? `${value.toFixed(1)}%` : '—'

/**
 * The Stats fof the prospects such as percent deactivated, active, stage in workflow sequence, etc...
 */
export const ProspectStats = () => {
  const stats = useQuery(
    gql`
      query statsQuery {
        prospectStats {
          activePercent
          activeProspects
          sendingTodayCount
          sendingTomorrowCount
          deactivatedPercent
          deactivatedProspects
          statusBreakdown {
            count
            percent
            status
          }
          totalProspects
        }
      }
    ` as TypedDocumentNode<Pick<Query, 'prospectStats'>>,
    {
      fetchPolicy: 'network-only',
    }
  )
  const prospectStats = stats.data?.prospectStats

  return (
    <Paper
      component='section'
      className='prospect-stats'
      elevation={1}
      sx={{ p: 3, mt: 3 }}
    >
      <Typography component='h2' variant='h6' gutterBottom>
        Prospect Stats
      </Typography>

      {stats.loading && (
        <Typography color='text.secondary' role='status' sx={{ mb: 2 }}>
          Loading prospect stats...
        </Typography>
      )}
      {stats.error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Could not load prospect stats: {stats.error.message}
        </Alert>
      )}

      {prospectStats && (
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ flexWrap: 'wrap' }}
          >
            <Card variant='outlined' sx={{ flex: '1 1 180px' }}>
              <CardContent>
                <Typography color='text.secondary' variant='body2'>
                  Total prospects
                </Typography>
                <Typography component='p' variant='h4'>
                  {formatCount(prospectStats.totalProspects)}
                </Typography>
              </CardContent>
            </Card>
            <Card variant='outlined' sx={{ flex: '1 1 180px' }}>
              <CardContent>
                <Typography color='text.secondary' variant='body2'>
                  Active prospects
                </Typography>
                <Typography component='p' variant='h4'>
                  {formatCount(prospectStats.activeProspects)}
                </Typography>
                <Typography color='text.secondary' variant='body2'>
                  {formatPercent(prospectStats.activePercent)} of total
                </Typography>
              </CardContent>
            </Card>
            <Card variant='outlined' sx={{ flex: '1 1 180px' }}>
              <CardContent>
                <Typography color='text.secondary' variant='body2'>
                  Sending today
                </Typography>
                <Typography component='p' variant='h4'>
                  {formatCount(prospectStats.sendingTodayCount)}
                </Typography>
                <Typography color='text.secondary' variant='body2'>
                  Sending tomorrow:{' '}
                  {/* {formatCount(prospectStats.sendingTomorrowCount)} */}
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          {prospectStats.statusBreakdown &&
            prospectStats.statusBreakdown.length > 0 && (
              <div>
                <Typography component='h3' variant='subtitle1' gutterBottom>
                  Workflow status
                </Typography>
                <TableContainer component={Paper} variant='outlined'>
                  <Table
                    size='small'
                    aria-label='Prospect workflow status breakdown'
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align='right'>Prospects</TableCell>
                        <TableCell sx={{ width: '40%' }}>Share</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prospectStats.statusBreakdown.map((status) => (
                        <TableRow key={status.status}>
                          <TableCell component='th' scope='row'>
                            {status.status ?? 'Unknown'}
                          </TableCell>
                          <TableCell align='right'>
                            {formatCount(status.count)}
                          </TableCell>
                          <TableCell>
                            <Stack direction='row' spacing={1}>
                              <LinearProgress
                                variant='determinate'
                                value={
                                  typeof status.percent === 'number'
                                    ? Math.min(Math.max(status.percent, 0), 100)
                                    : 0
                                }
                                aria-label={`${status.status ?? 'Unknown'} share`}
                                sx={{ flex: 1 }}
                              />
                              <Typography
                                color='text.secondary'
                                variant='body2'
                                sx={{ minWidth: '3.5rem', textAlign: 'right' }}
                              >
                                {formatPercent(status.percent)}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
        </Stack>
      )}
    </Paper>
  )
}
