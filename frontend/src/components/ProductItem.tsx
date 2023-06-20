import { useState, useContext } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import { Store } from '../Store'
import { Product } from '../types/Product'
import { addToCart } from '../stateMgmt/actions/cartActions'
import fn from '../functions/cart'

interface ProductProps { product: Product }

export default function ProductItem({ product }: ProductProps) {
  const [shwTltp, setShwTltp] = useState(false);

  const { state: { cart: { cartItems }, }, dispatch, } = useContext(Store)

  const addToCartHandler = () => shwTltp ? null : addToCart(dispatch, cartItems, product)

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <>
            <Button
              onClick={addToCartHandler}
              onMouseEnter={() => setShwTltp(fn.cart.itemQtyEQStock(cartItems, product._id, product.countInStock))}
              onMouseLeave={() => setShwTltp(false)}
            >
              Add to cart
            </Button>
            {shwTltp && (
              <>
                <div className='qty-hnt'>Quantity equal current stock!</div>
                <div className="qty-hnt-arrw" />
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  )
}
