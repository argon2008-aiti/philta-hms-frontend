import axios from 'axios';

const API_BASE_URL = "http://localhost:3000";

const $axios = axios.create({
    baseURL:  API_BASE_URL,
});

$axios.defaults.headers.common["Authorization"] = 
    "Bearer " + localStorage.token;

console.log("token: " + localStorage.token);

export default $axios;