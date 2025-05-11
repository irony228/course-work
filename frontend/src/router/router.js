import { createWebHistory, createRouter } from "vue-router";
import store from "../store/index";

// определяем маршруты
const routes = [
    {
        path: "/listRooms", // указание маршрута, по которому будем переходить к списку категорий
        name: "rooms", // имя маршрута
        alias: "/rooms", // указание дополнительного маршрута
        component: () => import('../views/room/ListRooms.vue'), // компонент, на основании которого будет отрисовываться страница
        meta: {
            title: "Список комнат"
        }
    },
    {
        path: "/room/:id",
        name: "room-details",
        component: () => import('../views/room/Room.vue'),
        props: true, // указываем, что компонент Category.vue может принимать параметры в адресной строке, например, в path указан id
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
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
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
      
];

const router = createRouter({
    history: createWebHistory(), // указываем, что будет создаваться история посещений веб-страниц
    routes, // подключаем маршрутизацию
});

// указание заголовка компонентам (тега title), заголовки определены в meta
router.beforeEach(async (to, from, next) => {
    // устанавливаем заголовок страницы в зависимости от метаданных маршрута
    document.title = to.meta.title || "Главная страница";

    // проверяем наличие токена и срок его действия
    const isTokenActive = await store.getters["auth/isTokenActive"];

    // если токен действителен, продолжаем навигацию
    if (isTokenActive) {
        return next();
    }

    // получаем пользователя из локального хранилища
    const user = JSON.parse(localStorage.getItem("user")); 
    //console.log(user)

    if (user) {
        try {
            // пытаемся обновить токен
            await store.dispatch("auth/refreshToken", user);
            return next(); // Если обновление прошло успешно, продолжаем навигацию
        } catch (err) {
            console.error("Ошибка обновления токена:", err); // логируем ошибку
            localStorage.removeItem("user"); // удаляем пользователя из локального хранилища
            return next({ path: "/login" }); // переходим на страницу входа
        }
    } else {
        // если токена нет или он истек, проверяем, требуется ли авторизация для доступа к маршруту
        localStorage.removeItem("user"); // удаляем пользователя из локального хранилища

        if (to.meta.requiredAuth) {
            return next({ path: "/login" }); // если доступа нет, перенаправляем на страницу входа
        }
    }

    // если маршрут не требует авторизации, продолжаем навигацию
    return next();
});

export default router;