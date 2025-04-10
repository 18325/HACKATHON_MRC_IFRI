import axios from "axios";

const apiUrl = 'http://127.0.0.1:8001/api'

export const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {

    },
    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
});
