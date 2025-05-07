<template>
  <div class="container">
    <header>
      <h3>
        Профиль <strong>{{ currentUser.username }}</strong>
      </h3>
    </header>
    <p>
      <strong>Роль:</strong>
      {{ currentUser.role }}
    </p>
    <p>
      <strong>ФИО:</strong>
      {{ currentUser.lastname }} {{ currentUser.firstname }} {{ currentUser.middlename }}
    </p>
  </div>

  <h4>Мои бронирования</h4>
  <div v-for="booking in bookings" :key="booking.id" class="booking-item">
    <p>Бронирование № {{ booking.id }} — {{ booking.status.name }}</p>
    <p>Дата бронирования {{ formatDateTime(booking.created) }}</p>
    <p>Заезд: {{ formatDate(booking.check_in_date) }}, Выезд: {{ formatDate(booking.check_out_date) }}</p>
    <p>Комната № {{ booking.room_id }}</p>
    <p>Стоимость: {{ booking.price }}₽</p>

    <button v-if="booking.status_id === 1" @click="goToPayment(booking.id)">Оплатить</button>
    <button v-if="booking.status_id === 1" @click="cancelBooking(booking)">Отменить</button>
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

    const fetchBookings = () => {
      http.get(`/bookings/${currentUser.value.id}`, {
        headers: {
          "x-access-token": store.state.auth.token
        }
      })
        .then(response => {
          bookings.value = response.data;
        })
        .catch(e => {
          console.error(e);
        });
    };

    const cancelBooking = (booking) => {
      // 1. Отменяем бронирование
      http.post(`/updateBooking/${booking.id}`, {
        status_id: 3
      }, {
        headers: {
          "x-access-token": store.state.auth.token
        }
      })
      .then(() => {
        // 2. Освобождаем комнату
        return http.post(`/updateRoom/${booking.room_id}`, {
          status_id: 6
        }, {
          headers: {
            "x-access-token": store.state.auth.token
          }
        });
      })
      .then(() => {
        // 3. После успешного обновления — заново получить список бронирований
        fetchBookings();
      })
      .catch(e => {
        console.error("Ошибка при отмене бронирования или обновлении статуса комнаты:", e);
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

    const goToPayment = (bookingId) => {
      router.push(`/payment/${bookingId}`);
    };

    onMounted(() => {
      if (!currentUser.value) {
        router.push('/login');
      }
      fetchBookings();
    });

    return {
      currentUser,
      bookings,
      cancelBooking,
      formatDate,
      formatDateTime,
      goToPayment
    };
  }
};
</script>
