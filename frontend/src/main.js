import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import './style.css'
import App from './App.vue' 
import router from './router/router.js' 
import store from './store';


const app = createApp(App); 
app.use(router); 
app.use(store); 
app.mount('#app'); 

let inactivityTime = null; 
const inactivityLimit = 15 * 60 * 1000; 

function handleInactivity() {
    clearTimeout(inactivityTime);
    inactivityTime = setTimeout(() => {
        localStorage.removeItem("user"); 
        window.location.href = "/login"; 
    }, inactivityLimit); 
}

window.onload = handleInactivity;
document.onmousemove = handleInactivity;