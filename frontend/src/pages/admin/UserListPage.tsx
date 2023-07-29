import { Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'

import Loading from '../../components/Loading'
import Message from '../../components/Message'

import { getError } from '../../utils'
import { ApiError } from '../../types/ApiError'

import { useGetUsersQuery } from '../../hooks/userHooks'

export default function UserListPage() {
  const { data: users, isLoading, error } = useGetUsersQuery()

  const editHandler = (id: string) => { }
  const deleteHandler = (id: string) => { }

  return (
    <div>
      <Helmet>
        <title>
          Users List
        </title>
      </Helmet>
      <h1>Users List</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{getError(error as ApiError)}</Message>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users!.map((user) => (
              <tr key={user._id}>
                <td>{user._id!}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                  <Button
                    type='button'
                    variant='light'
                    onClick={() => editHandler('1')}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    type='button'
                    variant='light'
                    onClick={() => deleteHandler('1')}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
