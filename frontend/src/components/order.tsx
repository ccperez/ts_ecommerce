import { Card, Col, ListGroup, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { CartItem, ShippingAddress } from '../types/Cart'
import { iOrdered } from '../types/Order'

import Message from './Message'

export const CardContainer = (
  { order, title, children }: { order?: iOrdered, title: string, children: React.ReactNode }
) =>
  <Card className={title.includes('summary') ? "" : "mb-3"}>
    <Card.Body>
      <Card.Title className='text-capitalize'>{title}</Card.Title>
      {children}
      {order
        ? title === 'shipping' && order.isDelivered
          ? <Message variant="success">Delivered at {order.deliveredAt}</Message>
          : title === 'payment' && order.isPaid
            ? <Message variant="success">Paid at {order.paidAt}</Message>
            : <>
              {title === 'shipping' && <Message variant="warning">Not Delivered</Message>}
              {title === 'payment' && <Message variant="warning">Not Paid</Message>}
            </>
        : <Row>
          <Col>
            <div className='text-end'>
              {!title.includes('summary') && <Link to={`/${title}`}>Edit</Link>}
            </div>
          </Col>
        </Row>
      }
    </Card.Body>
  </Card>

export const ShippingInfo = ({ shippingAddress }: { shippingAddress: ShippingAddress }) => {
  const { fullName, address, city, postalCode, country } = shippingAddress
  return (
    <Card.Text>
      <strong>Name:</strong> {fullName} <br />
      <strong>Address: </strong>{`${address}, ${city}, ${postalCode}, ${country}`}
    </Card.Text>
  )
}

export const Payment = ({ paymentMethod }: { paymentMethod: string }) =>
  <Card.Text>
    <strong>Method:</strong> {paymentMethod}
  </Card.Text>

export const Cart = ({ items }: { items: CartItem[] }) =>
  <ListGroup variant="flush">
    {items.map((item) => (
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

export const Summary = (
  { itemsPrice, shippingPrice, taxPrice, totalPrice, buttonComponent }:
    { itemsPrice: number, shippingPrice: number, taxPrice: number, totalPrice: number, buttonComponent?: any }
) =>
  <ListGroup variant="flush">
    <RowItem title='Items' item={itemsPrice.toFixed(2)} />
    <RowItem title='Shipping' item={shippingPrice.toFixed(2)} />
    <RowItem title='Tax' item={taxPrice.toFixed(2)} />
    <RowItem title='Order Total' item={totalPrice.toFixed(2)} />
    {buttonComponent}
  </ListGroup>