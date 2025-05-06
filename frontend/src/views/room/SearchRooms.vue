<template>
    <div>
      <h4>Поиск комнат по номеру</h4>
      <form @submit="searchCategoriesByName">
        <input type="text" name="room_number" id="room_number" placeholder="Номер комнаты" required v-model="room_number">
        <input type="submit" value="Поиск">
      </form>
  
      <ul class="search-result">
        <li v-for="(room, index) in rooms" :key="index">
          {{ room.room_number }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import http from "../../http-common";
  
  export default defineComponent({
    name: "SearchRooms",
    setup() {
      const room_number = ref("");
      const rooms = ref([]);
  
      const searchRoomsByNumber = (e) => {
        e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
        http
          .get("/room/room_number/" + room_number.value)
          .then(response => {
            rooms.value = response.data;
          })
          .catch(e => {
            console.log(e);
          });
      };
  
      return {
        room_number,
        rooms,
        searchRoomsByNumber
      };
    }
  });
  </script>
  
  <style>
    .search-result {
      list-style-type: none;
      padding: 0;
    }
    .search-result li {
      margin-bottom: 5px;
    }
  </style>