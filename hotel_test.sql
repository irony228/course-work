-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Май 08 2025 г., 15:31
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `hotel_test`
--

-- --------------------------------------------------------

--
-- Структура таблицы `booking`
--

CREATE TABLE `booking` (
  `id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `room_id` int(10) NOT NULL,
  `check_in_date` datetime NOT NULL,
  `check_out_date` datetime NOT NULL,
  `price` float(10,2) NOT NULL,
  `status_id` int(50) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `booking`
--

INSERT INTO `booking` (`id`, `user_id`, `room_id`, `check_in_date`, `check_out_date`, `price`, `status_id`, `created`) VALUES
(5, 2, 1, '2025-05-07 00:00:00', '2025-05-08 00:00:00', 2000.00, 3, '2025-05-07 11:54:17'),
(6, 2, 2, '2025-05-08 00:00:00', '2025-05-10 00:00:00', 7000.00, 3, '2025-05-07 13:03:41'),
(7, 2, 1, '2025-05-07 00:00:00', '2025-05-08 00:00:00', 2000.00, 3, '2025-05-07 14:41:49'),
(8, 2, 1, '2025-05-07 00:00:00', '2025-05-08 00:00:00', 2000.00, 3, '2025-05-07 14:42:34'),
(9, 2, 1, '2025-05-07 00:00:00', '2025-05-08 00:00:00', 2000.00, 3, '2025-05-07 14:44:03'),
(10, 2, 1, '2025-05-07 00:00:00', '2025-05-08 00:00:00', 2000.00, 3, '2025-05-07 14:48:30'),
(11, 2, 1, '2025-05-14 00:00:00', '2025-05-15 00:00:00', 2000.00, 3, '2025-05-07 14:52:11'),
(12, 2, 1, '2025-05-15 00:00:00', '2025-05-21 00:00:00', 12000.00, 2, '2025-05-07 16:28:38'),
(13, 19, 2, '2025-05-07 00:00:00', '2025-05-08 00:00:00', 3500.00, 8, '2025-05-06 02:23:06');

-- --------------------------------------------------------

--
-- Структура таблицы `capacity`
--

CREATE TABLE `capacity` (
  `id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `capacity`
--

INSERT INTO `capacity` (`id`, `name`) VALUES
(1, 'Одноместная'),
(2, 'Двухместная');

-- --------------------------------------------------------

--
-- Структура таблицы `payment`
--

CREATE TABLE `payment` (
  `id` int(10) NOT NULL,
  `booking_id` int(10) NOT NULL,
  `amount` float(10,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `method` varchar(20) NOT NULL,
  `status_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `payment`
--

INSERT INTO `payment` (`id`, `booking_id`, `amount`, `payment_date`, `method`, `status_id`) VALUES
(1, 11, 2000.00, '2025-05-07 14:52:11', 'card', 5),
(2, 12, 12000.00, '2025-05-07 16:28:38', 'card', 4),
(3, 13, 3500.00, '2025-05-08 02:23:06', 'card', 4);

-- --------------------------------------------------------

--
-- Структура таблицы `room`
--

CREATE TABLE `room` (
  `id` int(10) NOT NULL,
  `room_number` int(10) NOT NULL,
  `type_id` int(10) NOT NULL,
  `photo_url` text NOT NULL,
  `capacity_id` int(10) NOT NULL,
  `price` float(10,2) NOT NULL,
  `description` text NOT NULL,
  `status_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `room`
--

INSERT INTO `room` (`id`, `room_number`, `type_id`, `photo_url`, `capacity_id`, `price`, `description`, `status_id`) VALUES
(1, 101, 1, 'standart_one.jpg', 1, 2000.00, 'Одноместный номер класса Стандарт', 7),
(2, 102, 2, 'luxe_one.jpg', 1, 3500.00, 'Одноместный номер класса Люкс', 6),
(3, 103, 1, 'standart_two.jpg', 2, 4000.00, 'Двуместный номер класса Стандарт', 6),
(9, 104, 2, 'luxe_two.webp', 2, 7000.00, 'Двуместный номер класса Люкс', 6);

-- --------------------------------------------------------

--
-- Структура таблицы `status`
--

CREATE TABLE `status` (
  `id` int(10) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `status`
--

INSERT INTO `status` (`id`, `entity_type`, `name`) VALUES
(1, 'booking', 'Забронировано'),
(2, 'booking', 'Оплачено'),
(3, 'booking', 'Отменено'),
(4, 'payment', 'Оплачен'),
(5, 'payment', 'Не оплачен'),
(6, 'room', 'Свободна'),
(7, 'room', 'Занята'),
(8, 'booking', 'Завершено');

-- --------------------------------------------------------

--
-- Структура таблицы `type`
--

CREATE TABLE `type` (
  `id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `type`
--

INSERT INTO `type` (`id`, `name`) VALUES
(1, 'Стандарт'),
(2, 'Люкс');

-- --------------------------------------------------------

--
-- Структура таблицы `user`
--

CREATE TABLE `user` (
  `id` int(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `role` enum('Администратор','Гость') NOT NULL DEFAULT 'Гость',
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `middlename` varchar(20) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `role`, `firstname`, `lastname`, `middlename`, `phone_number`, `email`) VALUES
(2, 'admin', '$2b$10$E4kdmQsGKPQvuwaIvF2/k.LueZpyGm1mcBNGKhOrgVSdxV6EwiApq', 'Администратор', 'Владимир', 'Сенькин', 'Юрьевич', '+79501202359', 'vl.senkin@gmail.com'),
(19, 'guest', '$2b$10$4H8XvOVFk.heAIJzAKGlBeZCoiae4dhTLmXuwycGAd/sbT1XXU11S', 'Гость', 'guest', 'guest', 'guest', '123456', 'mail');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Индексы таблицы `capacity`
--
ALTER TABLE `capacity`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Индексы таблицы `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `room_number` (`room_number`),
  ADD KEY `type_id` (`type_id`),
  ADD KEY `capacity_id` (`capacity_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Индексы таблицы `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `capacity`
--
ALTER TABLE `capacity`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `room`
--
ALTER TABLE `room`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `type`
--
ALTER TABLE `type`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `room_ibfk_2` FOREIGN KEY (`capacity_id`) REFERENCES `capacity` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `room_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
