<template>
  <div>
    <h4>Список комнат</h4>

    <div v-if="!displayContent">
      Список комнат доступен только авторизованным пользователям
    </div>
    <div v-else>
      <div v-if="currentUser.role === 'Администратор'">
        <router-link to="/addRoom">
          <button>Добавить комнату</button>
        </router-link>
        <!-- Поиск по номеру -->
        <form @submit.prevent="searchRoomsByNumber">
          <input
            type="text"
            placeholder="Номер комнаты"
            v-model="room_number"
            class="input-text"
            style="display: inline"
          />
          <button type="submit" style="margin:10px">Поиск</button>
          <button type="button" @click="getRooms">Сбросить</button>
        </form>
      </div>

      <!-- Фильтры -->
      <div class="filters">
        <label>Тип комнаты:
          <select v-model="selectedType" class="input-select">
            <option value="">Все</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </label>

        <label>Вместимость:
          <select v-model="selectedCapacity" class="input-select">
            <option value="">Все</option>
            <option v-for="capacity in capacities" :key="capacity.id" :value="capacity.id">
              {{ capacity.name }}
            </option>
          </select>
        </label>

        <label>Цена от:
          <input type="number" v-model="priceFrom" min="0" class="input-text" />
        </label>

        <label>до:
          <input type="number" v-model="priceTo" min="0" class="input-text" />
        </label>

        <button @click="filterRooms">Применить фильтр</button>
        <button @click="resetFilters"style="margin:10px">Сбросить фильтры</button>
      </div>

      <!-- Список комнат -->
      <div v-if="rooms.length === 0">
        <p>Комнат не найдено</p>
      </div>

      <div class="room-grid">
        <div v-for="(room, index) in rooms" :key="index" class="room-card">
          <router-link :to="{ name: 'room-details', params: { id: room.id } }">
            <img
              :src="`../public/images/${room.photo_url}`"
              alt="Фото комнаты"
              class="room-photo"
            />
            <div class="room-info">
              <h3>{{ room.type.name }}</h3>
              <p>Вместимость: {{ room.capacity.name }}</p>
              <p>Цена: {{ room.price }}₽</p>
              <p>Статус: {{ room.status.name }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import http from "../../http-common";
import UserService from '../../services/user.service';
import { useStore } from 'vuex';

export default defineComponent({
  name: "ListRooms",
  setup() {
    const rooms = ref([]);
    const roomTypes = ref([]);
    const capacities = ref([]);
    const room_number = ref("");
    const displayContent = ref(false);

    const selectedType = ref("");
    const selectedCapacity = ref("");
    const priceFrom = ref("");
    const priceTo = ref("");

    const store = useStore();
    const currentUser = computed(() => store.state.auth.user);

    const getRooms = () => {
      room_number.value = "";
      http
        .get("/listRooms")
        .then(response => {
          rooms.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const getRoomTypes = () => {
      http
        .get("/types")
        .then(response => {
          roomTypes.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const getCapacities = () => {
      http
        .get("/capacities")
        .then(response => {
          capacities.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const searchRoomsByNumber = () => {
      if (!room_number.value) {
        getRooms();
        return;
      }
      http
        .get("/room/number/" + room_number.value)
        .then(response => {
          rooms.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const filterRooms = () => {
      const params = {
        type: selectedType.value,
        capacity: selectedCapacity.value,
        price_from: priceFrom.value,
        price_to: priceTo.value,
      };

      http
        .get("/listRooms", { params })
        .then(response => {
          rooms.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const resetFilters = () => {
      selectedType.value = "";
      selectedCapacity.value = "";
      priceFrom.value = "";
      priceTo.value = "";
      getRooms();
    };

    onMounted(() => {
      UserService.getUserBoard()
        .then(() => {
          displayContent.value = true;
          getRooms();
          getRoomTypes();
          getCapacities();
        })
        .catch(e => {
          console.error((e.response && e.response.data) || e.message || e.toString());
        });
    });

    return {
      rooms,
      roomTypes,
      capacities,
      room_number,
      selectedType,
      selectedCapacity,
      priceFrom,
      priceTo,
      getRooms,
      searchRoomsByNumber,
      filterRooms,
      resetFilters,
      displayContent,
      currentUser
    };
  },
});
</script>

<style>
.item {
  margin-left: 5px;
}
.filters {
  margin-top: 20px;
}
.filters label {
  margin-right: 10px;
}


</style>
