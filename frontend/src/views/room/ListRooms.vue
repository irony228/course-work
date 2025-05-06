<template>
    <div>
        <h4>Список комнат</h4>
        <!-- Определение ссылок -->
        <router-link class="item" to="/addRoom">Добавить комнату</router-link>
        <router-link class="item" to="/searchRooms">Поиск комнаты</router-link>
        <ul>
            <!-- Вывод списка комнат -->
            <li v-for="(room, index) in rooms" :key="index">
                <!-- name - Именованный маршрут: будет осуществляться переход на страницу с просмотром данных о пользователе -->
                <!-- Ссылка на room определена в файле router.js -->
                <!-- По маршруту room подгружается компонент Room.vue -->
                <!-- в params указываются параметры, которые передаются компоненту-->
                <!--Двоеточие перед to указывает, что значение атрибута изменяющееся (динамическое) -->
                <router-link :to="{
                        name: 'room-details',
                        params: { id: room.id }
                    }">
                    {{room.room_number}},
                    {{room.type.name}},
                    {{room.photo_url}},
                    {{room.capacity.name}},
                    {{room.price}},
                    {{room.description}}, 
                    {{room.status.name}}
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
import { defineComponent, ref, onMounted } from 'vue';
import http from "../../http-common"; // подключение объекта, который позволяет отправлять запросы серверу

export default defineComponent({
  name: "ListRooms", // имя шаблона
  setup() {
    const rooms = ref([]);

    const getRooms = () => {
      http
        .get("/listRooms") // обращаемся к серверу для получения списка комнат
        .then(response => { // запрос выполнен успешно
          console.log(response.data)
          rooms.value = response.data;
        })
        .catch(e => { // запрос выполнен с ошибкой
          console.log(e);
        });
    };

    onMounted(() => { // вызывается после монтирования компонента
      getRooms();
    });

    return {
      rooms,
      getRooms
    };
  }
});
</script>

<style>
  .item {
    margin-left: 5px;
  }
</style>