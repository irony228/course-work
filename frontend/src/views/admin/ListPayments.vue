<template>
  <div class="container">
    <h2>Все платежи</h2>

    <!-- Фильтры -->
    <div class="filters">
      <label>ID:
        <input type="text" v-model="paymentId" class="input-text" />
      </label>
      <label>Цена от:
        <input type="number" v-model="priceFrom" min="0" class="input-text" />
      </label>
      <label>до:
        <input type="number" v-model="priceTo" min="0" class="input-text" />
      </label>
      <label>Дата бронирования от:
        <input type="date" v-model="dateFrom" class="input-text" />
      </label>
      <label>до:
        <input type="date" v-model="dateTo" class="input-text" />
      </label>
      <label>Статус:
        <select v-model="status" class="input-select">
          <option value="">Все</option>
          <option value="Не оплачено">Не оплачено</option>
          <option value="Оплачен">Оплачен</option>
        </select>
      </label>
      <button @click="filterPayments">Применить фильтр</button>
      <button @click="resetFilters" style="margin:10px">Сбросить фильтры</button>
    </div>

    <!-- Таблица платежей -->
    <table>
      <thead>
        <tr>
          <th @click="sortBy('id')">ID <span v-if="sortColumn === 'id'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('booking_id')">ID бронирования <span v-if="sortColumn === 'booking_id'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('amount')">Сумма <span v-if="sortColumn === 'amount'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('status.name')">Статус <span v-if="sortColumn === 'status.name'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
          <th @click="sortBy('payment_date')">Дата <span v-if="sortColumn === 'payment_date'">{{ sortDirection === 1 ? `▲` : `▼` }}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in sortedPayments" :key="payment.id">
          <td>{{ payment.id }}</td>
          <td>{{ payment.booking_id }}</td>
          <td>{{ payment.amount }}</td>
          <td>{{ payment.status.name }}</td>
          <td>{{ formatDateTime(payment.payment_date) }}</td>
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

export default {
  name: "AllPayments",
  setup() {
    const payments = ref([]);
    const store = useStore();
    const router = useRouter();

    const paymentId = ref("");
    const userId = ref("");
    const priceFrom = ref("");
    const priceTo = ref("");
    const dateFrom = ref("");
    const dateTo = ref("");
    const status = ref("");
    const currentUser = computed(() => store.state.auth.user);

    const sortColumn = ref("");
    const sortDirection = ref(1);

    const fetchPayments = () => {
      http.get("/listPayments", {
        headers: { "x-access-token": store.state.auth.token },
      })
      .then(response => {
        payments.value = response.data;
      })
      .catch(e => console.error(e));
    };

    const filterPayments = () => {
      const params = {
        id: paymentId.value,
        user_id: userId.value,
        price_from: priceFrom.value,
        price_to: priceTo.value,
        date_from: dateFrom.value,
        date_to: dateTo.value,
        status: status.value
      };

      http
        .get("/listPayments", { params, headers: { "x-access-token": store.state.auth.token } })
        .then(response => {
          payments.value = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    };

    const resetFilters = () => {
      paymentId.value = "";
      userId.value = "";
      status.value = "";
      priceFrom.value = "",
      priceTo.value = "",
      dateFrom.value = "",
      dateTo.value = "",
      fetchPayments();
    };

    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value *= -1;
      } else {
        sortColumn.value = column;
        sortDirection.value = 1;
      }
    };

    const getValueByPath = (obj, path) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const sortedPayments = computed(() => {
      if (!sortColumn.value) return payments.value;

      return [...payments.value].sort((a, b) => {
        const aValue = getValueByPath(a, sortColumn.value);
        const bValue = getValueByPath(b, sortColumn.value);

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * sortDirection.value;
        }

        return String(aValue).localeCompare(String(bValue)) * sortDirection.value;
      });
    });

    const formatDate = (isoString) => new Date(isoString).toLocaleDateString();
    const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

    onMounted(() => {
      if (currentUser.value.role !== 'Администратор') {
        router.push('/oops');
        return;
      }
      fetchPayments();
    });

    return {
      payments,
      sortColumn,
      sortDirection,
      sortBy,
      sortedPayments,
      paymentId,
      userId,
      status,
      filterPayments,
      resetFilters,
      currentUser,
      formatDate,
      formatDateTime,
      priceFrom,
      priceTo,
      dateFrom,
      dateTo,
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
