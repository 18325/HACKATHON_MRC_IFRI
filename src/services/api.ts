import axios from "axios";

const apiUrl = 'http://localhost:8001/api'

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
