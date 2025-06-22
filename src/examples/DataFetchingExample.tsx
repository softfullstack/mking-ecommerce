import { useState, useEffect } from 'react'
import { getColors, getCategories, ProducList } from '../services/MKing.service'

// Ejemplo de cómo usar las nuevas funciones del servicio
const DataFetchingExample = () => {
    const [colors, setColors] = useState([])
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                
                // Obtener todos los datos en paralelo
                const [colorsResponse, categoriesResponse, productsResponse] = await Promise.all([
                    getColors(),
                    getCategories(),
                    ProducList()
                ])

                setColors(colorsResponse.data)
                setCategories(categoriesResponse.data)
                setProducts(productsResponse.data.products || [])
                
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div>Cargando...</div>
    }

    return (
        <div>
            <h2>Datos obtenidos del backend</h2>
            
            <h3>Colores ({colors.length})</h3>
            <ul>
                {colors.map((color: any) => (
                    <li key={color.id}>
                        {color.name} - {color.hex_code}
                    </li>
                ))}
            </ul>

            <h3>Categorías ({categories.length})</h3>
            <ul>
                {categories.map((category: any) => (
                    <li key={category.id}>
                        {category.name}
                    </li>
                ))}
            </ul>

            <h3>Productos ({products.length})</h3>
            <ul>
                {products.slice(0, 5).map((product: any) => (
                    <li key={product.id}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DataFetchingExample 