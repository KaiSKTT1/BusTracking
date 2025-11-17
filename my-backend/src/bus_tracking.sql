SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `bus_tracking`
--

-- --------------------------------------------------------

--
-- Table structure for table `role`
--
CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_role` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `note` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--
INSERT INTO `role` (`role_id`, `name_role`, `note`) VALUES
(1, 'Admin', 'Quản trị viên hệ thống'),
(2, 'Driver', 'Tài xế xe buýt'),
(3, 'Parent', 'Phụ huynh học sinh');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--
CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `password` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_account_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--
INSERT INTO `user_account` (`user_id`, `role_id`, `username`, `password`, `email`, `status`) VALUES
(1, 1, 'admin1', 'admin123', 'admin1@example.com', 'active'),
(2, 2, 'driver1', 'driver123', 'driver1@example.com', 'active'),
(3, 2, 'driver2', 'driver123', 'driver2@example.com', 'active'),
(4, 2, 'driver3', 'driver123', 'driver3@example.com', 'active'),
(5, 3, 'parent1', 'parent123', 'parent1@example.com', 'active'),
(6, 3, 'parent2', 'parent123', 'parent2@example.com', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `baocao`
--
CREATE TABLE `baocao` (
  `bao_cao_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`bao_cao_id`),
  KEY `admin_id` (`admin_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `baocao_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user_account` (`user_id`),
  CONSTRAINT `baocao_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `user_account` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `baocao`
--
INSERT INTO `baocao` (`admin_id`, `driver_id`, `date`) VALUES
(1, 2, '2025-10-17'),
(1, 3, '2025-10-17'),
(1, 4, '2025-10-18'),
(1, 2, '2025-10-18'),
(1, 3, '2025-10-19');

-- --------------------------------------------------------

--
-- Table structure for table `bus`
--
CREATE TABLE `bus` (
  `bus_id` int(11) NOT NULL AUTO_INCREMENT,
  `capacity` int(11) DEFAULT NULL,
  `license` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`bus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bus`
--
INSERT INTO `bus` (`capacity`, `license`) VALUES
(40, '51B-12345'),
(30, '51B-67890'),
(45, '60C-11111'),
(20, '50A-55555'),
(35, '61B-22222');

-- --------------------------------------------------------

--
-- Table structure for table `school`
--
CREATE TABLE `school` (
  `school_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school`
--
INSERT INTO `school` (`name`) VALUES
('Trường Tiểu học Nguyễn Văn Trỗi'),
('Trường THCS Lê Quý Đôn');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--
CREATE TABLE `student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `id_ph` int(11) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `school_id` (`school_id`),
  KEY `FK_Student_User` (`id_ph`),
  CONSTRAINT `FK_Student_User` FOREIGN KEY (`id_ph`) REFERENCES `user_account` (`user_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `school` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--
INSERT INTO `student` (`name`, `school_id`, `note`, `id_ph`) VALUES
('Nguyễn Văn An', 1, 'Lớp 5A', 5),
('Trần Thị Bình', 1, 'Lớp 4B', 5),
('Lê Hoàng Cường', 2, 'Lớp 7A', 6),
('Phạm Gia Huy', 2, 'Lớp 8B', 6),
('Vũ Minh Anh', 1, 'Lớp 5C', 5);

-- --------------------------------------------------------

--
-- Table structure for table `chitietbaocao`
--
CREATE TABLE `chitietbaocao` (
  `bao_cao_ct_id` int(11) NOT NULL AUTO_INCREMENT,
  `bao_cao_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `tinh_trang` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`bao_cao_ct_id`),
  KEY `bao_cao_id` (`bao_cao_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `chitietbaocao_ibfk_1` FOREIGN KEY (`bao_cao_id`) REFERENCES `baocao` (`bao_cao_id`),
  CONSTRAINT `chitietbaocao_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitietbaocao`
--
INSERT INTO `chitietbaocao` (`bao_cao_id`, `student_id`, `tinh_trang`) VALUES
(1, 1, 'Đi học đúng giờ'),
(1, 2, 'Đi học muộn'),
(2, 3, 'Vắng có phép'),
(3, 4, 'Đi học đúng giờ'),
(5, 5, 'Đi học đúng giờ');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--
CREATE TABLE `route` (
  `route_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `so_stop` int(11) DEFAULT NULL,
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route`
--
INSERT INTO `route` (`name`, `so_stop`) VALUES
('Tuyến 1 - Quận 1 -> Quận 3', 3),
('Tuyến 2 - Tân Bình -> Phú Nhuận', 4),
('Tuyến 3 - Thủ Đức -> Bình Thạnh', 3),
('Tuyến 4 - Gò Vấp -> Quận 1', 4),
('Tuyến 5 - Quận 7 -> Quận 10', 3);

-- --------------------------------------------------------

--
-- Table structure for table `stop`
--
CREATE TABLE `stop` (
  `stop_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`stop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stop`
--
INSERT INTO `stop` (`name`, `address`) VALUES
('Trạm A', '123 Lê Lợi'),
('Trạm B', '456 Nguyễn Trãi'),
('Trạm C', '789 Cách Mạng Tháng 8'),
('Trạm D', '101 Nguyễn Văn Cừ'),
('Trạm E', '202 Điện Biên Phủ'),
('Trạm F', '303 Trường Chinh'),
('Trạm G', '404 Cộng Hòa'),
('Trạm H', '505 Võ Văn Kiệt'),
('Trạm I', '606 Hoàng Hoa Thám'),
('Trạm J', '707 Lý Thường Kiệt');

-- --------------------------------------------------------

--
-- Table structure for table `route_stop`
--
CREATE TABLE `route_stop` (
  `route_id` int(11) NOT NULL,
  `stop_current_id` int(11) NOT NULL,
  `stop_next_id` int(11) NOT NULL,
  PRIMARY KEY (`route_id`,`stop_current_id`,`stop_next_id`),
  KEY `stop_current_id` (`stop_current_id`),
  KEY `stop_next_id` (`stop_next_id`),
  CONSTRAINT `route_stop_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`),
  CONSTRAINT `route_stop_ibfk_2` FOREIGN KEY (`stop_current_id`) REFERENCES `stop` (`stop_id`),
  CONSTRAINT `route_stop_ibfk_3` FOREIGN KEY (`stop_next_id`) REFERENCES `stop` (`stop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `route_stop`
--
INSERT INTO `route_stop` (`route_id`, `stop_current_id`, `stop_next_id`) VALUES
(1, 1, 2),
(1, 2, 3),
(2, 4, 5),
(2, 5, 6),
(2, 6, 7),
(3, 7, 8),
(3, 8, 9),
(4, 2, 5),
(4, 5, 9),
(4, 9, 10),
(5, 1, 3),
(5, 3, 8);

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--
CREATE TABLE `trip` (
  `trip_id` int(11) NOT NULL AUTO_INCREMENT,
  `effective_date` date DEFAULT NULL,
  `time_arrival_first` time DEFAULT NULL,
  `time_arrival_end` time DEFAULT NULL,
  `route_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`trip_id`),
  KEY `route_id` (`route_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`),
  CONSTRAINT `trip_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `user_account` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trip`
--
INSERT INTO `trip` (`effective_date`, `time_arrival_first`, `time_arrival_end`, `route_id`, `driver_id`) VALUES
('2025-10-16', '06:30:00', '07:30:00', 1, 2),
('2025-10-16', '07:00:00', '08:00:00', 2, 3),
('2025-10-16', '06:45:00', '07:40:00', 3, 2),
('2025-10-17', '06:20:00', '07:10:00', 4, 4),
('2025-10-17', '07:15:00', '08:10:00', 5, 3);

-- --------------------------------------------------------

--
-- Table structure for table `timetable`
--
CREATE TABLE `timetable` (
  `timetable_id` int(11) NOT NULL AUTO_INCREMENT,
  `planned_date` date DEFAULT NULL,
  `trip_id` int(11) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `bus_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`timetable_id`),
  KEY `trip_id` (`trip_id`),
  KEY `driver_id` (`driver_id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trip` (`trip_id`),
  CONSTRAINT `timetable_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `user_account` (`user_id`),
  CONSTRAINT `timetable_ibfk_3` FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timetable`
--
INSERT INTO `timetable` (`planned_date`, `trip_id`, `driver_id`, `bus_id`) VALUES
('2025-10-17', 1, 2, 1),
('2025-10-17', 2, 3, 2),
('2025-10-17', 3, 2, 3),
('2025-10-17', 4, 4, 4),
('2025-10-17', 5, 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `student_ride`
--
CREATE TABLE `student_ride` (
  `timetable_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  PRIMARY KEY (`timetable_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_ride_ibfk_1` FOREIGN KEY (`timetable_id`) REFERENCES `timetable` (`timetable_id`),
  CONSTRAINT `student_ride_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_ride`
--
INSERT INTO `student_ride` (`timetable_id`, `student_id`) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(5, 5);

COMMIT;