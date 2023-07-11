import { Helmet } from 'react-helmet-async'
import { Row, Col, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Loading from '../components/Loading'
import Message from '../components/Message'
import ProductItem from '../components/ProductItem'
import Rating from '../components/Rating'

import { Product } from '../types/Product'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import searchAttr from '../searchAttributes'

import { useGetCategoriesQuery, useGetSearchProductsQuery } from '../hooks/productHooks'

export default function SearchPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search) // /search?category=Shirt
  const category = sp.get('category') || 'all'
  const query = sp.get('query') || 'all'
  const price = sp.get('price') || 'all'
  const rating = sp.get('rating') || 'all'
  const order = sp.get('order') || 'newest'
  const page = sp.get('page') || 1

  const { prices, ratings } = searchAttr

  const { data: categories } = useGetCategoriesQuery()

  const { isLoading, error, data } =
    useGetSearchProductsQuery({ page, query, category, price, rating, order })

  const filter: any = data || []

  const filterUrl = (filter: any) => {
    const filterPage = filter.page || page
    const filterCategory = filter.category || category
    const filterQuery = filter.query || query
    const filterRating = filter.rating || rating
    const filterPrice = filter.price || price
    const sortOrder = filter.order || order
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
  }

  const FilterLink = ({ name, filter, isSelected }: { name: any, filter: {}, isSelected: boolean | any }) =>
    <Link style={{ fontWeight: isSelected ? 'bold' : 'normal' }} to={filterUrl(filter)}>{name}</Link>

  const FilterList = ({ type }: { type: string }) => (
    <div>
      <h3>{type}</h3>
      {type === 'Categories' ? (
        <ul>
          <li>
            <FilterLink
              name='Any'
              filter={{ category: 'all' }}
              isSelected={category == 'all'}
            />
          </li>
          {categories!.map((ctgry) => (
            <li key={ctgry}>
              <FilterLink
                name={ctgry}
                filter={{ category: ctgry }}
                isSelected={category === ctgry}
              />
            </li>
          ))}
        </ul>
      ) : type === 'Price' ? (
        <ul>
          <li>
            <FilterLink
              name='Any'
              filter={{ price: 'all' }}
              isSelected={price === 'all'}
            />
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <FilterLink
                name={p.name}
                filter={{ price: p.value }}
                isSelected={price === p.value}
              />
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          {ratings.map((r) => (
            <li key={r.name}>
              <FilterLink
                name={<Rating caption={' & up'} rating={r.rating} />}
                filter={{ rating: r.rating }}
                isSelected={`${r.rating}` === `${rating}`}
              />
            </li>
          ))}
          <li>
            <FilterLink
              name={<Rating caption={' & up'} rating={0} />}
              filter={{ rating: 'all' }}
              isSelected={rating === 'all'}
            />
          </li>
        </ul>
      )}
    </div>
  )

  const FilterSummaryResult = () => (
    <Col md={6}>
      <div>
        {filter.countProducts > 0 ? filter.countProducts : 'No'} Results
        {query !== 'all' && ' : ' + query}
        {category !== 'all' && ' : ' + category}
        {price !== 'all' && ' : Price ' + price}
        {rating !== 'all' && ' : Rating ' + rating + ' & up'}
        {query !== 'all' ||
          category !== 'all' ||
          rating !== 'all' ||
          price !== 'all' ? (
          <Button
            variant="light"
            onClick={() => navigate('/search')}
          >
            <i className="fas fa-times-circle" />
          </Button>
        ) : null}
      </div>
    </Col>
  )

  const FilterSortItems = () => (
    <Col className="text-end">
      Sort by{' '}
      <select
        value={order}
        onChange={(e) => {
          navigate(filterUrl({ order: e.target.value }))
        }}
      >
        <option value="newest">Newest Arrivals</option>
        <option value="lowest">Price: Low to High</option>
        <option value="highest">Price: High to Low</option>
        <option value="toprated">Avg. Customer Reviews</option>
      </select>
    </Col>
  )

  const FilterPageItems = () => (
    <div>
      {[...Array(filter.pages).keys()].map((x) => (
        <LinkContainer
          key={x + 1}
          className="mx-1"
          to={searchItem({ page: x + 1 })}
        >
          <Button
            className={Number(page) === x + 1 ? 'text-bold' : ''}
            variant="light"
          >
            {x + 1}
          </Button>
        </LinkContainer>
      ))}
    </div>
  )

  const FilterProducts = () => (
    <Row>
      {filter.products!.map((product: Product) =>
        <Col sm={6} lg={4} className="mb-3" key={product._id}>
          <ProductItem product={product} />
        </Col>
      )}
    </Row>
  )

  const searchItem = (item: any): { pathname: string, search: string } => {
    return { pathname: '', search: filterUrl(item) }
  }

  return (
    <div>
      <Helmet>
        <title>Search  Products</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <FilterList type={'Categories'} />
          <FilterList type={'Price'} />
          <FilterList type={'Avg. Customer Review'} />
        </Col>
        <Col md={9}>
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Message variant="danger">{getError(error as ApiError)}</Message>
          ) : !filter ? (
            <Message variant="danger">Product Not Found</Message>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <FilterSummaryResult />
                <FilterSortItems />
              </Row>
              <FilterProducts />
              <FilterPageItems />
            </>
          )}
        </Col>
      </Row>
    </div>
  )
}
