import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import CheckoutSteps from '../components/CheckoutSteps'

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

  const CardContainer = ({ title, children }: { title: string, children: React.ReactNode }) =>
    <Card className={title.includes('summary') ? "" : "mb-3"}>
      <Card.Body>
        <Card.Title className='text-capitalize'>{title}</Card.Title>
        {children}
        <Row>
          <Col>
            <div className='text-end'>
              {!title.includes('summary') && <Link to={`/${title}`}>Edit</Link>}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>

  const ShippingAddress = () =>
    <Card.Text>
      <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
      <strong>Address: </strong> {cart.shippingAddress.address},
      {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
      {cart.shippingAddress.country}
    </Card.Text>

  const Payment = () =>
    <Card.Text>
      <strong>Method:</strong> {cart.paymentMethod}
    </Card.Text>

  const Cart = () =>
    <ListGroup variant="flush">
      {cart.cartItems.map((item) => (
        <ListGroup.Item key={item._id}>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src={item.image}
                alt={item.name}
                className="img-fluid rounded thumbnail"
              />{' '}
              <Link to={`/product/${item.slug}`}>{item.name}</Link>
            </Col>
            <Col md={2}><span>{item.quantity}</span></Col>
            <Col md={2}>$ {item.quantity * item.price}</Col>
            <Col md={2}>$ {item.price}</Col>
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>

  const RowItem = ({ title, item }: { title: string, item: string }) =>
    <ListGroup.Item>
      <Row>
        <Col md={7}>
          {title.includes('Total') ? <strong>{title}</strong> : <span>{title}</span>}
        </Col>
        <Col md={1}>$</Col>
        <Col md={4}>
          <div className='text-end'>
            {title.includes('Total') ? <strong>{item}</strong> : <span>{item}</span>}
          </div>
        </Col>
      </Row>
    </ListGroup.Item>

  const OrderButton = () =>
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

  const Summary = () =>
    <ListGroup variant="flush">
      <RowItem title='Items' item={cart.itemsPrice.toFixed(2)} />
      <RowItem title='Shipping' item={cart.shippingPrice.toFixed(2)} />
      <RowItem title='Order Total' item={cart.totalPrice.toFixed(2)} />
      <OrderButton />
    </ListGroup>

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
            <ShippingAddress />
          </CardContainer>
          <CardContainer title='payment'>
            <Payment />
          </CardContainer>
          <CardContainer title='cart'>
            <Cart />
          </CardContainer>
        </Col>
        <Col md={4}>
          <CardContainer title='order summary'>
            <Summary />
          </CardContainer>
        </Col>
      </Row>
    </div>
  )
}
