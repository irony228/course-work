<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg">
      <router-link class="item" to="/listRooms">Комнаты</router-link>
      <div v-if="currentUser">
        <router-link to="/profile">
          {{ currentUser.username }}
        </router-link>
        <a href @click.prevent="logOut">
          Выйти
        </a>
      </div>
      <div v-else>
        <router-link to="/login">
            Войти
        </router-link>
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
  
<style>
  .item {
    margin-right: 5px;
  }
</style>