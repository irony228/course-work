<template>
    <div v-if="room">
      <h4>Комната</h4>
      <div v-if="!submitted">
        <form @submit="updateRoom">
            <input type="text" name="room_number" id="room_number" placeholder="Номер комнаты" required v-model="room.room_number">
            <input type="text" name="type_id" id="type_id" placeholder="Класс комнаты" required v-model="room.type_id">
            <input type="text" name="photo_url" id="photo_url" placeholder="Изображение комнаты" required v-model="room.photo_url">
            <input type="text" name="capacity_id" id="capacity_id" placeholder="Вместимость комнаты" required v-model="room.capacity_id">
            <input type="text" name="price" id="price" placeholder="Цена комнаты" required v-model="room.price">
            <input type="text" name="description" id="description" placeholder="Описание комнаты" required v-model="room.description">
            <input type="text" name="status_id" id="status_id" placeholder="Статус комнаты" required v-model="room.status_id">
            <input type="submit" value="Обновить">
        </form>
        <button @click="deleteRoom">Удалить</button>
      </div>
      <div v-else>
        <h4>Вы успешно обновили запись</h4>
        <router-link to="/listRooms">Вернуться к списку комнат</router-link>
    </div>
    </div>
    <div v-else>
      <br>
      <p>Выберите комнату</p>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import http from "../../http-common";
  
  export default defineComponent({
    name: "RoomDetails",
    props: ['id'],
    setup(props) {
      const room = ref(null);
      const submitted = ref(false);
      const router = useRouter();
  
      const getRoom = () => {
        http
          .get("/room/" + props.id) // обращаемся к серверу для получения категории, id взят из входных параметров (props)
          .then(response => { // запрос выполнен успешно
            room.value = response.data;
          })
          .catch(e => { // запрос выполнен с ошибкой
            console.log(e);
          });
      };
  
      const updateRoom = (e) => {
        e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
        const data = {
          room_number: room.value.room_number
        };
  
        http
          .post("/updateRoon/" + room.value.id, data)
          .then(() => {
            router.push('/listRooms'); // переходим к списку категорий
          })
          .catch(e => {
            console.log(e);
          });
  
        submitted.value = true;
      };
  
      const deleteRoom = () => {
        http
          .post("/deleteRoom/" + room.value.id)
          .then(() => {
            router.push('/listRooms'); // переходим к списку категорий
          })
          .catch(e => {
            console.log(e);
          });
      };
  
      onMounted(() => {
        getRoom();
      });
  
      return {
        room,
        submitted,
        updateRoom,
        deleteRoom
      };
    }
  });
  </script>