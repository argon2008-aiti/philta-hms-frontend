import axios from 'axios';

const API_BASE_URL = "http://192.168.1.107:85";

const $axios = axios.create({
    baseURL: API_BASE_URL,
});

$axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.token;

console.log("token: " + localStorage.token);

export default $axios;