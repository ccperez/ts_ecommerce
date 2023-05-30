import { useEffect, useReducer } from 'react'
import { Col, Row } from 'react-bootstrap'

import Loading from '../components/Loading'
import Message from '../components/Message'
import ProductItem from '../components/ProductItem'

import { State, Action } from '../state/types/Product'
import { stateProducts } from '../state/initialState'
import { reducerProducts } from '../state/reducers/product'
import { fetchProducts } from '../state/actions/product'

export default function HomePage() {
	const [{ loading, error, products }, dispatch] =
		useReducer<React.Reducer<State, Action>>(reducerProducts, stateProducts)

	useEffect(() => {
		fetchProducts(dispatch)
	}, [])

	return loading ? (
		<Loading />
	) : error ? (
		<Message variant="danger">{error}</Message>
	) : (
		<Row>
			{products.map((product) => (
				<Col key={product.slug} sm={6} md={4} lg={3}>
					<ProductItem product={product} />
				</Col>
			))}
		</Row>
	)
}
