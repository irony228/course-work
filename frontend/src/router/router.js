import { createWebHistory, createRouter } from "vue-router";
import store from "../store/index";

const routes = [
    {
        path: "/listRooms",
        name: "rooms",
        alias: "/rooms",
        component: () => import('../views/room/ListRooms.vue'),
        meta: {
            title: "Список комнат"
        }
    },
    {
        path: "/room/:id",
        name: "room-details",
        component: () => import('../views/room/Room.vue'),
        props: true, 
        meta: {
            title: "Комната"
        }
    },
    {
        path: "/addRoom",
        name: "add-user",
        component: () => import('../views/room/AddRoom.vue'),
        meta: {
            title: "Добавление комнаты"
        }
    },
    {
        path: "/editRoom/:id",
        name: "edit-user",
        component: () => import('../views/room/EditRoom.vue'),
        props: true,
        meta: {
            title: "Редактирование комнаты"
        }
    },
    {
        path: "/login",
        name: "login-user",
        component: () => import('../views/authorization/Login.vue'),
        meta: {
            title: "Вход в систему"
        }
    },
    {
        path: "/register",
        name: "register-user",
        component: () => import('../views/authorization/Register.vue'),
        meta: {
            title: "Регистрация"
        }
        
    },
    {
        path: "/profile",
        name: "profile-user",
        component: () => import('../views/authorization/Profile.vue'),
        meta: {
            title: "Профиль пользователя",
            requiredAuth: true
        }
    },
    {
        path: "/oops",
        name: "wrong-page",
        component: () => import('../views/redirect_page/Oops.vue'),
        meta: {
            title: "Ошибка"
        }
    },
    {
        path: "/booking/:room_id",
        name: "Booking",
        component: () => import('../views/booking/Booking.vue'),
        props: true
    },
    {
        path: "/admin/bookings",
        name: "AllBookings",
        component: () => import('../views/admin/ListBookings.vue'),
        meta: {
            title: "Бронирования"
        }
    },
    {
        path: "/admin/users",
        name: "AllUsers",
        component: () => import('../views/admin/ListUsers.vue'),
        meta: {
            title: "Пользователи"
        }
    },
    {
        path: "/admin/payments",
        name: "AllPayments",
        component: () => import('../views/admin/ListPayments.vue'),
        meta: {
            title: "Платежи"
        }
    },
      
];

const router = createRouter({
    history: createWebHistory(), 
    routes, 
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title || "Главная страница";

    const isTokenActive = await store.getters["auth/isTokenActive"];

    if (isTokenActive) {
        return next();
    }

    const user = JSON.parse(localStorage.getItem("user")); 

    if (user) {
        try {
            await store.dispatch("auth/refreshToken", user);
            return next();
        } catch (err) {
            console.error("Ошибка обновления токена:", err); 
            localStorage.removeItem("user");
            return next({ path: "/login" });
        }
    } else {
        localStorage.removeItem("user");

        if (to.meta.requiredAuth) {
            return next({ path: "/login" });
        }
    }

    return next();
});

export default router;