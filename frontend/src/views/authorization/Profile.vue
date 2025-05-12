<template>
  <div class="container">
    <header>
      <h3>
        Профиль <strong>{{ currentUser.username }}</strong>
      </h3>
    </header>
    <p><strong>Роль:</strong> {{ currentUser.role }}</p>
    <p><strong>ФИО:</strong> {{ currentUser.lastname }} {{ currentUser.firstname }} {{ currentUser.middlename }}</p>
  </div>
  <div v-if="currentUser.role === 'Администратор'">
    <label>Администрирование:</label>
    <router-link :to="`/admin/bookings`">
      <button>Все бронирования</button>
    </router-link>
    <router-link :to="`/admin/users`">
      <button>Все пользователи</button>
    </router-link>
    <router-link :to="`/admin/payments`">
      <button>Все платежи</button>
    </router-link>
    
  </div>
  <h4>Мои бронирования</h4>
  <div v-if="bookings.length === 0">
    <p>У вас нет бронирований.</p>
  </div>
  <div v-else>
    <div class="booking-list">
      <div v-for="(booking, index) in paginatedBookings" :key="booking.id" class="booking-item">
        <h3>{{ booking.status.name }}</h3>
        <p>Бронирование № {{ booking.id }}</p>
        <p>Дата бронирования: {{ formatDateTime(booking.created) }}</p>
        <p>Заезд: {{ formatDate(booking.check_in_date) }}, Выезд: {{ formatDate(booking.check_out_date) }}</p>
        <p>Комната № {{ booking.room.room_number }}</p>
        <p>{{ booking.room.capacity.name }} номер класса {{ booking.room.type.name }}</p>
        <p>Итоговая стоимость: {{ booking.price }}₽</p>

        <p v-if="booking.status_id === 1">
          Оплатите до: <strong>{{ formatRemainingTime(remainingTimes[booking.id]) }}</strong>
        </p>

        <button v-if="booking.status_id === 1" @click="goToPayment(booking)">Оплатить</button>
        <button v-if="booking.status_id === 1" @click="cancelBooking(booking)">Отменить</button>
      </div>
    </div>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage">Предыдущие</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Следующие</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed } from 'vue';
import http from "../../http-common";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ProfileUser',
  setup() {
    const bookings = ref([]);
    const store = useStore();
    const router = useRouter();

    const currentUser = computed(() => store.state.auth.user);
    const currentPage = ref(1);
    const itemsPerPage = 4;
    const totalPages = computed(() => Math.ceil(bookings.value.length / itemsPerPage));

  
    const remainingTimes = ref({});

    const paginatedBookings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return bookings.value.slice(start, start + itemsPerPage);
    });

    const fetchBookings = () => {
      http.get(`/bookings/${currentUser.value.id}`, {
        headers: {
          "x-access-token": store.state.auth.token
        }
      })
      .then(response => {
        bookings.value = response.data.sort((a, b) => new Date(b.created) - new Date(a.created));
        updateRemainingTimes();
      })
      .catch(e => {
        console.error(e);
      });
    };

    const cancelBooking = (booking) => {
      http.post(`/updateBooking/${booking.id}`, {
        status_id: 3
      }, {
        headers: {
          "x-access-token": store.state.auth.token
        }
      })
      .then(() => {
        return http.post(`/updateRoom/${booking.room_id}`, {
          status_id: 6
        }, {
          headers: {
            "x-access-token": store.state.auth.token
          }
        });
      })
      .then(() => {
        fetchBookings();
      })
      .catch(e => {
        console.error("Ошибка при отмене бронирования или обновлении статуса комнаты:", e);
      });
    };

    const goToPayment = (booking) => {
      http.post(`/updatePayment/${booking.id}`, {
        status_id: 2,
        payment_date: new Date()
      }, {
        headers: {
          "x-access-token": store.state.auth.token
        }
      })
      .then(() => {
        return http.post(`/updateBooking/${booking.id}`, {
          status_id: 2
        }, {
          headers: {
            "x-access-token": store.state.auth.token
          }
        });
      })
      .then(() => {
        fetchBookings();
      })
      .catch(e => {
        console.error("Ошибка при оплате бронирования или обновлении статуса оплаты:", e);
      });
    };

    const formatDate = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formatDateTime = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formatRemainingTime = (ms) => {
      if (ms === undefined) return '--:--';
      const totalSeconds = Math.floor(ms / 1000);
      if (totalSeconds < 0) return '00:00';
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${minutes}:${seconds}`;
    };

    const handleExpiredBooking = (booking) => {
      http.post(`/updateBooking/${booking.id}`, {
        status_id: 3
      }, {
        headers: {
          "x-access-token": store.state.auth.token
        }
      })
      .then(() => {
        return http.post(`/updateRoom/${booking.room_id}`, {
          status_id: 6
        }, {
          headers: {
            "x-access-token": store.state.auth.token
          }
        });
      })
      .then(() => {
        fetchBookings();
      })
      .catch(e => {
        console.error("Ошибка при автоотмене бронирования:", e);
      });
    };

    const updateRemainingTimes = () => {
      const now = new Date();
      bookings.value.forEach(booking => {
        if (booking.status_id === 1) {
          const created = new Date(booking.created);
          const deadline = new Date(created.getTime() + 10 * 60 * 1000);
          const remaining = deadline - now;

          if (remaining <= 0) {
            handleExpiredBooking(booking);
          } else {
            remainingTimes.value[booking.id] = remaining;
          }
        }
      });
    };

    const previousPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    onMounted(() => {
      if (!currentUser.value) {
        router.push('/login');
      }
      fetchBookings();
      setInterval(updateRemainingTimes, 1000);
    });

    return {
      currentUser,
      bookings,
      paginatedBookings,
      currentPage,
      totalPages,
      goToPayment,
      cancelBooking,
      formatDate,
      formatDateTime,
      previousPage,
      nextPage,
      remainingTimes,
      formatRemainingTime,
    };
  }
};
</script>

<style>
  button {
    margin:3px;
  }
</style>
