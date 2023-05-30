import { useEffect, useReducer } from 'react'
import { Row } from 'react-bootstrap'

import Loading from '../components/Loading'
import Message from '../components/Message'
import Product from '../components/Product'

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
				<Product key={product.slug} product={product} />
			))}
		</Row>
	)
}
