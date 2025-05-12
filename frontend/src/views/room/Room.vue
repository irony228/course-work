<template>
  <div v-if="room" class="room-class">
    <h4>Комната №{{ room.room_number }}</h4>
    <p><img :src="`../public/images/${room.photo_url}`" alt="Фото комнаты" width="600" class="rounded mx-auto d-block"></p>
    <div class="description">
      <p><strong>Класс:</strong> {{ room.type.name }}</p>
      <p><strong>Вместимость:</strong> {{ room.capacity.name }}</p>
      <p><strong>Цена:</strong> {{ room.price }} &#8381;</p>
      <p><strong>Описание:</strong> {{ room.description }}</p>
      <p><strong>Статус:</strong> {{ room.status.name }}</p>
    </div>
    <router-link v-if="currentUser.role === 'Администратор'" :to="`/editRoom/${room.id}`">
      <button>Редактировать</button>
    </router-link>
    <router-link v-if="room.status_id !== 7":to="`/booking/${room.id}`">
      <button>Забронировать</button>
    </router-link>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import http from "../../http-common";
import { useStore } from 'vuex';

export default defineComponent({
  name: "RoomDetails",
    props: ['id'],
    setup(props) {
    const room = ref(null);
    const store = useStore();
    const router = useRouter();

    const currentUser = computed(() => store.state.auth.user);

    const getRoom = () => {
        http
          .get("/room/" + props.id) 
          .then(response => { 
            room.value = response.data;
            console.log(response.data)
          })
          .catch(e => {
            console.log(e);
          });
      };

    onMounted(() => {
      if (!currentUser.value) {
        router.push('/login');
      }
      getRoom();
    });

    return {
      room,
      currentUser
      };
  }
});
</script>
<style>
  button{  margin: 5px;}
</style>