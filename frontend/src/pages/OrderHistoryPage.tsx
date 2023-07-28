import { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import Loading from '../components/Loading'
import Message from '../components/Message'
import PromptConfirmation from '../components/PromptConfirmation'

import { Store } from '../Store'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useGetOrderHistoryQuery, useDeleteOrderMutation } from '../hooks/orderHooks'

export default function OrderHistoryPage() {
  const { state: { userInfo } } = useContext(Store)
  const isAdmin = userInfo?.isAdmin

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [deleteItem, setDeleteItem] = useState('')

  const { data: orders, isLoading, error, refetch } = useGetOrderHistoryQuery()
  const { mutateAsync: deleteOrder } = useDeleteOrderMutation()

  const deleteOrderHandler = async (idOrder: string) => {
    try {
      await deleteOrder(idOrder)
      refetch()
      toast.success('Order deleted successfully')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
    setShowConfirmationModal(false);
  }

  const orderStatus = (status: boolean, date: string) =>
    status ? date.substring(0, 10) : 'No'

  const showModal = (title: string, id?: string, name?: string) => {
    setDeleteItem(id!)
    setModalMessage(`${title} ${name} order?`)
    setModalTitle(title)
    setShowConfirmationModal(true)
  }

  const hideConfirmationModal = () => setShowConfirmationModal(false)

  return (
    <div>
      <Helmet>
        <title>
          Order History
        </title>
      </Helmet>
      <h1>Order History</h1>
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
                {isAdmin && <th>USER</th>}
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders!.map((order: any) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6)}</td>
                  {isAdmin && <td>{order.user?.name}</td>}
                  <td>{order.createdAt ? order.createdAt.substring(0, 10) : null}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>{orderStatus(order.isPaid, order.paidAt)}</td>
                  <td>{orderStatus(order.isDelivered, order.deliveredAt)}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light">Details</Button>
                    </LinkContainer>
                    &nbsp;
                    {!order.isPaid && !order.isDelivered && (
                      <Button type="button" variant="light" onClick={() => showModal('Delete', order._id, order._id)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PromptConfirmation
            showModal={showConfirmationModal}
            confirmModal={deleteOrderHandler}
            hideModal={hideConfirmationModal}
            deleteItem={deleteItem}
            title={modalTitle}
            message={modalMessage}
          />
        </>
      )}
    </div>
  )
}
