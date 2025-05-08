<template>
    <div class="col-md-5 mx-auto mt-4">
      <h4 class="text-center">Регистрация пользователя</h4>
      <form @submit.prevent="handleRegister" class="registration-form">
        <div v-if="!successful">
          <div class="form-group mb-3">
            <input type="text" class="form-control" placeholder="Логин" v-model="user.username" required />
            <div v-if="usernameError" class="text-danger">{{ usernameError }}</div>
          </div>
          <div class="form-group mb-3">
            <input type="password" class="form-control" placeholder="Пароль" v-model="user.password" required />
            <div v-if="passwordError" class="text-danger">{{ passwordError }}</div>
          </div>
          <div class="form-group mb-3">
            <select class="form-control" v-model="user.role" required>
              <option value="" disabled selected>Выберите роль</option>
              <option value="Гость">Гость</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <input type="text" class="form-control" placeholder="Фамилия" v-model="user.lastname" required />
          </div>
          <div class="form-group mb-3">
            <input type="text" class="form-control" placeholder="Имя" v-model="user.firstname" required />
          </div>
          <div class="form-group mb-3">
            <input type="text" class="form-control" placeholder="Отчество" v-model="user.middlename" required />
          </div>
          <div class="form-group mb-3">
            <input type="text" class="form-control" placeholder="Номер телефона" v-model="user.phone_number" required />
          </div>
          <div class="form-group mb-3">
            <input type="text" class="form-control" placeholder="Email" v-model="user.email" required />
          </div>
          <div class="form-group text-center">
            <button class="btn btn-primary btn-block">Зарегистрировать</button>
          </div>
        </div>
        <div class="form-group">
          <div v-if="successMessage" class="alert alert-success" role="alert">{{ successMessage }}</div>
        </div>
        <div class="form-group mt-2">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
        </div>
      </form>
    </div>
  </template>

<script>
import { ref, computed, onMounted } from 'vue'; 
import { useStore } from 'vuex';
import UserService from '../../services/user.service';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterUser',
  setup() {
    const store = useStore();
    const user = ref({ username: '', password: '', phone_number: '', firstname: '', lastname: '', middlename: '', role: '', email: ''});
    const successful = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const usernameError = ref('');
    const passwordError = ref('');
    const router = useRouter();

    // Validation functions
    const validateUsername = (username) => {
      if (username.length < 3) {
        usernameError.value = 'Логин должен содержать как минимум 3 символа';
        return false;
      }
      usernameError.value = '';
      return true;
    };

    const validatePassword = (password) => {
      if (password.length < 4) {
        passwordError.value = 'Пароль должен содержать как минимум 4 символа';
        return false;
      }
      passwordError.value = '';
      return true;
    };

    const handleRegister = async () => {
      successMessage.value = '';
      errorMessage.value = '';

      if (!validateUsername(user.value.username) || !validatePassword(user.value.password)) {
          return; // запрещаем дальнейшее выполнение метода если логин или пароль некорректны
        }

      try {
        const data = await store.dispatch("auth/register", user.value);
        successMessage.value = data.message;
        successful.value = true;
      } catch (err) {
        errorMessage.value = err.response.data.message;
      }
    };
    onMounted(()=>{
      UserService.getUserBoard()
        .then(() => {
          router.push('/oops');
        })
        .catch(e => {
          console.error((e.response && e.response.data) || e.message || e.toString());
        });
    })
    return {
      user,
      successful,
      successMessage,
      errorMessage,
      usernameError,
      passwordError,
      handleRegister
    };
  }
};
</script>