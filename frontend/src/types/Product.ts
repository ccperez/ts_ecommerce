export interface Product {
  _id: string
  name: string
  slug: string
  image: string
  images: string
  category: string
  brand: string
  price: number
  countInStock: number
  description: string
  rating: number
  numReviews: number
}

export interface iProductImage {
  id: string
  idProduct: string
  images: string
}
