import axios from "axios";
import { Response } from "../utils/Response";
import { Product } from "../interfaces/ProductInterface";

const apiUrl = import.meta.env.VITE_BASE_URL;
let cancelToken: any;

axios.interceptors.request.use(

    (config: any) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        // config.headers["Access-Control-Allow-Origin"] = "*";
        // config.headers["Content-Type"] = "application/json";
        // config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
        // config.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Conten-Type, Accept";
        // config.headers["Access-Control-Allow-Credentials"] = true;

        return config;
    },
    function (error) {
        // Do something with request error
        console.log(error);
        return Promise.reject(error);
    }
);

cancelToken = axios.CancelToken.source();

if (cancelToken) {
    cancelToken.cancel("Operations cancelled due to new request");
}

axios.interceptors.response.use(
    (res: any) => {
        return res;
    },
    (err) => {
        const status = err.response.status;
        Response(status);
        return Promise.reject(err);
    }
);

export const LoginService = (body: any) => axios.post(`${apiUrl}/login`, body);


export const ProducList = async () => {
    return axios.get(`${apiUrl}/products`)
}

export const ProductDetail = async (id: number) => {
    return axios.get(`${apiUrl}/products/${id}`)
}

export const TotalesService = (body: any) => axios.post(apiUrl, body);

export const SaldoVencido = (date: any, signal: any) =>
    axios.get(`${apiUrl}/Reporte_saldos_vencidos?fecha=${date}`, signal);

export const HistoricoAnual = (signal: any) =>
    axios.get(`${apiUrl}/historicoA_saldos_vencidos`, signal);

export const HistoricoMensual = (signal: any) =>
    axios.get(`${apiUrl}/historicoM_saldos_vencidos`, signal);

export const reporteRecuperacion = (signal: any) =>
    axios.get(`${apiUrl}/reporte_recuperacion`, signal);

export const obtenerComentarios = (id: any) =>
    axios.get(`${apiUrl}/obtener_comentario/${id}`);

export const guardarComentarios = (body: any) =>
    axios.post(`${apiUrl}/guarda_comentario`, body);

// Obtener colores disponibles
export const getColors = async () => {
    return axios.get(`${apiUrl}/colors`)
}

export const getProductById = async (id: number): Promise<Product> => {
    try {
        // Assuming apiUrl is http://localhost:3333/api
        const { data } = await axios.get(`${apiUrl}/products/${id}`);

        // Adapt the API response to the Product interface
        const adaptedProduct: Product = {
            id: data.id,
            name: data.name,
            price: parseFloat(data.price),
            discount: 0, // Not available in API
            description: data.description,
            details: "", // Not available in API
            images: data.images ? data.images.map((img: any) => ({
                id: img.id,
                url: img.url,
                image_path: img.image_path,
            })) : [],
            colorIds: data.colors ? data.colors.map((color: any) => color.name.toLowerCase()) : [],
            colors: data.colors ? data.colors.map((color: any) => color.name) : [],
            sizes: data.sizes ? data.sizes.map((size: any) => size.name) : [],
            categories: data.category ? [data.category.name] : [],
            isNew: false, // Logic to determine if it's new can be added here
            rating: 0, // Not available in API
            reviewCount: 0, // Not available in API
            reviews: [], // Not available in API
            specifications: [], // Not available in API
        };
        return adaptedProduct;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

// Obtener categorías disponibles
export const getCategories = async () => {
    return axios.get(`${apiUrl}/categories`)
}