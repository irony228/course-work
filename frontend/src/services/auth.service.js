import http from "../http-common";

function login(user) {
    var data = {
        username: user.username,
        password: user.password
    };
    return http
        .post("/login", data)
        .then(response => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
}

function logout() {
    localStorage.removeItem('user');
}

function register(user) {
 var data = {
        username: user.username,
        password: user.password,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        middlename: user.middlename,
        phone_number: user.phone_number,
        email: user.email
    };
    console.log(data)
    return http.post("/register", data);
}

function refreshToken(user) {
    var data = {
        username: user.username
    };
    return http
        .post("/refreshToken", data)
        .then(response => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            const user = JSON.parse(localStorage.getItem("user")); 
            console.log(user)
            return response.data;
        });
}

function jwtDecrypt(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
}

function tokenAlive(exp) {
    if (Date.now() >= exp * 1000) {
        return false;
    }
    return true;
}

export default {
    login: login,
    logout: logout,
    register: register,
    refreshToken: refreshToken,
    jwtDecrypt: jwtDecrypt,
    tokenAlive: tokenAlive
};