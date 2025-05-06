import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:3000/api", // указание адреса сервера
    headers: {
        "Content-Type": "application/json" // обмен данными будем осуществлять в формате json
    }
});

// добавление токена к каждому запросу
http.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            config.headers["x-access-token"] = user.accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default http;