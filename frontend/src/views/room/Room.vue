<template>
  <div v-if="room">
    <h4>Комната №{{ room.room_number }}</h4>
    <p><img :src="room.photo_url" alt="Фото комнаты" width="600" class="photo"></p>
    <div class="description">
      <p><strong>Класс:</strong> {{ room.type.name }}</p>
      <p><strong>Вместимость:</strong> {{ room.capacity.name }}</p>
      <p><strong>Цена:</strong> {{ room.price }} &#8381;</p>
      <p><strong>Описание:</strong> {{ room.description }}</p>
      <p><strong>Статус:</strong> {{ room.status.name }}</p>
    </div>
    <!--<router-link :to="'/editRoom/' + room.id">Редактировать</router-link>-->
    <button @click="$router.push('/editRoom/'+room.id)">Редактировать</button>
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
    
    const getRoom = () => {
        http
          .get("/room/" + props.id) // обращаемся к серверу для получения категории, id взят из входных параметров (props)
          .then(response => { // запрос выполнен успешно
            room.value = response.data;
            console.log(response.data)
          })
          .catch(e => { // запрос выполнен с ошибкой
            console.log(e);
          });
      };

    onMounted(() => {
      getRoom();
    });

    return {
         room,
         };
  }
});
</script>
