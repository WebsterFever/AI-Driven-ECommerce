import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import type { Category, Product } from '../../types'
import { db } from '../firebase/config'

const productsCollection = collection(db, 'products')

export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await getDocs(productsCollection)
  return snapshot.docs.map((document) => document.data() as Product)
}

export async function getProductById(id: string): Promise<Product | null> {
  const snapshot = await getDoc(doc(db, 'products', id))

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data() as Product
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const categoryQuery = query(productsCollection, where('category', '==', category))
  const snapshot = await getDocs(categoryQuery)
  return snapshot.docs.map((document) => document.data() as Product)
}
