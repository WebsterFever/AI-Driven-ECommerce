import type { Product } from './product.types'

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface OrderItem extends Pick<Product, 'id' | 'name' | 'price' | 'imageUrl'> {
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}
