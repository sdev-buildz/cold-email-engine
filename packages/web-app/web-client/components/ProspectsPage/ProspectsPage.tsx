import { gql, type TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { Query } from '@types-gen-react-apollo'

/**
 * The page has a list of available prospects.
 */
export const ProspectsPage = () => {
  const prospects = useQuery(
    gql`
      query prospectsQuery {
        prospects {
          id
          name
          email
          company
          role
          timezone
          status
          isDeactivated
        }
      }
    ` as TypedDocumentNode<Pick<Query, 'prospects'>>,
    {
      fetchPolicy: 'cache-first',
    }
  )

  return (
    <div>
      <h1>Prospects</h1>
      {prospects.loading && <p>Loading prospects...</p>}
      <TableContainer component={Paper}>
        <Table size="small" aria-label="prospects table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Timezone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deactivated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prospects.data?.prospects?.map((prospect) => (
              <TableRow key={prospect.id}>
                <TableCell>{prospect.name}</TableCell>
                <TableCell>{prospect.email}</TableCell>
                <TableCell>{prospect.company}</TableCell>
                <TableCell>{prospect.role}</TableCell>
                <TableCell>{prospect.timezone}</TableCell>
                <TableCell>{prospect.status}</TableCell>
                <TableCell>{String(prospect.isDeactivated)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
