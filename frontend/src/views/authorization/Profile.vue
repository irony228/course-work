<template>
    <div class="container">
      <header>
        <h3>
          Профиль <strong>{{ currentUser.username }}</strong>
        </h3>
      </header>
      <p>
        <strong>Токен JWT:</strong>
        <!-- Токен не рекомендуется выводить на веб-странице, но для ознакомления он будет отображён на странице профиля пользователя -->
        {{ currentUser.accessToken }}
      </p>
      <p>
        <strong>Id:</strong>
        {{ currentUser.id }}
      </p>
      <p>
        <strong>Логин:</strong>
        {{ currentUser.username }}
      </p>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'ProfileUser',
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const currentUser = computed(() => store.state.auth.user);
  
      onMounted(() => {
        if (!currentUser.value) {
          router.push('/login');
        }
      });
  
      return {
        currentUser
      };
    }
  };
  </script>