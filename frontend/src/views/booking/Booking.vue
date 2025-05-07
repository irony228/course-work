<template>
  <div>
    <h2>Бронирование комнаты</h2>
    <p>Комната № {{ room_id }}</p>

    <form @submit.prevent="createBooking">
      <label>Дата заезда:</label>
      <input type="date" v-model="check_in_date" :min="today" required>

      <label>Дата выезда:</label>
      <input type="date" v-model="check_out_date" :min="check_in_date || today" required>

      <p>Итоговая стоимость: {{ totalPrice }}₽</p>

      <button type="submit" :disabled="!canBook">Подтвердить бронирование</button>
    </form>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted, watch} from 'vue';
import http from "../../http-common";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  props: ['room_id'],
  setup(props) {
    const check_in_date = ref("");
    const check_out_date = ref("");
    const room_price = ref(0);
    const totalPrice = ref(0);
    const router = useRouter();
    const store = useStore();
    const currentUser = computed(() => store.state.auth.user);

    const today = new Date().toISOString().split("T")[0];

    const fetchRoomPrice = () => {
      http.get(`/room/${props.room_id}`)
        .then(response => {
          room_price.value = response.data.price;
        })
        .catch(e => {
          console.error(e);
        });
    };

    const calculatePrice = () => {
      if (check_in_date.value && check_out_date.value) {
        const inDate = new Date(check_in_date.value);
        const outDate = new Date(check_out_date.value);

        const diffTime = outDate - inDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          totalPrice.value = diffDays * room_price.value;
        } else {
          totalPrice.value = null;
        }
      } else {
        totalPrice.value = null;
      }
    };

    const createBooking = () => {
      const data = {
        user_id: currentUser.value.id,
        room_id: props.room_id,
        check_in_date: check_in_date.value,
        check_out_date: check_out_date.value,
        price: totalPrice.value
      };

      http.post("/addBooking", data)
        .then(response => {
          const booking_id = response.data.id;
          
          const payment_data = {
            booking_id: booking_id,
            amount: totalPrice.value
          }
          http.post("/addPayment", payment_data)
            .then(response => {
              const payment_id = response.data.id;
            })
            .catch(e =>{
              console.error(e);
            });

          // После успешного бронирования меняем статус комнаты на '7'
          http.post(`/updateRoom/${props.room_id}`, {
              status_id: 7
            }, {
              headers: {
                "x-access-token": store.state.auth.token // если у тебя авторизация через токен
              }
            })
            .then(() => {
              // После успешного обновления статуса — переход на профиль
              router.push("/profile");
            })
            .catch(e => {
              console.error("Ошибка при обновлении статуса комнаты:", e);
            });

        })
        .catch(e => {
          console.error(e);
        });
    };

    const canBook = computed(() => {
      return (
        check_in_date.value &&
        check_out_date.value &&
        totalPrice.value !== null
      );
    });

    // вотчеры на изменение дат
    watch([check_in_date, check_out_date], () => {
      calculatePrice();
    });

    onMounted(() => {
      fetchRoomPrice();
    });

    return {
      currentUser,
      check_in_date,
      check_out_date,
      today,
      totalPrice,
      createBooking,
      canBook
    };
  }

});
</script>
