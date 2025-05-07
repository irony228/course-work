<template>
  <div>
    <h2>Бронирование комнаты</h2>
    <p>Комната № {{ room_id }}</p>
    <form @submit.prevent="createBooking">
      <input type="date" v-model="check_in_date" required>
      <input type="date" v-model="check_out_date" required>
      <button type="submit">Подтвердить бронирование</button>
    </form>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from 'vue';
import http from "../../http-common";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  props: ['room_id'],
  setup(props) {
    const check_in_date = ref([]);
    const check_out_date = ref([]);
    const router = useRouter();
    const store = useStore();
    const currentUser = computed(() => store.state.auth.user);

    const createBooking = () => {
      const data = {
        user_id: currentUser.value.id,
        room_id: props.room_id,
        check_in_date: check_in_date.value,
        check_out_date: check_out_date.value
      };

      http.post("/addBooking", data)
        .then(response => {
          const booking_id = response.data.id;
          //router.push(`/payment/${booking_id}`);
        })
        .catch(e => {
          console.log(e);
        });
    };

    return {
      currentUser,
      check_in_date,
      check_out_date,
      createBooking
    };
  }
});
</script>