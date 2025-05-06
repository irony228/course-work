<template>
    <div id="app">
      <nav>
        <router-link class="item" to="/listRooms">Комнаты</router-link>
      </nav>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: "NavBar",
    setup() {
      return {};
    }
  });
  </script>
  
  <style>
    .item {
      margin-right: 5px;
    }
  </style>