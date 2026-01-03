import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

export const Response = (code: any, msg?: string) => {
    toast.dismiss()
    switch (code) {
        case 0:
            toast.error("Error de red");
            break;
        case "ERR_BAD_REQUEST":
            toast.warning("conexión inestable");
            break;
        case "ERR_NETWORK":
            toast.warning("Error de conexión");
            break;
        case 500:
            toast.error("Error con el servidor");
            break;
        case 400:
            toast.error("Los datos enviados no son correctos");
            break;
        case 404:
            toast.error("No se encontro recurso");
            break;
        case 401:
            toast.error("Usuario no autorizado");
            break;
        case 201:
            toast.success(msg ? msg : "Se guardaron los datos");
            break;
        case 202:
            toast.success(msg ? msg : "Se acepto la petición");
            break;
        default:
            break;
    }
};
