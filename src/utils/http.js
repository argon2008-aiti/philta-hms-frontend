import axios from 'axios';

const API_BASE_URL = "http://localhost:3000";

const $axios = axios.create({
    baseURL: API_BASE_URL,
});

$axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem('token');

const $api_base_url = API_BASE_URL;

export { $axios, $api_base_url };