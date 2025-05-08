<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand">Мой отель</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav ms-auto"> <!-- 'ms-auto' выравнивает элементы вправо -->
            <li class="nav-item">
              <router-link class="nav-link" to="/listRooms">Комнаты</router-link>
            </li>
            <li v-if="currentUser"  class="nav-item dropdown">
              <a class="nav-link dropdown-toggle"role="button" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                Профиль
              </a>
              <ul class="dropdown-menu">
                <li><router-link class="nav-link" to="/profile">{{ currentUser.firstname }}</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a @click.prevent="logOut" class="nav-link">Выйти</a></li>
              </ul>
            </li>

            <li v-else class="nav-item">
              <router-link class="nav-link" to="/login">Войти</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "NavBar",
  setup() {
    const store = useStore();

    const currentUser = computed(() => store.state.auth.user);

    const logOut = () => {
      store.dispatch('auth/logout')
        .then(() => {
          window.location.href = '/login'; 
        })
        .catch(err => {
          console.error("Ошибка выхода:", err); 
        });
    };

    return {
      currentUser,
      logOut
    };
  }
};
</script>

