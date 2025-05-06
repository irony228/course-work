<template>
  <div>
    <h4>Список комнат</h4>

    <!-- Ссылки -->
    <router-link class="item" to="/addRoom">Добавить комнату</router-link>

    <!-- Поиск -->
    <form @submit="searchRoomsByNumber">
      <input
        type="text"
        name="room_number"
        id="room_number"
        placeholder="Номер комнаты"
        v-model="room_number"
      />
      <input type="submit" value="Поиск" />
      <input type="button" @click="getRooms" value="Сбросить"/>
    </form>

    <!-- Вывод списка комнат -->
    <div v-if="rooms.length === 0">
      <p>Комнат с таким номером не найдено</p>
    </div>
    <ul>
      <li v-for="(room, index) in rooms" :key="index" style="text-align: left">
        <router-link
          :to="{
            name: 'room-details',
            params: { id: room.id },
          }"
        >
          {{ room.room_number }},
          {{ room.type.name }},
          {{ room.capacity.name }},
          {{ room.price }},
          {{ room.status.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import http from "../../http-common";

export default defineComponent({
  name: "ListRooms",
  setup() {
    const rooms = ref([]);
    const room_number = ref("");

    const getRooms = () => {
      room_number.value = "";
      http
        .get("/listRooms")
        .then((response) => {
          rooms.value = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const searchRoomsByNumber = (e) => {
      e.preventDefault();
      if (!room_number.value) {
        getRooms();
        return;
      }

      http
        .get("/room/number/" + room_number.value)
        .then((response) => {
          console.log(response.data);
          rooms.value = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    };

    onMounted(() => {
      getRooms();
    });

    return {
      rooms,
      room_number,
      getRooms,
      searchRoomsByNumber,
    };
  },
});
</script>

<style>
.item {
  margin-left: 5px;
}
</style>
