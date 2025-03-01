const axios = require('axios');

let API_BASE_URL = null;

function setApiBaseUrl(url) {
    API_BASE_URL = url;
    console.log('api.js - API_BASE_URL set to:', API_BASE_URL);
}

async function apiRequest(method, endpoint, data = {}, params = {}) {
    if (!API_BASE_URL) {
        throw new Error('API_BASE_URL not set. Call setApiBaseUrl first.');
    }
    const apiClient = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    console.log(`Making ${method} request to: ${API_BASE_URL}${endpoint}`);
    try {
        const response = await apiClient({ method, url: endpoint, data, params });
        return response.data;
    } catch (error) {
        console.error(`API Error (${method} ${endpoint}):`, error.response?.data || error.message);
        throw error;
    }
}

module.exports = { setApiBaseUrl, apiRequest };
