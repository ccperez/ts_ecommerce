import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Product } from '../state/types/Product'
import Rating from './Rating'

interface ProductProps {
	product: Product
}

export default function ProductItem({ product }: ProductProps) {
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
					<Button>Add to cart</Button>
				)}
			</Card.Body>
		</Card>
	)
}
