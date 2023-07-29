import { useState, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import Loading from '../../components/Loading'
import Message from '../../components/Message'
import PromptConfirmation from '../../components/PromptConfirmation'

import { Store } from '../../Store'
import { getError } from '../../utils'
import { ApiError } from '../../types/ApiError'

import { useGetUsersQuery, useDeleteUserMutation } from '../../hooks/userHooks'

export default function UserListPage() {
  const navigate = useNavigate()

  const { state: { userInfo } } = useContext(Store)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [deleteItem, setDeleteItem] = useState('')

  const { data: users, isLoading, error, refetch } = useGetUsersQuery()
  const { mutateAsync: deleteUser } = useDeleteUserMutation()

  const editHandler = (idUser: string) =>
    navigate(`/admin/user/${idUser}`)

  const deleteUserHandler = async (idUser: string) => {
    try {
      await deleteUser(idUser)
      refetch()
      toast.success('User deleted successfully')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
    setShowConfirmationModal(false);
  }

  const showModal = (title: string, id?: string, name?: string) => {
    setDeleteItem(id!)
    setModalMessage(`${title} ${name} user?`)
    setModalTitle(title)
    setShowConfirmationModal(true)
  }

  const hideConfirmationModal = () => setShowConfirmationModal(false)

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
        <>
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
                    {userInfo!._id !== user._id && (
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => editHandler(user._id)}
                      >
                        Edit
                      </Button>
                    )}
                    &nbsp;
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => showModal('Delete', user._id, user.name)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PromptConfirmation
            showModal={showConfirmationModal}
            confirmModal={deleteUserHandler}
            hideModal={hideConfirmationModal}
            deleteItem={deleteItem}
            title={modalTitle}
            message={modalMessage}
          />
        </>
      )
      }
    </div >
  )
}
