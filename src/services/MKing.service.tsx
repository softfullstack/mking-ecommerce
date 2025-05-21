import axios from "axios";
import { Response } from "../utils/Response";

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