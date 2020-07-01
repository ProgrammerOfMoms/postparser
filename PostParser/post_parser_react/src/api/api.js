import axios from 'axios'



export const axiosAllowAny = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosAllowAny.interceptors.response.use(
    res => res,
    error => Promise.reject(error.response)
);


export const axiosAuth = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 20000,
});

axiosAuth.interceptors.response.use(
    res => res,
    error => Promise.reject(error.response)
);

export const getHeaders = () => {
    return {
        headers: {
            'Authorization': "JWT " + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'accept': 'application/json',
        }
    }
    
}