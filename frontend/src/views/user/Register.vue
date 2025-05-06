<template>
    <div>
      <h4>Регистрация</h4>
      <div v-if="!submitted">
        <form @submit="addUser">
          <input type="text" name="username" id="username" placeholder="Логин" required v-model="user.username">
          <input type="text" name="password" id="password" placeholder="Пароль" required v-model="user.password">
          <input type="text" name="firstname" id="firstname" placeholder="Имя" required v-model="user.firstname">
          <input type="text" name="lastname" id="lastname" placeholder="Фамилия" required v-model="user.lastname">
          <input type="text" name="middlename" id="middlename" placeholder="Отчество" required v-model="user.middlename">
          <input type="text" name="phone_number" id="phone_number" placeholder="Номер телефона" required v-model="user.phone_number">
          <input type="text" name="email" id="email" placeholder="Email" required v-model="user.email">
          <input type="submit" value="Добавить">
        </form>
      </div>
      <div v-else>
        <h4>Вы успешно зарегистрировались</h4>
        <div>
          <router-link to="/listUsers">Вернуться к списку комнат</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref} from 'vue';
  import http from "../../http-common";
  
  export default defineComponent({
    name: "AddUser",
    setup() {
      const user = ref({
          username: "", 
          password: "", 
          firstname: "", 
          lastname: "",
          middlename: "", 
          phone_number: "", 
          email: ""
      });
      const submitted = ref(false);
    
      const addUser = (e) => {
        e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
        const data = {
          username: user.value.username, 
          password: user.value.password, 
          firstname: user.value.firstname, 
          lastname: user.value.lastname,
          middlename: user.value.middlename, 
          phone_number: user.value.phone_number, 
          email: user.value.email
        };
        http
          .post("/addUser", data)
          .then(response => { // запрос выполнился успешно
            user.value.id = response.data.id;
            submitted.value = true;
          })
          .catch(e => { // при выполнении запроса возникли ошибки
            console.log(e);
            alert("Пользователь с таким username уже существует");
          });
  
        //submitted.value = true;
      };
      const newUser = () => {
        submitted.value = false;
        user.value = {
          username: "", 
          password: "", 
          firstname: "", 
          lastname: "",
          middlename: "", 
          phone_number: "", 
          email: ""
        };
      };
      return {
        user,
        submitted,
        addUser,
        newUser
      };
    }
  });
  </script>