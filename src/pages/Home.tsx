import { useState } from 'react'
import CategoryFilter, { type CategoryFilterValue } from '../components/products/CategoryFilter'
import ProductCard from '../components/products/ProductCard'
import { useDebounce } from '../hooks/useDebounce'
import { useProducts } from '../hooks/useProducts'

function Home() {
  // Load products through the products hook.
  const { products, loading, error } = useProducts()
  // "all" means every product category is displayed.
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('all')
  const [searchTerm, setSearchTerm] = useState('')
  // Wait 400 ms after typing stops before applying the search.
  const debouncedSearchTerm = useDebounce(searchTerm, 400)

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* MAIN HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div>
            <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-300">Technology for everyone</span>
            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Find technology for your everyday life</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Discover selected products for work, study, entertainment, and much more at Patagonix Tech.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={scrollToProducts} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">View Products</button>
              <button type="button" onClick={scrollToProducts} className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Explore Catalog</button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-600 p-6"><p className="text-sm text-blue-100">What's New</p><p className="mt-2 text-2xl font-bold">Technology</p><p className="mt-2 text-sm text-blue-100">Products for every moment.</p></div>
                <div className="rounded-2xl bg-white p-6 text-slate-900"><p className="text-sm text-slate-500">Catalog</p><p className="mt-2 text-2xl font-bold">Variety</p><p className="mt-2 text-sm text-slate-500">Find what you need.</p></div>
                <div className="col-span-2 rounded-2xl bg-slate-800 p-6"><p className="text-sm text-slate-400">Patagonix Tech</p><p className="mt-2 text-xl font-semibold">Your online technology store</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORE BENEFITS */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">Secure Shopping</p><p className="mt-1 text-sm text-slate-500">An environment designed with your security in mind.</p></div>
          <div className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">Selected Products</p><p className="mt-1 text-sm text-slate-500">A catalog organized by category.</p></div>
          <div className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">Easy Shopping</p><p className="mt-1 text-sm text-slate-500">Simple and fast navigation.</p></div>
          <div className="rounded-xl border border-slate-200 p-4"><p className="font-semibold text-slate-900">Customer Support</p><p className="mt-1 text-sm text-slate-500">An experience focused on the customer.</p></div>
        </div>
      </section>

      {/* PRODUCT CATALOG */}
      <main id="products" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Our Selection</p><h2 className="mt-1 text-3xl font-bold text-slate-900">Featured Products</h2><p className="mt-2 text-sm text-slate-500">Choose a category to find the right product for you.</p></div>
          {!loading && !error && <p className="text-sm text-slate-500">{filteredProducts.length} {filteredProducts.length === 1 ? 'product found' : 'products found'}</p>}
        </div>

        {/* SEARCH */}
        <div className="mb-4"><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products by name..." className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></div>

        {/* CATEGORY FILTER */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="mb-3 text-sm font-semibold text-slate-700">Categories</p><CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} /></div>

        {/* LOADING */}
        {loading && <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="h-52 animate-pulse bg-slate-200" /><div className="space-y-3 p-5"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /><div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-5 w-24 animate-pulse rounded bg-slate-200" /></div></div>)}</div>}

        {/* ERROR */}
        {!loading && error && <div className="rounded-2xl border border-red-200 bg-red-50 p-6"><h3 className="font-semibold text-red-700">Unable to load products</h3><p className="mt-1 text-sm text-red-600">{error}</p></div>}

        {/* EMPTY STATE */}
        {!loading && !error && filteredProducts.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm"><h3 className="text-lg font-semibold text-slate-900">No products found</h3><p className="mt-2 text-sm text-slate-500">We couldn't find products matching this filter or search.</p><button type="button" onClick={() => { setSelectedCategory('all'); setSearchTerm('') }} className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">View All Products</button></div>}

        {/* PRODUCT GRID */}
        {!loading && !error && filteredProducts.length > 0 && <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      </main>

      {/* FINAL BANNER */}
      <section className="bg-blue-600"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 text-white sm:px-6 md:flex-row md:items-center lg:px-8"><div><h2 className="text-2xl font-bold">Find your next product</h2><p className="mt-2 text-sm text-blue-100">Explore our catalog and find products that fit your needs.</p></div><button type="button" onClick={scrollToProducts} className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">Explore Catalog</button></div></section>
    </div>
  )
}

export default Home
