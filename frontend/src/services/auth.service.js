import http from "../http-common";

// отправка данных на сторону сервера для того, чтобы пользователь мог авторизоваться в системе
function login(user) {
    var data = {
        username: user.username,
        password: user.password
    };
    return http
        .post("/login", data)
        .then(response => {
            if (response.data.accessToken) {
                // записываем данные пользователя в локальное хранилище, которое находится в браузере
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
}

// обработка выхода пользователя
function logout() {
    // при нажатии кнопки "Выйти" удаляем данные пользователя из локального хранилища
    localStorage.removeItem('user');
}

// обработка регистрации пользователя
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

// обработка обновления токена
// на стороне сервера установили время действия токена, если после указанного времени пользователь всё ещё работает в системе,
// то нужно сгенерировать другой токен
function refreshToken(user) {
    var data = {
        username: user.username
    };
    return http
        .post("/refreshToken", data)
        .then(response => {
            if (response.data.accessToken) {
                //console.log(response.data.accessToken)
                localStorage.setItem('user', JSON.stringify(response.data));// записываем данные пользователя в локальное хранилище, которое хранится в браузере
            }
            const user = JSON.parse(localStorage.getItem("user")); 
            console.log(user)
            return response.data;
        });
}

// декодируем токен jwt, чтобы в вызывающем методе использовать время (понадобится для проверки срока действия токена)
function jwtDecrypt(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
}

// проверяем срока действия токена
function tokenAlive(exp) {
    // Date.now() - возвращает дату сразу в виде миллисекунд
    // exp - время из JWT токена по формату Unix Time
    // Чтобы сравнить время, нужно exp перевести в миллисекунды
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