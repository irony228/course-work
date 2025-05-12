<template>
    <div class="container">
      <header>
        <h3>
          Страница не найдена
        </h3>
      </header>
      <p>
        <strong>Введён неверный адрес</strong>
      </p>
      <button v-on:click="mainPage">Вернуться к списку комнат</button>
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'WrongPage',
    setup() {
      const router = useRouter();
      const mainPage = () =>{
        router.push('/listRooms');
      }
  
      return {
        mainPage
      };
    }
  };
  </script>