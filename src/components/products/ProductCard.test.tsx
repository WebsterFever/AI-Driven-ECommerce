import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TestProviders } from '../../test/TestProviders'
import type { Product } from '../../types'
import ProductCard from './ProductCard'

const mockProduct: Product = {
  id: 'product-1',
  name: 'Fone de Ouvido Bluetooth',
  description: 'Fone sem fio com cancelamento de ruído.',
  price: 199.9,
  category: 'electronics',
  imageUrl: 'https://example.com/fone.jpg',
  stock: 10,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('ProductCard', () => {
  it('exibe o nome, categoria e preço formatado do produto', () => {
    render(
      <TestProviders>
        <ProductCard product={mockProduct} />
      </TestProviders>,
    )

    expect(screen.getByText('Fone de Ouvido Bluetooth')).toBeInTheDocument()
    expect(screen.getByText('electronics')).toBeInTheDocument()
    expect(screen.getByText('R$ 199,90')).toBeInTheDocument()
  })

  it('tem um link que leva para a página de detalhe do produto', () => {
    render(
      <TestProviders>
        <ProductCard product={mockProduct} />
      </TestProviders>,
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/product-1')
  })
})
