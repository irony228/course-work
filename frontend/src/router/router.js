import { createWebHistory, createRouter } from "vue-router";

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
];

const router = createRouter({
    history: createWebHistory(), // указываем, что будет создаваться история посещений веб-страниц
    routes, // подключаем маршрутизацию
});

// указание заголовка компонентам (тега title), заголовки определены в meta
router.beforeEach((to, from, next) => {
    // для тех маршрутов, для которых не определены компоненты, подключается только App.vue
    // поэтому устанавливаем заголовком по умолчанию название "Главная страница"
    document.title = to.meta.title || 'Главная страница';
    next();
});

export default router;