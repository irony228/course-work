import { createApp } from 'vue' // Импорт метода для создания приложения
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'
import App from './App.vue' // Импорт главного компонента
import router from './router/router.js' // Маршрутизация
import store from './store';


const app = createApp(App); // Создание экземпляра приложения
app.use(router); // Подключение маршрутизации
app.use(store); 
app.mount('#app'); // Привязка экземпляра приложения к странице HTML

let inactivityTime = null; // переменная для отслеживания времени бездействия
const inactivityLimit = 15 * 60 * 1000; // 15 минут

function handleInactivity() {
    clearTimeout(inactivityTime); // сбрасываем таймер
    inactivityTime = setTimeout(() => {
        localStorage.removeItem("user"); // удаляем пользователя из локального хранилища
        window.location.href = "/login"; // перенаправляем на страницу входа
    }, inactivityLimit); // выход пользователя через 15 минут бездействия
}

// когда страница полностью загружена, вызывается функция handleInactivity. Это устанавливает начальный таймер, когда пользователь впервые загружает страницу
window.onload = handleInactivity;
// когда пользователь перемещает мышь по документу, вызывается функция handleInactivity. Это сбрасывает таймер бездействия, что предотвращает выход пользователя из системы, пока он активно взаимодействует с интерфейсом.
document.onmousemove = handleInactivity;