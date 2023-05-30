export type Product = {
  name: string
  slug: string
  image: string
  category: string
  brand: string
  price: number
  countInStock: number
  description: string
  rating: number
  numReviews: number
}

export type State = {
  products: Product[]
  loading: boolean
  error: string
}

export type Action =
  | { type: 'PRODUCTS_REQUEST' }
  | { type: 'PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'PRODUCTS_FAIL'; payload: string }
