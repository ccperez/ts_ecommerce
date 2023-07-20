import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Message from '../../components/Message'
import Loading from '../../components/Loading'
import FormEntry from '../../components/form/Entry'
import FormInput from '../../components/form/Input'

import { ApiError } from '../../types/ApiError'
import { getError } from '../../utils'
import inputs, { InputAttr } from '../../user_input_attributes'
import fn from '../../functions/common'

import {
  useGetProductDetailsByIDQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation
} from '../../hooks/productHooks'
import { Product } from '../../types/Product'

export default function ProductEditPage() {
  const navigate = useNavigate()
  const params = useParams()
  const idProduct = params.id
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || '1'

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  const [isValid, setIsValid] = useState(false)

  const { data: product, isLoading, error } = useGetProductDetailsByIDQuery(idProduct!)
  const { mutateAsync: updateProduct } = useUpdateProductMutation()
  const { mutateAsync: uploadProductImage } = useUploadProductImageMutation()

  useEffect(() => {
    if (product) {
      setName(product.name)
      setSlug(product.slug)
      setPrice(product.price)
      setCategory(product.category)
      setBrand(product.brand)
      setCountInStock(product.countInStock)
      setDescription(product.description)
      setImage(product.image)
    }
  }, [product])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const updatedProduct = {
        _id: idProduct,
        name,
        slug,
        price,
        category,
        brand,
        countInStock,
        description,
        image
      } as Product

      await updateProduct(updatedProduct)
      toast.success('Product updated successfully')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const uploadFileHandler = async (e: any) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await uploadProductImage(formData)
      // setImage(data.replace('/image', 'image'))
      setImage(data.secure_url)
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setIsValid(false)
    switch (name) {
      case 'name':
        return setName(e.target.value)
      case 'slug':
        return setSlug(e.target.value)
      case 'price':
        // @ts-ignore
        return setPrice(e.target.value)
      case 'category':
        return setCategory(e.target.value)
      case 'brand':
        return setBrand(e.target.value)
      case 'countInStock':
        // @ts-ignore
        return setCountInStock(e.target.value)
      case 'description':
        return setDescription(e.target.value)
      case 'image':
        return setImage(e.target.value)
      default:
        return uploadFileHandler(e)
    }
  }

  const blurHandler = () => setIsValid(fn.hasError('editProduct'))

  const fieldValue = [name, slug, price, category, brand, countInStock, description, image]
  const userInputs = inputs.productUpdate.map((input: InputAttr, idx: number) => (
    <FormInput
      form='editProduct'
      key={input.name}
      type={input.type}
      name={input.name}
      label={input.label}
      value={fieldValue[idx]}
      autoFocus={input.autofocus}
      onChange={e => changeHandler(e, input.name)}
      onBlur={blurHandler}
    />
  ))

  const formButton =
    <>
      <Button type="submit" disabled={!isValid && !isLoading}>
        {isLoading ? 'Loading...' : 'Update'}
      </Button>
      {'  '}
      <Button onClick={() => navigate(`/admin/products?page=${page}`)}>
        Back
      </Button>
    </>

  return isLoading ? (
    <Loading />
  ) : error ? (
    <Message variant="danger">{getError(error as ApiError)}</Message>
  ) : !product ? (
    <Message variant="danger">Product Not Found</Message>
  ) : (
    <FormEntry
      title='Edit Product'
      notify=''
      inputs={userInputs}
      formButton={formButton}
      submitHandler={submitHandler}
    />
  )
}

