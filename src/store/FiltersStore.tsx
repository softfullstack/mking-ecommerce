import { create } from 'zustand'

interface ColorType {
    id: number
    name: string
    hex_code?: string
}

interface CategoryType {
    id: number
    name: string
}

interface FiltersState {
    colors: ColorType[]
    categories: CategoryType[]
    sizes: string[]
    setColors: (colors: ColorType[]) => void
    setCategories: (categories: CategoryType[]) => void
    setSizes: (sizes: string[]) => void
}

const useFiltersStore = create<FiltersState>((set) => ({
    colors: [],
    categories: [],
    sizes: [],
    setColors: (colors) => set({ colors }),
    setCategories: (categories) => set({ categories }),
    setSizes: (sizes) => set({ sizes })
}))

export default useFiltersStore
