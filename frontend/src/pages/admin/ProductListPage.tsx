import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { Button, Col, Row } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Loading from '../../components/Loading'
import Message from '../../components/Message'
import PromptConfirmation from '../../components/PromptConfirmation'

import { Product } from '../../types/Product'
import { getError } from '../../utils'
import { ApiError } from '../../types/ApiError'

import {
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation
} from '../../hooks/productHooks'

export default function ProductListPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const page = sp.get('page') || '1'

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [deleteItem, setDeleteItem] = useState('')

  const { data, isLoading, error } = useGetAdminProductsQuery({ page })
  const { mutateAsync: createProduct } = useCreateProductMutation()
  const { mutateAsync: deleteProduct } = useDeleteProductMutation()

  const filter: any = data || []

  const createProductHandler = async () => {
    const product = await createProduct()
    navigate(`/admin/product/${product._id}?page=${page}`)
    toast.success('product created successfully')
  }

  const editProductHandler = (id: string) =>
    navigate(`/admin/product/${id}?page=${page}`)

  const deleteProductHandler = async (id: string) => {
    try {
      await deleteProduct(id)
      if (parseInt(page) > filter.pages) {
        navigate(`/admin/products?page=${filter.pages}`)
      } else {
        await Promise.all([
          navigate(`/admin/products?page=${parseInt(page) + 1}`),
          setTimeout(() => navigate(`/admin/products?page=${page}`), 10)
        ])
      }
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
    setShowConfirmationModal(false);
  }

  const PageLink = ({ type, page, text }: { type: string, page: string, text: string | number }): JSX.Element => {
    const pg = parseInt(page)
    let pgNv, disabledLink = ''

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

    if (type === 'f') pgNv = 1
    if (type === 'x') pgNv = text
    if (type === 'l') pgNv = filter.pages
    if (type === 'p' && pg > 1) pgNv = pg - 1
    if (type === 'n' && (pg > 0 && pg < filter.pages)) pgNv = pg + 1

    return (
      <li className={`page-item${disabledLink}`}>
        <Link className="page-link" to={`/admin/products?page=${pgNv}`} >
          <span>{text}</span>
        </Link>
      </li>
    )
  }

  const showModal = (title: string, id?: string, name?: string) => {
    if (title === 'Delete') {
      setDeleteItem(id!)
      setModalMessage(`${title} ${name} product?`)
    } else {
      setModalMessage(`Are you sure you want to create product?`)
    }
    setModalTitle(title)
    setShowConfirmationModal(true);
  }

  const hideConfirmationModal = () => setShowConfirmationModal(false)

  return (
    <div>
      <Helmet><title>Products</title></Helmet>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{getError(error as ApiError)}</Message>
      ) : !filter.products ? (
        <Message variant="danger">No records found!</Message>
      ) : (
        <>
          <Row>
            <Col><h1>Products</h1></Col>
            <Col className="col text-end">
              <div>
                <Button type="button" onClick={() => showModal('Create')}>
                  Create Product
                </Button>
              </div>
            </Col>
          </Row>
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
                    <Button type='button' variant='light' onClick={() => editProductHandler(product._id)}>
                      Edit
                    </Button>{' '}
                    <Button type='button' variant='light' onClick={() => showModal('Delete', product._id, product.name)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination">
              <PageLink type="f" page={page} text={`«`} />
              <PageLink type="p" page={page} text={`‹`} />
              {[...Array(filter.pages).keys()].map((x) => (
                <PageLink type="x" page={page} text={x + 1} key={x + 1} />
              ))}
              <PageLink type="n" page={page} text={`›`} />
              <PageLink type="l" page={page} text={`»`} />
            </ul>
          </nav>
          <PromptConfirmation
            showModal={showConfirmationModal}
            confirmModal={modalTitle === 'Delete' ? deleteProductHandler : createProductHandler}
            hideModal={hideConfirmationModal}
            deleteItem={deleteItem}
            title={modalTitle}
            message={modalMessage}
          />
        </>
      )}
    </div >
  )
}
