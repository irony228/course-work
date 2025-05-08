<template>
    <div>
        <h4 class="text-center">Вход в систему</h4>
        <form @submit.prevent="handleLogin">
            <div class="form-group mb-3">
                <input type="text" class="input-text" placeholder="Логин" v-model="user.username" required/>
            </div>
            <div class="form-group mb-3">
                <input type="password" class="input-text" placeholder="Пароль" v-model="user.password" required />
            </div>
            <div class="form-group text-center">
                <button :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm"></span>
                    <span>Войти</span>
                </button>
            </div>
            
            <router-link to="/register">
                <button>Зарегистрироваться</button>
            </router-link>
            <div class="form-group">
                <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
            </div>
        </form>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'LoginUser',
    setup() {
        const store = useStore();
        const user = ref({ username: '', password: '' });
        const loading = ref(false);
        const message = ref('');

        const handleLogin = async () => {
            loading.value = true;
            message.value = ''; 

            try {
                await store.dispatch('auth/login', user.value); // вызываем метод login(...) из auth.service.js 
                window.location.href = '/listRooms'; // перенаправляем на главную страницу после успешного входа
            } catch (error) {
                loading.value = false; // устанавливаем состояние загрузки в false при ошибке
                message.value = error.response.data.message; // устанавливаем сообщение об ошибке из ответа сервера
            }
        };

        return {
            user, 
            loading,
            message,
            handleLogin
        };
    }
};
</script>
<style>
    button{
        margin:5px; 
    }
</style>