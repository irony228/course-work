<template>
    <div>
      <h4>Добавление комнаты</h4>
      <div v-if="!submitted">
        <form @submit="addRoom">
          <div class="form-row">
            <label for="room_number">Номер комнаты:</label>
            <input type="text" id="room_number" required v-model="room.room_number" class="input-text">
          </div>
          <div class="form-row">
            <label for="type_id">Тип:</label>
            <select id="type_id" v-model="room.type_id" required>
              <option v-for="type in types" :key="type.id" :value="type.id">{{type.name}}</option>
            </select>
          </div>
          <div class="form-row">
            <label for="photo_url">Изображение:</label>
            <input type="text" id="photo_url" required v-model="room.photo_url" class="input-text">
          </div>
          <div class="form-row">
            <label for="capacity_id">Вместимость:</label>
            <select id="capacity_id" v-model="room.capacity_id" required>
              <option v-for="capacity in capacities" :key="capacity.id" :value="capacity.id">{{capacity.name}}</option>
            </select>
          </div>
          <div class="form-row">
            <label for="price">Цена:</label>
            <input type="text" id="price" required v-model="room.price" class="input-text">
          </div>
          <div class="form-row">
            <label for="description">Описание:</label>
            <input type="text" id="description" required v-model="room.description" class="input-text">
          </div>
          <div class="form-row">
            <label for="status_id">Статус:</label>
            <select id="status_id" v-model="room.status_id" required>
              <option v-for="status in statuses.filter(s => s.entity_type === 'room')" :key="status.id" :value="status.id">{{status.name}}</option>
            </select>
          </div>
          <div class="form-row">
            <button type="submit">Добавить</button>
          </div>
        </form>
      </div>
      <div v-else>
        <h4>Вы успешно добавили запись</h4>
        <div>
          <button v-on:click="newRoom">Добавить новую комнату</button>
        </div>
        <div>
          <router-link to="/listRooms">Вернуться к списку комнат</router-link>
        </div>
      </div>
    </div>
</template>
  
  <script>
  import { defineComponent, ref, onMounted} from 'vue';
  import http from "../../http-common";
  
  export default defineComponent({
    name: "AddRoom",
    setup() {
      const room = ref({
        room_number: "",
        type_id: "",
        photo_url: "",
        capacity: "",
        price: "",
        description: "", 
        status_id: ""
      });
      const submitted = ref(false);
      const capacities = ref([]);
      const types = ref([]);
      const statuses = ref([]);
    
      const addRoom = (e) => {
        e.preventDefault();
        const data = {
          room_number: room.value.room_number,
          type_id: room.value.type_id,
          photo_url: room.value.photo_url ,
          capacity_id: room.value.capacity_id,
          price: room.value.price,
          description: room.value.description, 
          status_id: room.value.status_id
        };
        http
          .post("/addRoom", data)
          .then(response => {
            room.value.id = response.data.id;
            submitted.value = true;
          })
          .catch(e => { 
            console.log(e);
            alert("Комната с заданным номером уже существует");
          });
  
        //submitted.value = true;
      };
      const getSelectData = async () => {
        try{
            const [TypesRes, CapacitiesRes, StatusesRes] = await Promise.all([
                http.get("/types"),
                http.get("/capacities"),
                http.get("/statuses")
            ]);
            capacities.value = CapacitiesRes.data;
            types.value = TypesRes.data;
            statuses.value = StatusesRes.data;
        }catch(error){
            console.error(error);
        }
      };
      const newRoom = () => {
        submitted.value = false;
        room.value = {
          room_number: "",
          type_id: "",
          photo_url: "",
          capacity_id: "",
          price: "",
          description: "", 
          status_id: ""
        };
      };
      onMounted(() => {
        getSelectData();
      });
      return {
        room,
        submitted,
        types,
        capacities,
        statuses,
        addRoom,
        newRoom
      };
    }
  });
  </script>