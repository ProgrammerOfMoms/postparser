import axios from 'axios'
import Cookies from 'js-cookie';



export const axiosAllowAny = axios.create({
    baseURL: 'http://skyteam-client.ru/',
    // baseURL: "http://localhost:8000",
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
    baseURL: 'http://skyteam-client.ru/',
    // baseURL: "http://localhost:8000",
    timeout: 20000,
});

axiosAuth.interceptors.response.use(
    res => res,
    error => Promise.reject(error.response)
);

export const getAllHeaders = () => {
    let csrf = Cookies.get('csrftoken')
    return {
        headers: {
            'Authorization': "JWT " + localStorage.getItem('token'),
            'Content-Type': 'application/json',
            'accept': 'application/json',
            // 'X-CSRFToken': csrf
        }
    }
    
}

export const getPartHeaders = () => {
    let csrf = Cookies.get('csrftoken')
    return {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            // 'X-CSRFToken': csrf
        }
    }
    
}