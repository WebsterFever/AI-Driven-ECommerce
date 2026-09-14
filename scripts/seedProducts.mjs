import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'Variável GOOGLE_APPLICATION_CREDENTIALS não encontrada.\n' +
      'Configure-a com setx (veja a ETAPA 1 da FASE 5) e abra um novo terminal antes de rodar este script.',
  )
  process.exit(1)
}

initializeApp({
  credential: applicationDefault(),
})

const db = getFirestore()

const sampleProducts = [
  {
    name: 'Fone de Ouvido Bluetooth',
    description: 'Fone sem fio com cancelamento de ruído e bateria de longa duração.',
    price: 199.9,
    category: 'electronics',
    imageUrl: 'https://picsum.photos/seed/electronics1/400',
  },
  {
    name: 'Camiseta Básica',
    description: 'Camiseta 100% algodão, corte unissex.',
    price: 49.9,
    category: 'clothing',
    imageUrl: 'https://picsum.photos/seed/clothing1/400',
  },
  {
    name: 'Luminária de Mesa',
    description: 'Luminária de LED com ajuste de intensidade, ideal para home office.',
    price: 89.9,
    category: 'home',
    imageUrl: 'https://picsum.photos/seed/home1/400',
  },
  {
    name: 'Bola de Futebol',
    description: 'Bola oficial tamanho 5, costurada à mão.',
    price: 79.9,
    category: 'sports',
    imageUrl: 'https://picsum.photos/seed/sports1/400',
  },
  {
    name: 'Livro: Introdução ao TypeScript',
    description: 'Guia prático de TypeScript para desenvolvedores JavaScript.',
    price: 120,
    category: 'books',
    imageUrl: 'https://picsum.photos/seed/books1/400',
  },
  {
    name: 'Caneca Personalizada',
    description: 'Caneca de cerâmica 300ml, resistente a micro-ondas.',
    price: 29.9,
    category: 'other',
    imageUrl: 'https://picsum.photos/seed/other1/400',
  },
]

async function seedProducts() {
  console.log(`Inserindo ${sampleProducts.length} produtos de exemplo...`)

  for (const product of sampleProducts) {
    const ref = db.collection('products').doc()
    const now = new Date().toISOString()

    await ref.set({
      id: ref.id,
      ...product,
      createdAt: now,
      updatedAt: now,
    })

    console.log(`- "${product.name}" criado (id: ${ref.id})`)
  }

  console.log('Seed concluído com sucesso.')
}

seedProducts().catch((error) => {
  console.error('Erro inesperado ao popular produtos:', error)
  process.exit(1)
})
