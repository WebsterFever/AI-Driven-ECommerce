import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import type { Category, Product } from '../../types'
import { db } from '../firebase/config'

const productsCollection = collection(db, 'products')

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

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

export async function createProduct(input: ProductInput): Promise<Product> {
  const productRef = doc(productsCollection)
  const now = new Date().toISOString()

  const product: Product = {
    id: productRef.id,
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(productRef, product)

  return product
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await updateDoc(doc(db, 'products', id), {
    ...input,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id))
}
