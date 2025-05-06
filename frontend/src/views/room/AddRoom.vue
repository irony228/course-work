<template>
    <div>
      <h4>Добавление комнаты</h4>
      <div v-if="!submitted">
        <!--В @submit указывается обработчик, который выполнится после нажатия на кнопку "Добавить"
        Обработчик addRoom определён в script-->
        <form @submit="addRoom">
          <!--v-model - директива для связывания данных с элементами.
          Связь происходит при помощи переменных, которые определены в setup()-->
          <input type="text" name="room_number" id="room_number" placeholder="Номер комнаты" required v-model="room.room_number">
          <input type="text" name="type_id" id="type_id" placeholder="Класс комнаты" required v-model="room.type_id">
          <input type="text" name="photo_url" id="photo_url" placeholder="Изображение комнаты" required v-model="room.photo_url">
          <input type="text" name="capacity" id="capacity" placeholder="Вместимость комнаты" required v-model="room.capacity">
          <input type="text" name="price" id="price" placeholder="Цена комнаты" required v-model="room.price">
          <input type="text" name="description" id="description" placeholder="Описание комнаты" required v-model="room.description">
          <input type="text" name="status_id" id="status_id" placeholder="Статус комнаты" required v-model="room.status_id">
          <input type="submit" value="Добавить">
        </form>
      </div>
      <div v-else>
        <h4>Вы успешно добавили запись</h4>
        <div>
          <!--В v-on:click указывается обработчик, который выполнится после нажатия на кнопку "Добавить новую комнату"
          Обработчик newRoom определён в script-->
          <button v-on:click="newRoom">Добавить новую комнату</button>
        </div>
        <div>
          <router-link to="/listRooms">Вернуться к списку комнат</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import http from "../../http-common";
  
  export default defineComponent({
    name: "AddRoom",
    setup() {
      const room = ref({
        room_number: "",
        type_id: "",
        photo_url: "",
        capacity: "",
        price: "",
        description: "", 
        status_id: ""
      });
      const submitted = ref(false);
  
      const addRoom = (e) => {
        e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
        const data = {
          room_number: room.value.room_number,
          type_id: room.value.type_id,
          photo_url: room.value.photo_url ,
          capacity: room.value.capacity,
          price: room.value.price,
          description: room.value.description, 
          status_id: room.value.status_id
        };
        // Либо const data = room.value;
        http
          .post("/addRoom", data)
          .then(response => { // запрос выполнился успешно
            room.value.id = response.data.id;
          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
            console.log("Отправленные данные:", data);
          });
  
        submitted.value = true;
      };
  
      const newRoom = () => {
        submitted.value = false;
        room.value = {
          room_number: "",
          type_id: "",
          photo_url: "",
          capacity: "",
          price: "",
          description: "", 
          status_id: ""
        };
      };
  
      return {
        room,
        submitted,
        addRoom,
        newRoom
      };
    }
  });
  </script>