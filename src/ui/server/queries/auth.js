const { apiRequest } = require('../../api');

async function loginUser(email, password) {
    try {
        const data = await apiRequest('post', '/auth/login', { email, password });
        if (!data || !data.data) {
            return null;
        }
        // The REST API returns { data: { id, email, ... } }
        const user = data.data;
        return {
            id: user.id,
            name: user.email ? user.email.split('@')[0] : 'User',
            email: user.email
        };
    } catch (error) {
        console.error('Login error in queries/auth.js:', error);
        return null;
    }
}

module.exports = { loginUser };
