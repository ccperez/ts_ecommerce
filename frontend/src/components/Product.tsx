import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Product(props: any) {
	const { name, slug, image, price } = props.product

	return (
		<Col sm={6} md={4} lg={3}>
			<Link to={`/product/${slug}`}>
				<img
					src={image}
					alt={name}
					className="product-image"
				/>
				<h3>{name}</h3>
				<p>${price}</p>
			</Link>
		</Col>
	)
}
