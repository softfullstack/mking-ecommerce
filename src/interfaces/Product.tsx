export interface ApiImage {
    id: number
    image_path: string
    url: string | null
    product_id: number
    is_primary: boolean
}

export interface ApiCategory {
    id: number
    name: string
}

export interface ApiColor {
    id: number
    name: string
}

export interface ApiProduct {
    id: number
    name: string
    description: string
    sku: string
    price: string
    img_product: string | null
    category_id: number
    warehouse_id: number | null
    color_id: number
    status: number
    created_at: string
    updated_at: string
    category: ApiCategory
    images: ApiImage[]
    colors: ApiColor[]
}

export interface Product {
    id: number
    name: string
    price: number
    discount: number
    description: string
    details: string
    images: ApiImage[]
    colors: string[]
    colorIds: number[]
    sizes: string[]
    categories: string[]
    isNew: boolean
    rating: number
    reviewCount: number
    reviews: {
        author: string
        rating: number
        date: string
        comment: string
    }[]
    specifications: {
        name: string
        value: string
    }[]
}

// Función para transformar un ApiProduct en Product
// Mapeo de colores a valores hexadecimales
const colorNameToHex: Record<string, string> = {
    negro: '#000000',
    rojo: '#ff0000',
    verde: '#00ff00',
    azul: '#0000ff',
    amarillo: '#ffff00',
    blanco: '#ffffff',
    naranja: '#ff9800'
};

export function transformApiProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        price: parseFloat(apiProduct.price),
        discount: 0,
        description: apiProduct.description,
        details: apiProduct.description, // Usando la misma descripción para details
        images: apiProduct.images,
        colors: apiProduct.colors.map(color => colorNameToHex[color.name.toLowerCase()] || '#cccccc'),
        colorIds: apiProduct.colors.map(color => color.id),
        sizes: ["s", "m", "l", "xl"], // Tamaños por defecto
        categories: [apiProduct.category.name.toLowerCase()],
        isNew: new Date(apiProduct.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Producto nuevo si tiene menos de 7 días
        rating: 5,
        reviewCount: 0,
        reviews: [],
        specifications: []
    }
}