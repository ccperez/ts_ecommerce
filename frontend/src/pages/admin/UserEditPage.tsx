import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Message from '../../components/Message'
import Loading from '../../components/Loading'

import { ApiError } from '../../types/ApiError'
import { getError } from '../../utils'

import { useGetUserQuery, useUpdateUserMutation } from '../../hooks/userHooks'

export default function UserEditPage() {
  const navigate = useNavigate()
  const params = useParams()
  const idUser = params.id

  const [isAdmin, setIsAdmin] = useState(false)

  const { data: user, isLoading, error } = useGetUserQuery(idUser!)
  const { mutateAsync: updateUser, isLoading: loadingUpdate } = useUpdateUserMutation()

  useEffect(() => {
    if (user) setIsAdmin(user.isAdmin)
  }, [user])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await updateUser({ id: idUser!, isAdmin })
      toast.success('User updated successfully')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  return (
    <Container className="smaller-container">
      <Helmet>
        <title>Edit User</title>
      </Helmet>
      <h1 className="my-3 text-center text-capitalize">Edit User</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{getError(error as ApiError)}</Message>
      ) : !user ? (
        <Message variant="danger">User Not Found</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <table className="table">
            <tr>
              <td>Name</td>
              <td>{user.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>
                <Form.Check
                  className="mb-3"
                  type="checkbox"
                  id="isAdmin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </td>
            </tr>
          </table>
          <div className="mb-3">
            <Button type="submit">
              {loadingUpdate ? 'Loading...' : 'Edit'}
            </Button>
            &nbsp;
            <Button onClick={() => navigate(`/admin/users`)}>
              Back
            </Button>
          </div>
        </Form>
      )}
    </Container>
  )
}
