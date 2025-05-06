<template>
  <div>
    <h4>Список доступных комнат</h4>

    <!-- Поиск по номеру комнаты -->
    <form @submit="searchRooms">
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Поиск по номеру комнаты" 
      />
      <input type="submit" value="Поиск" />
    </form>

    <!-- Список комнат -->
    <ul>
      <li v-for="room in filteredRooms" :key="room.id">
        <div>
          <img :src="room.photo_url" alt="Фото комнаты" width="200" />
          <p>{{ room.room_number }} - {{ room.type.name }} - {{ room.capacity.name }}</p>
          <p>Цена: {{ room.price }} руб.</p>
          <button @click="bookRoom(room.id)">Забронировать</button>
        </div>
      </li>
    </ul>

    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import http from "../../http-common";

export default defineComponent({
  name: "RoomBooking",
  setup() {
    const rooms = ref([]);
    const filteredRooms = ref([]);
    const searchTerm = ref("");
    const errorMessage = ref("");

    // Получаем список всех комнат
    const getRooms = () => {
      http
        .get("/listRooms")
        .then((response) => {
          rooms.value = response.data;
          filteredRooms.value = response.data; // Изначально показываем все комнаты
        })
        .catch((e) => {
          console.log(e);
        });
    };

    // Функция для поиска по номеру комнаты
    const searchRooms = (e) => {
      e.preventDefault();
      if (!searchTerm.value) {
        filteredRooms.value = rooms.value;
      } else {
        filteredRooms.value = rooms.value.filter(room =>
          room.room_number.includes(searchTerm.value)
        );
      }
    };

    // Бронирование комнаты
    const bookRoom = (roomId) => {
      // Здесь будет логика бронирования
      // Например, отправка данных на сервер
      const bookingData = {
        room_id: roomId,
        user_id: 1, // Здесь нужно будет передать id пользователя
        booking_date: new Date().toISOString(),
      };

      http
        .post("/addBooking", bookingData)
        .then((response) => {
          alert("Комната забронирована!");
        })
        .catch((e) => {
          console.log(e);
          errorMessage.value = "Ошибка при бронировании комнаты.";
        });
    };

    onMounted(() => {
      getRooms();
    });

    return {
      rooms,
      filteredRooms,
      searchTerm,
      errorMessage,
      searchRooms,
      bookRoom,
    };
  },
});
</script>

<style scoped>
ul {
  list-style-type: none;
}

li {
  margin-bottom: 20px;
}

img {
  border-radius: 5px;
}
</style>
