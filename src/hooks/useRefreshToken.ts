import {axiosClient} from "../services/api.ts";
import useAuth from "./useAuth.ts";
import Cookies from "js-cookie";

export interface ApiError {
    response?: {
        status: number;
        data: {
            detail: string;
        };
    };
}

const useRefreshToken = () => {

    const {auth ,setAuth} = useAuth();

    return async () => {
        try {
            const response = await axiosClient.post(
                '/refresh-token',
                {},
            );
            setAuth({
                ...auth,
                accessToken: response.data.body.accessToken,
                role: response.data.body.role
            });
            Cookies.set('role', response.data.body.role, {
                expires: 7, // Expire dans 7 jours
                secure: true, // Seulement en HTTPS
                sameSite: 'strict', // Protection contre les attaques CSRF
                path: '/', // Accessible sur tout le site
            });
            console.log(response)
            return response.data.body.accessToken;
        } catch (err) {
            const error = err as ApiError;
            console.log(error);
            if (error.response?.status === 403) {
                console.log("Requête annulée :", error.response.data.detail);
            }
        }
    }
}

export default  useRefreshToken;