// Datos de ejemplo para los productos
export const products = [
    {
        id: 1,
        name: "Chaleco Alta Visibilidad Pro",
        price: 89.99,
        discount: 0,
        description:
            "Chaleco de alta visibilidad con múltiples bolsillos y bandas reflectantes. Ideal para trabajos en carretera y construcción.",
        details:
            "Nuestro chaleco de alta visibilidad Pro está diseñado para ofrecer la máxima visibilidad en condiciones de poca luz. Fabricado con materiales de alta calidad que garantizan durabilidad y comodidad durante largas jornadas de trabajo. Las bandas reflectantes cumplen con los estándares internacionales de seguridad.",
        images: [
            { id: 1, url: "/images/product-1-1.jpg" },
            { id: 2, url: "/images/product-1-2.jpg" },
            { id: 3, url: "/images/product-1-3.jpg" },
            { id: 4, url: "/images/product-1-4.jpg" },
        ],
        colorIds: ["amarillo", "naranja"],
        colors: ["#ffff00", "#ff9800"],
        sizes: ["s", "m", "l", "xl", "xxl"],
        categories: ["alta-visibilidad", "multibolsillos"],
        isNew: true,
        isFeatured: true,
        rating: 4.5,
        reviewCount: 12,
        stock: 25,
        createdAt: "2023-10-15",
        specifications: [
            { name: "Material", value: "100% Poliéster" },
            { name: "Peso", value: "180g/m²" },
            { name: "Certificaciones", value: "EN ISO 20471:2013+A1:2016" },
            { name: "Cierre", value: "Cremallera frontal" },
            { name: "Bolsillos", value: "4 externos, 2 internos" },
            { name: "Bandas reflectantes", value: "5cm de ancho" },
        ],
        reviews: [
            {
                author: "Carlos Rodríguez",
                rating: 5,
                date: "15/09/2023",
                comment:
                    "Excelente chaleco, muy cómodo y visible. Lo uso diariamente en mi trabajo en carretera y ha resistido muy bien el uso intensivo.",
            },
            {
                author: "María López",
                rating: 4,
                date: "02/08/2023",
                comment:
                    "Buena calidad y visibilidad. Los bolsillos son muy prácticos. Le quito una estrella porque las tallas son un poco grandes.",
            },
        ],
    },
    {
        id: 2,
        name: "Chaleco Ignífugo Premium",
        price: 129.99,
        discount: 15,
        description:
            "Chaleco ignífugo de alta resistencia para entornos con riesgo de incendio. Protección certificada y comodidad garantizada.",
        details:
            "El Chaleco Ignífugo Premium está diseñado para ofrecer la máxima protección contra el fuego y el calor. Fabricado con materiales ignífugos de alta calidad que cumplen con las normativas internacionales más exigentes. Su diseño ergonómico garantiza comodidad incluso durante largas jornadas de trabajo.",
        images: [
            { id: 1, url: "/images/product-2-1.jpg" },
            { id: 2, url: "/images/product-2-2.jpg" },
            { id: 3, url: "/images/product-2-3.jpg" },
        ],
        colorIds: ["rojo", "negro"],
        colors: ["#ff0000", "#000000"],
        sizes: ["m", "l", "xl"],
        categories: ["ignifugos", "alta-visibilidad"],
        isNew: false,
        isFeatured: true,
        rating: 5,
        reviewCount: 8,
        stock: 15,
        createdAt: "2023-09-20",
        specifications: [
            { name: "Material", value: "93% Meta-aramida, 5% Para-aramida, 2% Fibra antiestática" },
            { name: "Peso", value: "260g/m²" },
            { name: "Certificaciones", value: "EN ISO 11612:2015, EN ISO 11611:2015" },
            { name: "Cierre", value: "Velcro frontal" },
            { name: "Bolsillos", value: "2 externos con cierre de seguridad" },
            { name: "Resistencia térmica", value: "Hasta 500°C" },
        ],
        reviews: [
            {
                author: "Juan Pérez",
                rating: 5,
                date: "10/09/2023",
                comment: "Increíble calidad. Lo uso en una refinería y me siento muy seguro con él. Vale cada centavo.",
            },
            {
                author: "Ana Martínez",
                rating: 5,
                date: "25/08/2023",
                comment:
                    "Excelente producto, cumple perfectamente con todas las normativas de seguridad que necesitamos en nuestra planta.",
            },
        ],
    },
    {
        id: 3,
        name: "Chaleco Multibolsillos Utility",
        price: 69.99,
        discount: 0,
        description:
            "Chaleco con múltiples bolsillos para herramientas y accesorios. Ideal para técnicos, electricistas y profesionales de mantenimiento.",
        details:
            "El Chaleco Multibolsillos Utility está diseñado para profesionales que necesitan tener sus herramientas y accesorios siempre a mano. Con 12 bolsillos de diferentes tamaños, ofrece espacio suficiente para organizar todo lo necesario. Fabricado con materiales resistentes que garantizan durabilidad incluso en las condiciones más exigentes.",
        images: [
            { id: 1, url: "/images/product-3-1.jpg" },
            { id: 2, url: "/images/product-3-2.jpg" },
            { id: 3, url: "/images/product-3-3.jpg" },
        ],
        colorIds: ["negro", "azul", "verde"],
        colors: ["#000000", "#0000ff", "#00ff00"],
        sizes: ["s", "m", "l", "xl", "xxl"],
        categories: ["multibolsillos"],
        isNew: false,
        isFeatured: true,
        rating: 4,
        reviewCount: 15,
        stock: 30,
        createdAt: "2023-08-05",
        specifications: [
            { name: "Material", value: "65% Poliéster, 35% Algodón" },
            { name: "Peso", value: "240g/m²" },
            { name: "Bolsillos", value: "12 (8 externos, 4 internos)" },
            { name: "Cierre", value: "Cremallera YKK" },
            { name: "Refuerzos", value: "En hombros y bolsillos" },
            { name: "Lavado", value: "Lavable a máquina a 40°C" },
        ],
        reviews: [
            {
                author: "Pedro Sánchez",
                rating: 4,
                date: "20/07/2023",
                comment:
                    "Muy práctico para mi trabajo como electricista. Los bolsillos están bien distribuidos y son de buen tamaño.",
            },
            {
                author: "Laura Gómez",
                rating: 3,
                date: "15/06/2023",
                comment: "Es funcional pero esperaba mejor calidad en las costuras. Por el precio está bien.",
            },
        ],
    },
    {
        id: 4,
        name: "Chaleco Térmico Industrial",
        price: 109.99,
        discount: 10,
        description: "Chaleco térmico para entornos fríos. Proporciona aislamiento térmico sin comprometer la movilidad.",
        details:
            "El Chaleco Térmico Industrial está diseñado para mantener el calor corporal en entornos de trabajo con bajas temperaturas. Su relleno de fibra sintética de alta calidad proporciona un excelente aislamiento térmico sin añadir peso excesivo. El exterior resistente al agua protege contra la humedad, mientras que el forro interior suave garantiza comodidad durante todo el día.",
        images: [
            { id: 1, url: "/images/product-4-1.jpg" },
            { id: 2, url: "/images/product-4-2.jpg" },
            { id: 3, url: "/images/product-4-3.jpg" },
        ],
        colorIds: ["negro", "azul"],
        colors: ["#000000", "#0000ff"],
        sizes: ["s", "m", "l", "xl"],
        categories: ["termicos"],
        isNew: true,
        isFeatured: false,
        rating: 4.5,
        reviewCount: 6,
        stock: 20,
        createdAt: "2023-10-01",
        specifications: [
            { name: "Material exterior", value: "100% Poliéster con recubrimiento impermeable" },
            { name: "Relleno", value: "Fibra sintética 3M Thinsulate™" },
            { name: "Forro", value: "Microfibra" },
            { name: "Resistencia térmica", value: "Hasta -15°C" },
            { name: "Bolsillos", value: "4 externos con cremallera, 1 interno" },
            { name: "Cierre", value: "Cremallera bidireccional con solapa cortavientos" },
        ],
        reviews: [
            {
                author: "Miguel Torres",
                rating: 5,
                date: "05/10/2023",
                comment:
                    "Excelente para trabajar en cámaras frigoríficas. Mantiene muy bien el calor sin limitar los movimientos.",
            },
            {
                author: "Sofía Ruiz",
                rating: 4,
                date: "28/09/2023",
                comment:
                    "Buen chaleco, abriga bastante y es cómodo. La impermeabilidad funciona bien en condiciones de lluvia ligera.",
            },
        ],
    },
    {
        id: 5,
        name: "Chaleco Reflectante Ligero",
        price: 49.99,
        discount: 0,
        description:
            "Chaleco reflectante ultraligero con bandas de alta visibilidad. Perfecto para ciclistas, corredores y trabajadores que necesitan visibilidad.",
        details:
            "El Chaleco Reflectante Ligero está diseñado para ofrecer máxima visibilidad con mínimo peso. Ideal para actividades deportivas o trabajos que requieren movilidad. Las bandas reflectantes de alta calidad garantizan visibilidad a más de 300 metros en condiciones de poca luz. Su tejido transpirable permite una excelente ventilación, evitando la acumulación de sudor incluso durante actividades intensas.",
        images: [{ id: 1, url: "/images/product-5-1.jpg" }, { id: 2, url: "/images/product-5-2.jpg" }],
        colorIds: ["amarillo", "naranja"],
        colors: ["#ffff00", "#ff9800"],
        sizes: ["s", "m", "l", "xl"],
        categories: ["reflectantes", "alta-visibilidad"],
        isNew: false,
        isFeatured: true,
        rating: 4,
        reviewCount: 20,
        stock: 50,
        createdAt: "2023-07-15",
        specifications: [
            { name: "Material", value: "100% Poliéster de malla" },
            { name: "Peso", value: "120g/m²" },
            { name: "Certificaciones", value: "EN ISO 20471:2013 Clase 2" },
            { name: "Bandas reflectantes", value: "5cm, tecnología microprisma" },
            { name: "Cierre", value: "Velcro frontal" },
            { name: "Transpirabilidad", value: "Alta" },
        ],
        reviews: [
            {
                author: "Roberto Fernández",
                rating: 4,
                date: "10/07/2023",
                comment: "Muy ligero y cómodo. Lo uso para correr por la noche y la visibilidad es excelente.",
            },
            {
                author: "Carmen Díaz",
                rating: 5,
                date: "01/07/2023",
                comment: "Perfecto para ciclismo. Apenas notas que lo llevas puesto y la visibilidad que ofrece es muy buena.",
            },
        ],
    },
    {
        id: 6,
        name: "Chaleco Táctico Profesional",
        price: 149.99,
        discount: 0,
        description:
            "Chaleco táctico con múltiples compartimentos modulares. Diseñado para fuerzas de seguridad y profesionales que requieren organización y resistencia.",
        details:
            "El Chaleco Táctico Profesional está fabricado con los materiales más resistentes del mercado para garantizar durabilidad en las condiciones más exigentes. Su sistema MOLLE permite personalizar la configuración de bolsillos y accesorios según las necesidades específicas de cada misión. Los refuerzos en hombros y espalda proporcionan comodidad incluso con cargas pesadas durante periodos prolongados.",
        images: [
            { id: 1, url: "/images/product-6-1.jpg" },
            { id: 2, url: "/images/product-6-2.jpg" },
            { id: 3, url: "/images/product-6-3.jpg" },
        ],
        colorIds: ["negro", "verde"],
        colors: ["#000000", "#00ff00"],
        sizes: ["m", "l", "xl"],
        categories: ["multibolsillos"],
        isNew: false,
        isFeatured: false,
        rating: 5,
        reviewCount: 10,
        stock: 15,
        createdAt: "2023-09-10",
        specifications: [
            { name: "Material", value: "1000D Cordura Nylon" },
            { name: "Sistema de sujeción", value: "MOLLE/PALS" },
            { name: "Bolsillos", value: "8 modulares + 4 fijos" },
            { name: "Ajustes", value: "Laterales y hombros con velcro" },
            { name: "Resistencia", value: "Agua, abrasión, desgarros" },
            { name: "Peso", value: "1.2kg" },
        ],
        reviews: [
            {
                author: "Alejandro Moreno",
                rating: 5,
                date: "15/09/2023",
                comment:
                    "Calidad excepcional. Lo uso en servicio y ha resistido todo tipo de condiciones. La distribución de peso es perfecta.",
            },
            {
                author: "Javier López",
                rating: 5,
                date: "05/08/2023",
                comment: "El mejor chaleco táctico que he tenido. La personalización con el sistema MOLLE es muy versátil.",
            },
        ],
    },
    {
        id: 7,
        name: "Chaleco Acolchado Industrial",
        price: 79.99,
        discount: 5,
        description:
            "Chaleco acolchado para protección contra el frío moderado. Ideal para almacenes, logística y trabajos en exterior durante el otoño.",
        details:
            "El Chaleco Acolchado Industrial combina calidez y funcionalidad para entornos de trabajo con temperaturas moderadamente frías. Su diseño permite total libertad de movimiento para los brazos, mientras mantiene el torso protegido. El tejido exterior repele el agua y las manchas, facilitando su mantenimiento en entornos industriales.",
        images: ["/images/product-7-1.jpg", "/images/product-7-2.jpg"],
        colorIds: ["negro", "azul", "rojo"],
        colors: ["#000000", "#0000ff", "#ff0000"],
        sizes: ["s", "m", "l", "xl", "xxl"],
        categories: ["termicos"],
        isNew: false,
        isFeatured: false,
        rating: 4,
        reviewCount: 14,
        stock: 25,
        createdAt: "2023-08-20",
        specifications: [
            { name: "Material exterior", value: "100% Poliéster con tratamiento repelente" },
            { name: "Relleno", value: "Poliéster 120g/m²" },
            { name: "Forro", value: "Tafetán de poliéster" },
            { name: "Bolsillos", value: "5 (3 externos, 2 internos)" },
            { name: "Cierre", value: "Cremallera con protección para barbilla" },
            { name: "Lavado", value: "Lavable a máquina a 30°C" },
        ],
        reviews: [
            {
                author: "Daniel Martín",
                rating: 4,
                date: "25/08/2023",
                comment:
                    "Buen chaleco para trabajar en el almacén refrigerado. Mantiene bien el calor y los bolsillos son prácticos.",
            },
            {
                author: "Elena Castro",
                rating: 3,
                date: "10/08/2023",
                comment: "Cumple su función pero esperaba un acolchado más grueso. Para frío intenso se queda corto.",
            },
        ],
    },
    {
        id: 8,
        name: "Chaleco Antiestático ESD",
        price: 119.99,
        discount: 0,
        description:
            "Chaleco con protección antiestática para entornos electrónicos sensibles. Previene descargas que podrían dañar componentes.",
        details:
            "El Chaleco Antiestático ESD está especialmente diseñado para trabajos en entornos donde la electricidad estática puede causar daños a componentes electrónicos sensibles. Su tejido incorpora fibras conductivas que disipan las cargas electrostáticas de forma segura. Cumple con los estándares internacionales para protección ESD, garantizando un entorno de trabajo seguro para la manipulación de componentes electrónicos de alta precisión.",
        images: ["/images/product-8-1.jpg", "/images/product-8-2.jpg"],
        colorIds: ["azul", "negro"],
        colors: ["#0000ff", "#000000"],
        sizes: ["s", "m", "l", "xl"],
        categories: ["alta-visibilidad"],
        isNew: true,
        isFeatured: false,
        rating: 4.5,
        reviewCount: 7,
        stock: 20,
        createdAt: "2023-10-05",
        specifications: [
            { name: "Material", value: "98% Poliéster, 2% Fibra de carbono" },
            { name: "Resistencia superficial", value: "10⁶ - 10⁹ Ohm" },
            { name: "Certificaciones", value: "EN 61340-5-1:2016" },
            { name: "Bolsillos", value: "3 ESD seguros" },
            { name: "Cierre", value: "Botones a presión antiestáticos" },
            { name: "Durabilidad", value: "Mantiene propiedades ESD hasta 100 lavados" },
        ],
        reviews: [
            {
                author: "Pablo Herrera",
                rating: 5,
                date: "10/10/2023",
                comment:
                    "Excelente para nuestro laboratorio de microelectrónica. Las mediciones confirman que cumple perfectamente su función antiestática.",
            },
            {
                author: "Lucía Vargas",
                rating: 4,
                date: "01/10/2023",
                comment: "Buen producto, cumple con todos los estándares que necesitábamos para nuestra sala limpia.",
            },
        ],
    },
]

// Productos destacados para la página de inicio
export const featuredProducts = products.filter((product) => product.isFeatured)

// Función para obtener productos relacionados
export const getRelatedProducts = (productId: number, category: string, limit = 4) => {
    return products.filter((product) => product.id !== productId && product.categories.includes(category)).slice(0, limit)
}
