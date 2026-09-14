import { useState } from 'react'
import CategoryFilter, {
  type CategoryFilterValue,
} from '../components/products/CategoryFilter'
import ProductCard from '../components/products/ProductCard'
import { useProducts } from '../hooks/useProducts'

function Home() {
  // Busca os produtos através do nosso hook.
  const { products, loading, error } = useProducts()

  // Guarda a categoria selecionada.
  // "all" significa que queremos mostrar todos os produtos.
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>('all')

  // Filtra os produtos de acordo com a categoria selecionada.
  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === 'all' ||
      product.category === selectedCategory,
  )

  // Função para levar o usuário até a seção de produtos.
  function scrollToProducts() {
    const productsSection = document.getElementById('products')

    productsSection?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =============================== */}
      {/* BANNER PRINCIPAL / HERO */}
      {/* =============================== */}

      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">

          {/* Texto do banner */}
          <div>
            <span className="mb-4 inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-300">
              Tecnologia para todos
            </span>

            <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Encontre tecnologia para o seu dia a dia
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Descubra produtos selecionados para trabalho, estudo,
              entretenimento e muito mais na Patagonix Tech.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={scrollToProducts}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Ver produtos
              </button>

              <button
                type="button"
                onClick={scrollToProducts}
                className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explorar catálogo
              </button>

            </div>
          </div>

          {/* Parte visual do banner */}
          <div className="relative hidden md:block">

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-blue-600 p-6">
                  <p className="text-sm text-blue-100">
                    Novidades
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    Tecnologia
                  </p>

                  <p className="mt-2 text-sm text-blue-100">
                    Produtos para todos os momentos.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 text-slate-900">
                  <p className="text-sm text-slate-500">
                    Catálogo
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    Variedade
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Encontre o que você precisa.
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl bg-slate-800 p-6">
                  <p className="text-sm text-slate-400">
                    Patagonix Tech
                  </p>

                  <p className="mt-2 text-xl font-semibold">
                    Sua loja online de tecnologia
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =============================== */}
      {/* BENEFÍCIOS DA LOJA */}
      {/* =============================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">
              Compra segura
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Ambiente pensado para sua segurança.
            </p>
          </div>


          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">
              Produtos selecionados
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Catálogo organizado por categorias.
            </p>
          </div>


          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">
              Compra fácil
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Navegação simples e rápida.
            </p>
          </div>


          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">
              Atendimento
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Experiência focada no cliente.
            </p>
          </div>

        </div>
      </section>


      {/* =============================== */}
      {/* CATÁLOGO */}
      {/* =============================== */}

      <main
        id="products"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >

        {/* Cabeçalho da seção */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Nossa seleção
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Produtos em destaque
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Escolha uma categoria para encontrar o produto ideal.
            </p>
          </div>


          {!loading && !error && (
            <p className="text-sm text-slate-500">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'produto encontrado'
                : 'produtos encontrados'}
            </p>
          )}

        </div>


        {/* =============================== */}
        {/* FILTRO POR CATEGORIA */}
        {/* =============================== */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Categorias
          </p>

          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>


        {/* =============================== */}
        {/* LOADING */}
        {/* =============================== */}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-slate-200" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />

                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}

          </div>
        )}


        {/* =============================== */}
        {/* ERRO */}
        {/* =============================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-700">
              Não foi possível carregar os produtos
            </h3>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}


        {/* =============================== */}
        {/* NENHUM PRODUTO */}
        {/* =============================== */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

              <h3 className="text-lg font-semibold text-slate-900">
                Nenhum produto encontrado
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Não encontramos produtos nessa categoria.
              </p>

              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Ver todos os produtos
              </button>

            </div>
          )}


        {/* =============================== */}
        {/* GRID DOS PRODUTOS */}
        {/* =============================== */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>
          )}

      </main>


      {/* =============================== */}
      {/* BANNER FINAL */}
      {/* =============================== */}

      <section className="bg-blue-600">

        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 text-white sm:px-6 md:flex-row md:items-center lg:px-8">

          <div>
            <h2 className="text-2xl font-bold">
              Encontre seu próximo produto
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Explore nosso catálogo e encontre produtos para suas necessidades.
            </p>
          </div>


          <button
            type="button"
            onClick={scrollToProducts}
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Explorar catálogo
          </button>

        </div>

      </section>

    </div>
  )
}

export default Home