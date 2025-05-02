const { apiRequest } = require('../../api');

async function loginUser(email, password) {
    const data = await apiRequest('post', '/auth/login', { email, password });
    return data ? { id: data.id, Name: data.email.split('@')[0], email: data.email } : null;
}

module.exports = { loginUser };
