export interface ApiImage {
    id: number
    image_path: string
    product_id: number
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
    unit_id: number | null
    color_id: number
    reorder_level: number
    status: number
    created_at: string
    updated_at: string
    deleted_at: string | null
    category: ApiCategory
    images: ApiImage[]
    color: ApiColor
}

export interface Product {
    id: number
    name: string
    price: number
    discount: number
    description: string
    details: string
    images: string[]
    // colorIds: string[]
    colors: string[]
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
export function transformApiProduct(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        price: parseFloat(apiProduct.price),
        discount: 0, // Por defecto no hay descuento
        description: apiProduct.description,
        details: apiProduct.description, // Usando la misma descripción para details
        images: apiProduct.images.map(img => `http://tu-api-url.com/${img.image_path}`), // Ajusta la URL base según tu API
        colorIds: [apiProduct.color.name.toLowerCase()],
        colors: [apiProduct.color.name],
        sizes: ["s", "m", "l", "xl"], // Tamaños por defecto
        categories: [apiProduct.category.name.toLowerCase()],
        isNew: new Date(apiProduct.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Producto nuevo si tiene menos de 7 días
        rating: 5, // Valores por defecto
        reviewCount: 0,
        reviews: [],
        specifications: [
            { name: "SKU", value: apiProduct.sku },
            { name: "Categoría", value: apiProduct.category.name },
            { name: "Color", value: apiProduct.color.name }
        ]
    }
}