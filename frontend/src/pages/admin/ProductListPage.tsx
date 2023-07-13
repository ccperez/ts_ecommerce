import { Helmet } from 'react-helmet-async'
import { Button, Col, Row } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Loading from '../../components/Loading'
import Message from '../../components/Message'

import { Product } from '../../types/Product'
import { getError } from '../../utils'
import { ApiError } from '../../types/ApiError'
import { useGetAdminProductsQuery } from '../../hooks/productHooks'

export default function ProductListPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const page = sp.get('page') || '1'

  const { data, isLoading, error } = useGetAdminProductsQuery({ page })

  const filter: any = data || []

  const createProductHandler = () =>
    alert(`createProduct`)

  const editProductHandler = (id: string) =>
    alert(`/admin/products/${id}`)

  const deleteProductHandler = (id: string) =>
    alert(`deleteProduct(${id})`)

  const PageLink = ({ type, page, text }: { type: string, page: string, text: JSX.Element | number }) => {
    const pg = parseInt(page)

    let disabledLink = ''
    if (type === 'p' && pg === 1)
      disabledLink = ' disabled'
    if (type === 'n' && pg === filter.pages)
      disabledLink = ' disabled'
    if (type === 'x' && pg === text)
      disabledLink = ' disabled'
    if (type === 'f' && pg === 1)
      disabledLink = ' disabled'
    if (type === 'l' && pg === filter.pages)
      disabledLink = ' disabled'

    let pgNv
    if (type === 'f') pgNv = 1
    if (type === 'x') pgNv = text
    if (type === 'l') pgNv = filter.pages
    if (type === 'p' && pg > 1) pgNv = pg - 1
    if (type === 'n' && (pg > 0 && pg < filter.pages)) pgNv = pg + 1

    return (
      <li className={`page-item${disabledLink}`}>
        <Link className="page-link" to={`/admin/products?page=${pgNv}`} >
          {text}
        </Link>
      </li>
    )
  }

  return (
    <div>
      <Helmet>
        <title>
          Products
        </title>
      </Helmet>
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button
              type="button"
              onClick={createProductHandler}
            >
              Create Product
            </Button>
          </div>
        </Col>
      </Row>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{getError(error as ApiError)}</Message>
      ) : !filter.products ? (
        <Message variant="danger">No records found!</Message>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filter.products!.map((product: Product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => editProductHandler(product._id)}
                    >
                      Edit
                    </Button>{' '}
                    <Button type='button'
                      variant='light'
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              <PageLink type="f" page={page} text={<span>«</span>} />
              <PageLink type="p" page={page} text={<span>‹</span>} />
              {[...Array(filter.pages).keys()].map((x) => (
                <PageLink type="x" page={page} text={x + 1} key={x + 1} />
              ))}
              <PageLink type="n" page={page} text={<span>›</span>} />
              <PageLink type="l" page={page} text={<span>»</span>} />
            </ul>
          </nav>
        </>
      )
      }
    </div >
  )
}
