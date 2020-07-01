import axios from 'axios'



export const axiosAllowAny = axios.create({
    baseURL: 'https://skyteam-client.ru/',
    timeout: 20000,
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
    baseURL: 'https://skyteam-client.ru/',
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