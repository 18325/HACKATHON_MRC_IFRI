import {axiosClient} from "../services/api.ts";
import useAuth from "./useAuth.ts";

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