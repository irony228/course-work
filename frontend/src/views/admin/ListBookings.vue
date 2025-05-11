<template>
  <div class="container">
    <h2>Все бронирования</h2>
    <!-- Фильтры -->
    <div class="filters">
      <label>Цена от:
        <input type="number" v-model="priceFrom" min="0" class="input-text" />
      </label>
      <label>до:
        <input type="number" v-model="priceTo" min="0" class="input-text" />
      </label>
      <label>Дата бронирования от:
        <input type="date" v-model="dateFrom" class="input-text" />
      </label>
      <label>до:
        <input type="date" v-model="dateTo" class="input-text" />
      </label>
      <label>id пользователя
        <input type="text" v-model="userId" class="input-text" />
      </label>
      <label>фамилия
        <input type="text" v-model="lastname" class="input-text" />
      </label>

      <button @click="filterBookings">Применить фильтр</button>
      <button @click="resetFilters"style="margin:10px">Сбросить фильтры</button>
    </div>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('id')">ID <span v-if="sortColumn === 'id'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('created')">Дата бронирования <span v-if="sortColumn === 'created'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('check_in_date')">Заезд <span v-if="sortColumn === 'check_in_date'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('check_out_date')">Выезд <span v-if="sortColumn === 'check_out_date'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('user_id')">id польз-я <span v-if="sortColumn === 'user_id'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('user.lastname')">ФИО <span v-if="sortColumn === 'user.lastname'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('room.room_number')">Комната <span v-if="sortColumn === 'room.room_number'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('price')">Цена <span v-if="sortColumn === 'price'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('status.name')">Статус <span v-if="sortColumn === 'status.name'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th>Изменить статус</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in sortedBookings" :key="booking.id">
          <td>{{ booking.id }}</td>
          <td>{{ formatDateTime(booking.created) }}</td>
          <td>{{ formatDate(booking.check_in_date) }}</td>
          <td>{{ formatDate(booking.check_out_date) }}</td>
          <td>{{ booking.user_id }}</td>
          <td>{{ booking.user.lastname }} {{ booking.user.firstname }}</td>
          <td>{{ booking.room.room_number }}</td>
          <td>{{ booking.price }}₽</td>
          <td>
            <div :class="['status-badge', statusClass(booking.status.name)]">
              {{ booking.status.name }}
            </div>
          </td>
          <td>
            <select v-model="booking.status_id" @change="updateStatus(booking)">
              <option v-for="status in statuses" :key="status.id" :value="status.id">
                {{ status.name }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import http from "../../http-common";
import UserService from '../../services/user.service';
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "AllBookings",
  setup() {
    const bookings = ref([]);
    const statuses = ref([]);
    const store = useStore();
    const router = useRouter();

    const priceFrom = ref("");
    const priceTo = ref("");
    const dateFrom = ref("");
    const dateTo = ref("");
    const userId = ref("");
    const lastname = ref("");

    const currentUser = computed(() => store.state.auth.user);

    const sortColumn = ref("");
    const sortDirection = ref(1);

    const filterBookings = () => {
        const params = {
            price_from: priceFrom.value,
            price_to: priceTo.value,
            date_from: dateFrom.value,
            date_to: dateTo.value,
            user_id: userId.value,
            lastname: lastname.value,
        };

        http
          .get("/listBookings",{ params })
          .then(response => {
            bookings.value = response.data;
          })
          .catch(e => {
            console.log(e);
          });
    };

    const resetFilters = () => {
      priceFrom.value = "",
      priceTo.value = "",
      dateFrom.value = "",
      dateTo.value = "",
      userId.value = "",
      lastname.value = "",
      fetchBookings();
      fetchStatuses();
    };

    const fetchBookings = () => {
      http.get("/listBookings", {
        headers: { "x-access-token": store.state.auth.token },
      })
      .then(response => {
        bookings.value = response.data;
      })
      .catch(e => console.error(e));
    };

    const fetchStatuses = () => {
      http.get("/statuses", {
        headers: { "x-access-token": store.state.auth.token },
      })
      .then(response => {
        statuses.value = response.data.filter(status => status.entity_type === 'booking');
      })
      .catch(e => console.error(e));
    };

    const updateStatus = (booking) => {
      http.post(`/updateBooking/${booking.id}`, {
        status_id: booking.status_id
      }, {
        headers: { "x-access-token": store.state.auth.token },
      })
      .then(() => {
        fetchBookings();
      })
      .catch(e => console.error(e));
    };

    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value *= -1;
      } else {
        sortColumn.value = column;
        sortDirection.value = 1;
      }
    };

    const sortedBookings = computed(() => {
      if (!sortColumn.value) return bookings.value;

      return [...bookings.value].sort((a, b) => {
        const getNestedValue = (obj, path) => path.split('.').reduce((o, key) => o?.[key], obj);

        const aValue = getNestedValue(a, sortColumn.value);
        const bValue = getNestedValue(b, sortColumn.value);

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * sortDirection.value;
        }

        return String(aValue).localeCompare(String(bValue)) * sortDirection.value;
      });
    });

    const formatDate = (isoString) => new Date(isoString).toLocaleDateString();
    const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

    const statusClass = (statusName) => {
      switch (statusName.toLowerCase()) {
        case 'ожидает оплаты':
          return 'status-pending';
        case 'оплачено':
          return 'status-paid';
        case 'отменено':
          return 'status-cancelled';
        case 'завершено':
          return 'status-finished';
        case 'забронировано':
          return 'status-booked';
        default:
          return 'status-default';
      }
    };

    onMounted(() => {
      if (currentUser.value.role !== 'Администратор') {
        router.push('/oops');
        return;
      }  
      fetchBookings();
      fetchStatuses();
    });

    return {
      bookings,
      statuses,
      sortColumn,
      sortDirection,
      sortBy,
      sortedBookings,
      updateStatus,
      formatDate,
      formatDateTime,
      statusClass,
      priceFrom,
      priceTo,
      dateFrom,
      dateTo,
      userId,
      lastname,
      filterBookings,
      resetFilters,
      currentUser
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
}

</style>
