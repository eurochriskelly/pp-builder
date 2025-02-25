const axios = require('axios');

const API_BASE_URL = 'http://192.168.1.147:4000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function apiRequest(method, endpoint, data = null, params = {}) {
    try {
        const config = {
            method,
            url: endpoint,
            params,
        };
        if (method.toLowerCase() !== 'get' && data !== null) {
            config.data = data;
        }
        const response = await apiClient(config);
        return response.data;
    } catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, error.response?.data || error.message);
        throw error;
    }
}

module.exports = { apiRequest };
