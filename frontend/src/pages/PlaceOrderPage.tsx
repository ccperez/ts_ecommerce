import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Button, Col, ListGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

import CheckoutSteps from '../components/CheckoutSteps'
import { CardContainer, ShippingInfo, Payment, Cart, Summary } from '../components/order'

import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'
import { useCreateOrderMutation } from '../hooks/orderHooks'
import fn from '../functions/order'

export default function PlaceOrderPage() {
  const navigate = useNavigate()

  const { state: { cart }, dispatch } = useContext(Store)

  cart.itemsPrice = fn.order.itemsPrice(cart.cartItems)
  cart.shippingPrice = fn.order.shippingPrice(cart.itemsPrice)
  cart.taxPrice = fn.order.taxPrice(cart.itemsPrice)
  cart.totalPrice = fn.order.totalPrice(cart)

  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation()

  useEffect(() => {
    if (!cart.paymentMethod) navigate('/payment')
  }, [cart, navigate])

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const PlaceOrderButton = () =>
    <ListGroup.Item>
      <div className="d-grid">
        <Button
          type="button"
          onClick={placeOrderHandler}
          disabled={cart.cartItems.length === 0 || isLoading}
        >
          {isLoading ? 'Loading...' : 'Place Order'}
        </Button>
      </div>
    </ListGroup.Item>

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <CardContainer title='shipping'>
            <ShippingInfo shippingAddress={cart.shippingAddress} />
          </CardContainer>
          <CardContainer title='payment'>
            <Payment paymentMethod={cart.paymentMethod} />
          </CardContainer>
          <CardContainer title='cart'>
            <Cart items={cart.cartItems} />
          </CardContainer>
        </Col>
        <Col md={4}>
          <CardContainer title='order summary'>
            <Summary
              itemsPrice={cart.itemsPrice}
              shippingPrice={cart.shippingPrice}
              taxPrice={cart.taxPrice}
              totalPrice={cart.totalPrice}
              buttonComponent={<PlaceOrderButton />}
            />
          </CardContainer>
        </Col>
      </Row>
    </div>
  )
}
