<template>
  <div class="container">
    <h2>Все пользователи</h2>
    <div class="filters">
      <label>ID:
        <input type="text" v-model="userId" class="input-text" />
      </label>
      <label>Фамилия:
        <input type="text" v-model="lastname" class="input-text" />
      </label>
      <label>Имя:
        <input type="text" v-model="firstname" class="input-text" />
      </label>
      <label>Email:
        <input type="text" v-model="email" class="input-text" />
      </label>
      <label>Номер телефона:
        <input type="text" v-model="phone_number" class="input-text" />
      </label>
      <label>Роль:
        <select v-model="role" class="input-select">
          <option value="">Все</option>
          <option value="Администратор">Администратор</option>
          <option value="Гость">Гость</option>
        </select>
      </label>
      <button @click="filterUsers">Применить фильтр</button>
      <button @click="resetFilters" style="margin:10px">Сбросить фильтры</button>
    </div>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('id')">ID <span v-if="sortColumn === 'id'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('lastname')">Фамилия <span v-if="sortColumn === 'lastname'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('firstname')">Имя <span v-if="sortColumn === 'firstname'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('email')">Email <span v-if="sortColumn === 'email'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('phone_number')">Номер телефона <span v-if="sortColumn === 'phone_number'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('role')">Роль <span v-if="sortColumn === 'role'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th>Изменить роль</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in sortedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone_number }}</td>
          <td>{{ user.role }}</td>
          <td>
            <select v-model="user.role" @change="updateRole(user)" class="input-select">
              <option value="Администратор">Администратор</option>
              <option value="Гость">Гость</option>
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import UserService from '../../services/user.service';

export default {
  name: "AllUsers",
  setup() {
    const users = ref([]);
    const store = useStore();
    const router = useRouter();

    const userId = ref("");
    const lastname = ref("");
    const firstname = ref("");
    const email = ref("");
    const phone_number = ref("");
    const role = ref("");
    const currentUser = computed(() => store.state.auth.user);

    const sortColumn = ref("");
    const sortDirection = ref(1);

    const fetchUsers = () => {
      http.get("/listUsers", {
        headers: { "x-access-token": store.state.auth.token },
      })
      .then(response => {
        users.value = response.data;
      })
      .catch(e => console.error(e));
    };

    const filterUsers = () => {
      const params = {
        id: userId.value,
        lastname: lastname.value,
        firstname: firstname.value,
        email: email.value,
        phone_number: phone_number.value,
        role: role.value
      };

      http
        .get("/listUsers", { params, headers: { "x-access-token": store.state.auth.token } })
        .then(response => {
          users.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const updateRole = (user) => {
      http.post(`/updateUser/${user.id}`, {
        role: user.role
      }, {
        headers: { "x-access-token": store.state.auth.token },
      })
      .then(() => {
        fetchUsers();
      })
      .catch(e => console.error(e));
    };
    
    const resetFilters = () => {
      userId.value = "";
      lastname.value = "";
      firstname.value = "";
      email.value = "";
      phone_number.value = "";
      role.value = "";
      fetchUsers();
    };

    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value *= -1;
      } else {
        sortColumn.value = column;
        sortDirection.value = 1;
      }
    };

    const sortedUsers = computed(() => {
      if (!sortColumn.value) return users.value;

      return [...users.value].sort((a, b) => {
        const aValue = a[sortColumn.value];
        const bValue = b[sortColumn.value];

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * sortDirection.value;
        }

        return String(aValue).localeCompare(String(bValue)) * sortDirection.value;
      });
    });

    onMounted(() => {
      if (currentUser.value && currentUser.value.role !== 'Администратор') {
        router.push('/oops');
        return;
      }
      if (!currentUser.value){
        router.push('/oops');
        return;
      }
      fetchUsers();
    });

    return {
      users,
      sortColumn,
      sortDirection,
      sortBy,
      sortedUsers,
      userId,
      lastname,
      firstname,
      email,
      phone_number,
      role,
      filterUsers,
      resetFilters,
      currentUser,
      updateRole
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
