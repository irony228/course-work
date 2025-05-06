import { createApp } from 'vue' // Импорт метода для создания приложения
import './style.css'
import App from './App.vue' // Импорт главного компонента
import router from './router/router.js' // Маршрутизация

const app = createApp(App); // Создание экземпляра приложения
app.use(router); // Подключение маршрутизации
app.mount('#app'); // Привязка экземпляра приложения к странице HTML