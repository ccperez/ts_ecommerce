import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Col, Row } from 'react-bootstrap'

import Loading from '../components/Loading'
import Message from '../components/Message'
import { CardContainer, ShippingInfo, Payment, Cart, Summary } from '../components/order'

import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import { useGetOrderDetailsQuery } from '../hooks/orderHooks'

export default function OrderPage() {
  const { id: orderId } = useParams()

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId!)

  return isLoading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{getError(error as ApiError)}</Message>
  ) : !order ? (
    <Message variant="danger">Order Not Found</Message>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <CardContainer order={order} title='shipping'>
            <ShippingInfo shippingAddress={order.shippingAddress} />
          </CardContainer>
          <CardContainer order={order} title='payment'>
            <Payment paymentMethod={order.paymentMethod} />
          </CardContainer>
          <CardContainer order={order} title='Items'>
            <Cart items={order.orderItems} />
          </CardContainer>
        </Col>
        <Col md={4}>
          <CardContainer order={order} title='order summary'>
            <Summary
              itemsPrice={order.itemsPrice}
              shippingPrice={order.shippingPrice}
              taxPrice={order.taxPrice}
              totalPrice={order.totalPrice}
            />
          </CardContainer>
        </Col>
      </Row>
    </div>
  )
}
