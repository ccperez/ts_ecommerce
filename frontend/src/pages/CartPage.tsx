import { useContext } from 'react'
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import { CartItem } from '../types/Cart';
import { Store } from '../Store'
import { updateCart, removeItem } from '../stateMgmt/actions/cartActions'
import fn from '../functions/cart'

export default function CartPage() {
	const navigate = useNavigate()

	const { state: { mode, cart: { cartItems }, }, dispatch, } = useContext(Store)

	const updateCartHandler = (type: string, item: CartItem) =>
		updateCart(dispatch, item, type === 'm' ? item.quantity - 1 : item.quantity + 1)

	const checkoutHandler = () => navigate('/signin?redirect=/shipping')

	const removeItemHandler = (item: CartItem) => removeItem(dispatch, item)

	return (
		<div>
			<Helmet>
				<title>Shopping Cart</title>
			</Helmet>
			<h1>Shopping Cart</h1>
			<Row>
				<Col md={8}>
					{cartItems.length === 0 ? (
						<Message>
							Cart is empty. <Link to="/">Go Shopping</Link>
						</Message>
					) : (
						<ListGroup>
							{cartItems.map((item: CartItem) => (
								<ListGroup.Item key={item._id}>
									<Row className="align-items-center">
										<Col md={4}>
											<img
												src={item.image}
												alt={item.name}
												className="img-fluid rounded thumbnail"
											></img>{' '}
											<Link to={`/product/${item.slug}`}>{item.name}</Link>
										</Col>
										<Col md={3}>
											<Button
												variant={mode}
												disabled={item.quantity === 1}
												onClick={() => updateCartHandler('m', item)}
											>
												<i className="fas fa-minus-circle" />
											</Button>{' '}
											<span className='cart-qty'>{item.quantity}</span>
											<Button
												variant={mode}
												disabled={item.quantity === item.countInStock}
												onClick={() => updateCartHandler('p', item)}
											>
												<i className="fas fa-plus-circle" />
											</Button>
										</Col>
										<Col md={1}>${item.price}</Col>
										<Col md={2}>${fn.cart.totalPrice(item)}</Col>
										<Col md={2}>
											<Button variant={mode} onClick={() => removeItemHandler(item)}>
												<i className="fas fa-trash" />
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Col>
				<Col md={4}>
					<Card>
						<Card.Body>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h3>
										Subtotal ({fn.cart.totalItems(cartItems)}{' '}items) : ${fn.cart.totalAmount(cartItems)}
									</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<div className="d-grid">
										<Button
											type="button"
											variant="primary"
											disabled={cartItems.length === 0}
											onClick={checkoutHandler}
										>
											Proceed to Checkout
										</Button>
									</div>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	)
}
