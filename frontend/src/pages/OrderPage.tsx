import { useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Button, Col, ListGroup, Row } from 'react-bootstrap'
import { PayPalButtons, PayPalButtonsComponentProps, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'

import Loading from '../components/Loading'
import Message from '../components/Message'
import { CardContainer, ShippingInfo, Payment, Cart, Summary } from '../components/order'

import { Store } from '../Store'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation
} from '../hooks/orderHooks'

export default function OrderPage() {
  const { id: orderId } = useParams()

  const { state: { userInfo } } = useContext(Store)

  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId!)
  const { mutateAsync: payOrder, isLoading: loadingPay } = usePayOrderMutation()
  const { mutateAsync: deliverOrder, isLoading: loadingDeliver } = useDeliverOrderMutation()

  const testPayHandler = async () => {
    await payOrder({ orderId: orderId! })
    refetch()
    toast.success('Order is paid')
  }

  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer()

  const { data: paypalConfig } = useGetPaypalClientIdQuery()

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypalConfig!.clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        })
      }
      loadPaypalScript()
    }
  }, [paypalConfig])

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID: string) => orderID)
    },
    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          await payOrder({ orderId: orderId!, ...details })
          refetch()
          toast.success('Order is paid successfully')
        } catch (err) {
          toast.error(getError(err as ApiError))
        }
      })
    },
    onError: (err) => toast.error(getError(err as ApiError)),
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId!)
      refetch()
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const OrderButton = () =>
    <>
      {!order?.isPaid && (
        <ListGroup.Item>
          {isPending ? (
            <Loading />
          ) : isRejected ? (
            <Message variant="danger">Error in connecting to PayPal</Message>
          ) : (
            <div>
              <PayPalButtons {...paypalbuttonTransactionProps} />
              <Button onClick={testPayHandler}>Test Pay</Button>
            </div>
          )}
          {loadingPay && <Loading />}
        </ListGroup.Item>
      )}
      {userInfo?.isAdmin && (
        <ListGroup.Item>
          <div className="d-grid">
            <Button type="button" onClick={deliverOrderHandler}>
              {loadingDeliver ? 'Loading...' : 'Order Deliver'}
            </Button>
          </div>
        </ListGroup.Item>
      )}
    </>

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
              buttonComponent={<OrderButton />}
            />
          </CardContainer>
        </Col>
      </Row>
    </div>
  )
}
