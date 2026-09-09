export type Category =
  | 'electronics'
  | 'clothing'
  | 'home'
  | 'sports'
  | 'books'
  | 'other'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: Category
  imageUrl: string
  createdAt: string
  updatedAt: string
}
