import type { Category } from '../../types'

export type CategoryFilterValue = Category | 'all'

interface CategoryOption {
  value: CategoryFilterValue
  label: string
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'electronics', label: 'Eletrônicos' },
  { value: 'clothing', label: 'Roupas' },
  { value: 'home', label: 'Casa' },
  { value: 'sports', label: 'Esportes' },
  { value: 'books', label: 'Livros' },
  { value: 'other', label: 'Outros' },
]

interface CategoryFilterProps {
  selected: CategoryFilterValue
  onSelect: (category: CategoryFilterValue) => void
}

function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      {CATEGORY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selected === option.value
              ? 'bg-blue-600 text-white'
              : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
