import { Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'

import Loading from '../components/Loading'
import Message from '../components/Message'

import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useGetOrderHistoryQuery } from '../hooks/orderHooks'

export default function OrderHistoryPage() {
  const navigate = useNavigate()

  const { data: orders, isLoading, error } = useGetOrderHistoryQuery()

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
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders!.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/order/${order._id}`}>{order._id}</Link>
                </td>
                <td>{order.createdAt ? order.createdAt.substring(0, 10) : null}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`)
                    }}
                  >
                    Details
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
