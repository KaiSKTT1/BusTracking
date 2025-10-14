-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2025 at 07:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buscontrol`
--

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--

CREATE TABLE `bus` (
  `id` int(11) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `seats` int(11) NOT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `buslocations`
--

CREATE TABLE `buslocations` (
  `id` bigint(20) NOT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `type` enum('Info','Warning','Alert') DEFAULT 'Info',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pickupstatus`
--

CREATE TABLE `pickupstatus` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `status` enum('PickedUp','DroppedOff','Absent') NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `bus_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stops`
--

CREATE TABLE `stops` (
  `id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `stop_name` varchar(100) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `stop_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `studentroutes`
--

CREATE TABLE `studentroutes` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL,
  `pickup_stop_id` int(11) DEFAULT NULL,
  `dropoff_stop_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','Driver','Parent') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bus`
--
ALTER TABLE `bus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bus_driver` (`driver_id`);

--
-- Indexes for table `buslocations`
--
ALTER TABLE `buslocations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bus_id` (`bus_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pickupstatus`
--
ALTER TABLE `pickupstatus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `schedule_id` (`schedule_id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `bus_id` (`bus_id`),
  ADD KEY `driver_id` (`driver_id`);

--
-- Indexes for table `stops`
--
ALTER TABLE `stops`
  ADD PRIMARY KEY (`id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `studentroutes`
--
ALTER TABLE `studentroutes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `pickup_stop_id` (`pickup_stop_id`),
  ADD KEY `dropoff_stop_id` (`dropoff_stop_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bus`
--
ALTER TABLE `bus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `buslocations`
--
ALTER TABLE `buslocations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pickupstatus`
--
ALTER TABLE `pickupstatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stops`
--
ALTER TABLE `stops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `studentroutes`
--
ALTER TABLE `studentroutes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bus`
--
ALTER TABLE `bus`
  ADD CONSTRAINT `fk_bus_driver` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `buslocations`
--
ALTER TABLE `buslocations`
  ADD CONSTRAINT `buslocations_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `pickupstatus`
--
ALTER TABLE `pickupstatus`
  ADD CONSTRAINT `pickupstatus_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `pickupstatus_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`);

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`id`),
  ADD CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `stops`
--
ALTER TABLE `stops`
  ADD CONSTRAINT `stops_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `studentroutes`
--
ALTER TABLE `studentroutes`
  ADD CONSTRAINT `studentroutes_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `studentroutes_ibfk_2` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  ADD CONSTRAINT `studentroutes_ibfk_3` FOREIGN KEY (`pickup_stop_id`) REFERENCES `stops` (`id`),
  ADD CONSTRAINT `studentroutes_ibfk_4` FOREIGN KEY (`dropoff_stop_id`) REFERENCES `stops` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- ======================
-- 🧍 USERS
-- ======================
INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Nguyen Van A', '0912345678', 'a@gmail.com', '123456', 'Admin', NOW()),
(2, 'Nguyen Van B', '0987654321', 'b@gmail.com', '654321', 'Driver', NOW()),
(3, 'Tran Thi C', '0977888999', 'c@gmail.com', 'parent123', 'Parent', NOW()),
(4, 'Le Van D', '0909090909', 'd@gmail.com', 'parent456', 'Parent', NOW());

-- ======================
-- 🚌 BUS
-- ======================
INSERT INTO `bus` (`id`, `license_plate`, `seats`, `driver_id`, `created_at`) VALUES
(1, '51B-12345', 30, 2, NOW()),
(2, '51B-67890', 40, NULL, NOW());

-- ======================
-- 🚏 ROUTES
-- ======================
INSERT INTO `routes` (`id`, `name`, `description`) VALUES
(1, 'Route 1 - District 1 to School', 'Morning and afternoon route for District 1'),
(2, 'Route 2 - District 5 to School', 'Morning and afternoon route for District 5');

-- ======================
-- 🕒 SCHEDULES
-- ======================
INSERT INTO `schedules` (`id`, `route_id`, `bus_id`, `driver_id`, `start_time`, `end_time`) VALUES
(1, 1, 1, 2, '2025-10-12 06:30:00', '2025-10-12 07:30:00'),
(2, 1, 1, 2, '2025-10-12 16:00:00', '2025-10-12 17:00:00'),
(3, 2, 2, NULL, '2025-10-12 06:45:00', '2025-10-12 07:45:00');

-- ======================
-- 🚏 STOPS
-- ======================
INSERT INTO `stops` (`id`, `route_id`, `stop_name`, `latitude`, `longitude`, `stop_order`) VALUES
(1, 1, 'Stop 1 - Nguyen Hue', 10.7769, 106.7009, 1),
(2, 1, 'Stop 2 - Le Loi', 10.7720, 106.6980, 2),
(3, 1, 'Stop 3 - School Gate', 10.7626, 106.6823, 3),
(4, 2, 'Stop 1 - Tran Hung Dao', 10.7560, 106.6660, 1),
(5, 2, 'Stop 2 - Nguyen Trai', 10.7520, 106.6650, 2),
(6, 2, 'Stop 3 - School Gate', 10.7626, 106.6823, 3);

-- ======================
-- 👦 STUDENTS
-- ======================
INSERT INTO `students` (`id`, `name`, `address`, `parent_id`) VALUES
(1, 'Nguyen Minh Khang', '123 Nguyen Hue, Q1', 3),
(2, 'Le Bao Han', '45 Tran Hung Dao, Q5', 4),
(3, 'Pham Gia Bao', '20 Nguyen Trai, Q5', 4);

-- ======================
-- 🧭 STUDENTROUTES
-- ======================
INSERT INTO `studentroutes` (`id`, `student_id`, `route_id`, `pickup_stop_id`, `dropoff_stop_id`) VALUES
(1, 1, 1, 1, 3),
(2, 2, 2, 4, 6),
(3, 3, 2, 5, 6);

-- ======================
-- 📍 BUS LOCATIONS (tracking)
-- ======================
INSERT INTO `buslocations` (`id`, `bus_id`, `latitude`, `longitude`, `timestamp`) VALUES
(1, 1, 10.7760, 106.7000, NOW()),
(2, 1, 10.7720, 106.6980, NOW()),
(3, 2, 10.7520, 106.6650, NOW());

-- ======================
-- 🚸 PICKUP STATUS
-- ======================
INSERT INTO `pickupstatus` (`id`, `student_id`, `schedule_id`, `status`, `timestamp`) VALUES
(1, 1, 1, 'PickedUp', NOW()),
(2, 2, 3, 'Absent', NOW()),
(3, 3, 3, 'DroppedOff', NOW());

-- ======================
-- ✉️ MESSAGES
-- ======================
INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(1, 3, 2, 'Driver, please confirm pickup time.', NOW()),
(2, 2, 3, 'We will arrive at 6:40 AM.', NOW());

-- ======================
-- 🔔 NOTIFICATIONS
-- ======================
INSERT INTO `notifications` (`id`, `user_id`, `message`, `type`, `created_at`) VALUES
(1, 3, 'Your child has been picked up.', 'Info', NOW()),
(2, 4, 'Your child is absent today.', 'Warning', NOW()),
(3, 2, 'Bus maintenance due next week.', 'Alert', NOW());
