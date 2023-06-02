import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Row, Col, Card, ListGroup, Badge, Button } from 'react-bootstrap'

import Message from '../components/Message'
import Loading from '../components/Loading'
import Rating from '../components/Rating'

import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

import { useGetProductDetailsBySlugQuery } from '../hooks/productHooks'

export default function ProductPage() {
  const { slug } = useParams()

  const { data: product, isLoading, error } = useGetProductDetailsBySlugQuery(slug!)

  return isLoading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{getError(error as ApiError)}</Message>
  ) : !product ? (
    <Message variant="danger">Product Not Fount</Message>
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
                      <Button variant="primary">Add to Cart</Button>
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
