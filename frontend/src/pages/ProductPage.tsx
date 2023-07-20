import { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap'

import Message from '../components/Message'
import Loading from '../components/Loading'
import Rating from '../components/Rating'

import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

import { useGetProductDetailsBySlugQuery } from '../hooks/productHooks'
import { addToCart } from '../stateMgmt/actions/cartActions'
import fn from '../functions/cart'

let crtItmQtyEQStck = false

export default function ProductPage() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const { state: { cart: { cartItems }, }, dispatch, } = useContext(Store)

  const { data: product, isLoading, error } = useGetProductDetailsBySlugQuery(slug!)

  const addToCartHandler = () => {
    addToCart(dispatch, cartItems, product!)
    navigate('/')
  }

  if (product!) crtItmQtyEQStck = fn.cart.itemQtyEQStock(cartItems, product._id, product.countInStock)

  return isLoading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{getError(error as ApiError)}</Message>
  ) : !product ? (
    <Message variant="danger">Product Not Found</Message>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="large" src={product.image} alt={product.name}></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        variant="primary"
                        disabled={crtItmQtyEQStck}
                        onClick={() => addToCartHandler()}
                      >
                        {crtItmQtyEQStck ? 'Quantity equal stock' : 'Add to cart'}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
