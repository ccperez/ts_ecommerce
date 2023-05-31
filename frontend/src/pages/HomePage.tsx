import { Col, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'

import Loading from '../components/Loading'
import Message from '../components/Message'
import ProductItem from '../components/ProductItem'

import { useGetProductsQuery } from '../hooks/productHooks'
import { getError } from '../utils/getError'
import { ApiError } from '../types/ApiError'
import { Product } from '../types/Product'

export default function HomePage() {
	const { data: products, isLoading, error } = useGetProductsQuery()

	return isLoading ? (
		<Loading />
	) : error ? (
		<Message variant="danger">{getError(error as ApiError)}</Message>
	) : (
		<Row>
			<Helmet>
				<title>TS Amazona</title>
			</Helmet>
			{products!.map((product: Product) => (
				<Col key={product.slug} sm={6} md={4} lg={3}>
					<ProductItem product={product} />
				</Col>
			))}
		</Row>
	)
}
