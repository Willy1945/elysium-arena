-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: elysium
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `elysium`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `elysium` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `elysium`;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `device_id` bigint unsigned NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `duration` int unsigned NOT NULL,
  `end_time` time NOT NULL,
  `total_price` int unsigned NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookings_booking_code_unique` (`booking_code`),
  KEY `bookings_user_id_foreign` (`user_id`),
  KEY `bookings_device_id_booking_date_status_index` (`device_id`,`booking_date`,`status`),
  CONSTRAINT `bookings_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Makanan','2026-08-22 20:23:10','2026-08-22 20:23:10'),(2,'Minuman','2026-08-22 20:23:10','2026-08-22 20:23:10'),(4,'Kopi','2026-08-22 20:23:10','2026-08-22 20:23:10'),(5,'Dessert','2026-08-22 20:23:10','2026-08-22 20:23:10'),(6,'Snack','2026-08-22 20:35:25','2026-08-22 20:35:25');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_games`
--

DROP TABLE IF EXISTS `device_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_games` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `device_id` bigint unsigned NOT NULL,
  `game_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_games_device_id_game_id_unique` (`device_id`,`game_id`),
  KEY `device_games_game_id_foreign` (`game_id`),
  CONSTRAINT `device_games_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `device_games_game_id_foreign` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_games`
--

LOCK TABLES `device_games` WRITE;
/*!40000 ALTER TABLE `device_games` DISABLE KEYS */;
INSERT INTO `device_games` VALUES (4,4,4,NULL,NULL),(5,5,4,NULL,NULL),(6,6,4,NULL,NULL),(7,7,4,NULL,NULL),(11,7,8,NULL,NULL),(12,7,6,NULL,NULL),(13,7,7,NULL,NULL),(14,7,5,NULL,NULL),(15,7,9,NULL,NULL),(16,4,9,NULL,NULL),(17,4,1,NULL,NULL),(18,4,5,NULL,NULL),(19,4,7,NULL,NULL),(20,4,8,NULL,NULL),(21,4,6,NULL,NULL),(22,5,7,NULL,NULL),(23,5,8,NULL,NULL),(24,5,1,NULL,NULL),(25,5,9,NULL,NULL),(26,6,5,NULL,NULL),(27,6,7,NULL,NULL),(28,6,6,NULL,NULL),(29,6,8,NULL,NULL),(30,6,9,NULL,NULL),(31,6,1,NULL,NULL),(32,2,19,NULL,NULL),(33,2,16,NULL,NULL),(34,2,17,NULL,NULL),(35,2,18,NULL,NULL),(36,2,15,NULL,NULL),(38,11,15,NULL,NULL),(39,11,18,NULL,NULL),(41,11,16,NULL,NULL),(42,11,17,NULL,NULL),(43,11,19,NULL,NULL),(45,12,15,NULL,NULL),(46,12,18,NULL,NULL),(47,12,16,NULL,NULL),(48,12,17,NULL,NULL),(50,13,15,NULL,NULL),(51,13,18,NULL,NULL),(52,13,17,NULL,NULL),(53,13,16,NULL,NULL),(54,13,19,NULL,NULL),(55,5,6,NULL,NULL),(56,5,5,NULL,NULL),(57,3,11,NULL,NULL),(58,3,12,NULL,NULL),(59,3,8,NULL,NULL),(60,3,10,NULL,NULL),(61,3,14,NULL,NULL),(62,3,13,NULL,NULL),(63,8,13,NULL,NULL),(64,8,10,NULL,NULL),(65,8,14,NULL,NULL),(66,8,8,NULL,NULL),(67,8,12,NULL,NULL),(68,8,11,NULL,NULL),(69,9,12,NULL,NULL),(70,9,8,NULL,NULL),(71,9,11,NULL,NULL),(72,9,13,NULL,NULL),(73,9,10,NULL,NULL),(74,9,14,NULL,NULL),(75,10,13,NULL,NULL),(76,10,10,NULL,NULL),(77,10,14,NULL,NULL),(78,10,12,NULL,NULL),(79,10,8,NULL,NULL),(80,10,11,NULL,NULL),(82,2,20,NULL,NULL),(83,11,20,NULL,NULL),(84,12,20,NULL,NULL),(85,13,20,NULL,NULL);
/*!40000 ALTER TABLE `device_games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_ratings`
--

DROP TABLE IF EXISTS `device_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_ratings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_ratings_user_id_unique` (`user_id`),
  CONSTRAINT `device_ratings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_ratings`
--

LOCK TABLES `device_ratings` WRITE;
/*!40000 ALTER TABLE `device_ratings` DISABLE KEYS */;
INSERT INTO `device_ratings` VALUES (1,4,5,'Elysium arena keren. device nya berkualitas ada banyak game dan tempatnya nyaman','2026-10-02 12:21:37','2026-10-02 12:21:37'),(2,6,5,'Elysium Arena Terbaikkkkk!!!!','2026-10-06 12:26:45','2026-10-06 12:26:45'),(3,7,4,'Good:v','2026-10-22 00:02:22','2026-10-22 00:02:22');
/*!40000 ALTER TABLE `device_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_types`
--

DROP TABLE IF EXISTS `device_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_types` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_types_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_types`
--

LOCK TABLES `device_types` WRITE;
/*!40000 ALTER TABLE `device_types` DISABLE KEYS */;
INSERT INTO `device_types` VALUES (1,'PS5','2026-08-21 22:22:22','2026-08-21 22:22:22'),(2,'PS4','2026-08-21 22:22:22','2026-08-21 22:22:22'),(3,'PC','2026-08-21 22:22:22','2026-08-21 22:22:22');
/*!40000 ALTER TABLE `device_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `device_type_id` bigint unsigned NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_hour` int unsigned NOT NULL,
  `status` enum('available','booked','occupied','maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `client_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `devices_client_token_unique` (`client_token`),
  KEY `devices_device_type_id_foreign` (`device_type_id`),
  KEY `devices_status_index` (`status`),
  CONSTRAINT `devices_device_type_id_foreign` FOREIGN KEY (`device_type_id`) REFERENCES `device_types` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (2,3,'PC 01',8000,'available','Im0ns7eHen82tNYreyTGx9Y7UHfLr3Pb3tC6R60ahTh2oKi4','devices/eAOVl1wAPlYsZuzjYwhKcGccvbYHjs4nxle14WHj.jpg','Pc Gaming','2026-08-21 22:40:05','2026-10-29 06:49:15'),(3,1,'PS5 01',10000,'available',NULL,'devices/H6zXG6AaUy26XORbLGmtwNIYlhMetMULQiJXbmjt.png','PS5','2026-08-21 22:44:27','2026-10-29 06:49:15'),(4,2,'PS4 02',7000,'available',NULL,'devices/B7MqTmJTxuXhwKqOfvXsOhWK8NEt5kVsw69ZsnvP.png','ps4','2026-08-22 19:38:52','2026-10-29 06:49:15'),(5,2,'PS4 03',7000,'available',NULL,'devices/TY6kJznXm9uuLrOgvrkW0uD1PvQhyCwFPJgdU1xu.png','PS4','2026-08-29 18:26:33','2026-10-29 06:49:15'),(6,2,'PS4 04',7000,'available',NULL,'devices/kKUjjnyfEFgiwH3mmiEPvuUd9f9dQi8W5t0hWdGb.png','PS4','2026-08-29 18:27:32','2026-10-29 06:49:15'),(7,2,'PS4 01',7000,'available',NULL,'devices/d6tJqXfdmkFsNQRlHMfkGLzGjefKI3diHThau8U1.png','PS4','2026-08-29 18:28:34','2026-10-29 06:49:15'),(8,1,'PS5 02',10000,'available',NULL,'devices/virPdwnJiQ6K1SRKvgQY7ZEeTx7GUBHnBZ29QuEH.png','PS5','2026-08-29 18:35:30','2026-10-29 06:49:15'),(9,1,'PS5 03',10000,'available',NULL,'devices/wEQIDqErmY6kipRtjPy7icT5fGqFh0LxKLNIryTl.png','PS5','2026-08-29 18:36:12','2026-10-29 06:49:15'),(10,1,'PS5 04',10000,'available',NULL,'devices/QcTqShn5iPALG7tSU2dwqrHv54DVC4VwwngPJNdP.png','PS5','2026-08-29 18:36:48','2026-10-29 06:49:15'),(11,3,'PC 02',8000,'available','KdfVCbADU0i2AYxaLC2pei0T80IY35gCn00zCcXkTmyKgHH9','devices/4JrnltAukAdFpO6j23emYvIokhxXlT8m1172ZSFi.jpg','PC Gaming','2026-08-29 18:39:04','2026-10-29 06:49:15'),(12,3,'PC 03',8000,'available',NULL,'devices/q2RIiIuAdHlXBqIJAVIKGu98VosMvjGpZgu7fp1S.jpg','PC Gaming','2026-08-29 18:40:16','2026-10-29 06:49:15'),(13,3,'PC 04',8000,'available',NULL,'devices/kGnoAfaREvB6v3KZLjmv1udx9prwedUxInfIkSF1.jpg','PC Gaming','2026-08-29 18:43:21','2026-10-29 06:49:15');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_response` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feedbacks_user_id_foreign` (`user_id`),
  CONSTRAINT `feedbacks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,4,'game_request','Ingin request game','Hallo min saya mau request kalau bisa tambahkan game GTA V Roleplay untuk di PC, Terima Kasih.','resolved','Terima kasih telah menghubungi kami. Untuk permintaanya akan kami pertimbangkan yaa','2026-09-19 11:16:22','2026-09-24 00:53:06'),(2,7,'menu_request','request','hallo min kalau bisa tolong tambahkan menu bakso','in_review',NULL,'2026-10-22 07:21:28','2026-10-22 07:21:53');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platforms` json DEFAULT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Red Dead Redemption 2','[\"PS4\"]','games/IoEqHLLxAcmtnpOzbfN0EpGfjqXKD4KCbMG5psml.avif','Game open-world (dunia terbuka) bertema koboi dengan cerita yang sangat emosional dan grafis yang luar biasa realistis','2026-08-22 01:47:36','2026-08-29 19:01:27'),(4,'Good Of War','[\"PS4\"]','games/IBXL5cdQYaVPvSGylQ6qxEHmO8gdxIfE0w4eEsm5.jpg','Petualangan epik Kratos dan anaknya, Atreus, di dunia mitologi Nordik dengan sistem pertarungan yang intens dan sinematik','2026-08-22 19:45:55','2026-08-29 19:01:47'),(5,'The Witcher 3: Wild Hunt','[\"PS4\"]','games/cqUNzvMOh7DU0L4RYDNToH2uoZlgSSRQAZ2T2c1f.webp','RPG fantasi legendaris dengan dunia luas yang penuh pilihan moral dan cerita sampingan berbobot','2026-08-29 19:00:07','2026-08-29 19:00:48'),(6,'Ghost of Tsushima','[\"PS4\"]','games/sxlwiqq1PSFGhAUr9PAsN8zh5xDQrmipQ9OkTgsv.webp','Game aksi petualangan samurai dengan latar Pulau Tsushima yang memiliki pemandangan visual paling memukau di PS4.','2026-08-29 19:02:45','2026-08-29 19:03:14'),(7,'Marvel’s Spider-Man','[\"PS4\"]','games/93aMeHgDV9Zr9pP3amhJv0BC5E3v9oi0YdKlzcX9.avif','Game pahlawan super dengan mekanik ayunan jaring yang sangat seru dan cerita ala komik yang menarik.','2026-08-29 19:04:17','2026-08-29 19:06:27'),(8,'EA Sports FC 25','[\"PS4\", \"PS5\"]','games/Zl3Z0xMjdNrrpvZXyYElYitpdPuBrzY63uDJOxoB.avif','Game penerus seri FIFA dengan grafis realistis, lisensi klub resmi, dan mode Ultimate Team yang ramai.','2026-08-29 19:06:17','2026-08-30 00:22:07'),(9,'eFootball','[\"PS4\"]','games/ziyVgQY3RErLRjoKmLIqN1arT2mIihrOW6wmudbg.png','Hadir dengan sistem free-to-play (gratis dimainkan) dan kontrol permainan yang tetap disukai komunitas pencinta PES lama.','2026-08-29 19:07:33','2026-08-30 00:23:26'),(10,'God of War Ragnarök','[\"PS5\"]','games/khW1LdaIAUB3BNF2WE90bveOL50TcGcHH1gVHR86.jpg','Petualangan epik mitologi Nordik dengan cerita emosional ayah-anak dan pertarungan sinematik yang luar biasa.','2026-08-29 23:18:29','2026-08-29 23:18:29'),(11,'Astro Bot','[\"PS5\"]','games/oeEzMUlIvvWt5mtY73CBS8IZxuPYnPmXuWIItBkj.avif','Game platformer seru yang memanfaatkan fitur unik pengendali DualSense secara maksimal.','2026-08-29 23:19:34','2026-08-29 23:19:34'),(12,'Grand Theft Auto V','[\"PS5\"]','games/JDElC8RtxRyPLznr4EiIKwEqauVju9J4kZ9Se3lJ.jpg','Versi PS5 hadir dengan peningkatan grafis memukau, waktu loading cepat, dan mode GTA Online yang terus diperbarui','2026-08-29 23:30:56','2026-08-29 23:30:56'),(13,'Helldivers 2','[\"PS5\"]','games/SVkzwNruIq416cjRCEELgHHfzdrfSBvbhdbFFCQo.png','Game tembak-tembakan kooperatif (co-op) luar angkasa yang sangat ramai dimainkan bersama teman.','2026-08-29 23:34:00','2026-08-29 23:34:00'),(14,'Death Stranding 2','[\"PS5\"]','games/BtrYRzglfkTgBjUZvghxZoAudocHZr4G7jHuMsNw.avif','Petualangan sinematik unik garapan Hideo Kojima dengan dunia yang luas dan misterius.','2026-08-29 23:54:45','2026-08-29 23:54:45'),(15,'Minecaft','[\"PC\"]','games/1okCCBZ8Nuz3pbFACrhLGfV5yv8MJKrexTxuitNf.jpg','Game balok pasir legendaris tempat pemain bebas membangun dunia, bertahan hidup, atau bermain bersama teman secara online.','2026-08-29 23:56:30','2026-08-29 23:56:30'),(16,'Fortnite','[\"PC\"]','games/KfYWcmspYE7I08qlNuM3JT2UJO9uOYfEd0Y1u3x8.jpg','Game battle royale gratis dengan elemen membangun dan grafis penuh warna yang punya jutaan pemain aktif.','2026-08-29 23:57:29','2026-08-29 23:57:29'),(17,'PUBG: Battlegrounds','[\"PC\"]','games/rpWZ5hPqRq7Lu0HiFGO0GbbS823QfdxHThHmCBjS.avif','Pelopor game battle royale modern di PC di mana 100 pemain bertarung menjadi yang terakhir bertahan.','2026-08-29 23:58:38','2026-08-29 23:58:38'),(18,'Valorant','[\"PC\"]','games/35IGqELe11KlloeXtsMuEYt17k8udbJMR68aCTyE.webp','Game penembak taktis pahlawan (hero shooter) buatan Riot Games yang menggabungkan kemampuan unik karakter dan tembakan presisi.','2026-08-29 23:59:38','2026-08-29 23:59:38'),(19,'Dota 2','[\"PC\"]','games/EiDK9jOJ4J9VbzSL8rCYkel5hEYySTmtL9tOgoqW.jpg','Game strategi arena pertempuran daring (MOBA) 5 lawan 5 yang menuntut kerja sama tim yang kuat','2026-08-30 00:00:40','2026-08-30 00:00:40'),(20,'Roblox','[\"PC\"]','games/GNms7WQcn46127zKu3b2od45jutnjaW0RcHjLTbi.png','Platform tempat pengguna bisa memainkan jutaan game buatan pemain lain secara gratis.','2026-08-31 05:11:57','2026-08-31 05:11:57');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalty_reward_catalogs`
--

DROP TABLE IF EXISTS `loyalty_reward_catalogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_reward_catalogs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `points_required` int unsigned NOT NULL,
  `reward_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` int unsigned NOT NULL DEFAULT '1',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gamepad',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_reward_catalogs`
--

LOCK TABLES `loyalty_reward_catalogs` WRITE;
/*!40000 ALTER TABLE `loyalty_reward_catalogs` DISABLE KEYS */;
INSERT INTO `loyalty_reward_catalogs` VALUES (1,'Gratis 1 Jam Bermain','Voucher gratis sewa station gaming selama 1 jam penuh. Berlaku untuk PC & PlayStation 5.',2000,'free_hour',1,'gamepad',1,'2026-10-12 11:41:38','2026-10-12 11:41:38'),(2,'Gratis 2 Jam Bermain','Voucher hemat istimewa! Dapatkan 2 jam bermain game sepuasnya tanpa biaya sewa station.',2500,'free_2_hours',2,'gamepad',1,'2026-10-12 11:41:38','2026-10-12 11:41:38'),(3,'Gratis Mie Goreng Spesial Kafe','Voucher gratis 1 porsi Mie Goreng Spesial lezat dari kafe Elysium Arena.',1500,'free_food',1,'utensils',1,'2026-10-12 11:41:38','2026-10-12 11:41:38'),(4,'Gratis Minuman Segar Kafe','Voucher gratis 1 minuman dingin atau kopi pilihan dari kafe Elysium Arena.',1000,'free_food',1,'coffee',1,'2026-10-12 11:41:38','2026-10-12 11:41:38');
/*!40000 ALTER TABLE `loyalty_reward_catalogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalty_rewards`
--

DROP TABLE IF EXISTS `loyalty_rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_rewards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `milestone` int unsigned DEFAULT '0',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catalog_id` bigint unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending_choice',
  `redeemed_booking_id` bigint unsigned DEFAULT NULL,
  `redeemed_order_id` bigint unsigned DEFAULT NULL,
  `redeemed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loyalty_rewards_user_id_foreign` (`user_id`),
  KEY `loyalty_rewards_redeemed_booking_id_foreign` (`redeemed_booking_id`),
  KEY `loyalty_rewards_redeemed_order_id_foreign` (`redeemed_order_id`),
  KEY `loyalty_rewards_catalog_id_foreign` (`catalog_id`),
  CONSTRAINT `loyalty_rewards_catalog_id_foreign` FOREIGN KEY (`catalog_id`) REFERENCES `loyalty_reward_catalogs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `loyalty_rewards_redeemed_booking_id_foreign` FOREIGN KEY (`redeemed_booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `loyalty_rewards_redeemed_order_id_foreign` FOREIGN KEY (`redeemed_order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `loyalty_rewards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_rewards`
--

LOCK TABLES `loyalty_rewards` WRITE;
/*!40000 ALTER TABLE `loyalty_rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `loyalty_rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalty_transactions`
--

DROP TABLE IF EXISTS `loyalty_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loyalty_transactions_user_id_created_at_index` (`user_id`,`created_at`),
  CONSTRAINT `loyalty_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_transactions`
--

LOCK TABLES `loyalty_transactions` WRITE;
/*!40000 ALTER TABLE `loyalty_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `loyalty_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `device_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ongoing','done') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ongoing',
  `started_at` datetime NOT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_device_id_foreign` (`device_id`),
  KEY `maintenance_user_id_foreign` (`user_id`),
  CONSTRAINT `maintenance_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000001_create_cache_table',1),(2,'0001_01_01_000002_create_jobs_table',1),(3,'2026_08_22_034500_create_roles_table',1),(4,'2026_08_22_034645_create_users_table',1),(5,'2026_08_22_034703_create_device_types_table',1),(6,'2026_08_22_034715_create_devices_table',1),(7,'2026_08_22_034724_create_games_table',1),(8,'2026_08_22_034733_create_device_games_table',1),(9,'2026_08_22_034745_create_categories_table',1),(10,'2026_08_22_034759_create_products_table',1),(11,'2026_08_22_034809_create_bookings_table',1),(12,'2026_08_22_034819_create_sessions_table',1),(13,'2026_08_22_034915_create_transactions_table',1),(14,'2026_08_22_034926_create_orders_table',1),(15,'2026_08_22_034936_create_order_items_table',1),(16,'2026_08_22_034944_create_payments_table',1),(17,'2026_08_22_034953_create_inventory_logs_table',1),(18,'2026_08_22_035002_create_maintenance_table',1),(19,'2026_08_22_035011_create_notifications_table',1),(20,'2026_08_22_042240_create_personal_access_tokens_table',1),(21,'2026_08_30_054732_add_archived_at_to_transactions_table',2),(22,'2026_08_30_063438_convert_platform_to_platforms_json_in_games_table',3),(23,'2026_09_09_083922_create_device_ratings_table',4),(24,'2026_09_19_175150_create_feedbacks_table',5),(25,'2026_09_25_135052_create_loyalty_rewards_table',6),(26,'2026_09_25_135146_add_is_reward_item_to_products_table',6),(27,'2026_09_30_182614_add_client_token_to_devices_table',7),(28,'2026_10_01_125507_add_is_active_to_users_table',8),(29,'2026_10_02_190049_restructure_device_ratings_to_per_account',9),(30,'2026_10_03_185913_add_hidden_at_to_transactions_table',10),(31,'2026_10_12_100001_add_loyalty_points_to_users_table',11),(32,'2026_10_12_100002_create_loyalty_transactions_table',11),(33,'2026_10_12_100003_create_loyalty_reward_catalogs_table',11),(34,'2026_10_12_100004_update_loyalty_rewards_table',11),(35,'2026_10_13_180001_drop_inventory_logs_table',12),(36,'2026_10_13_190001_add_guest_support_to_sessions_and_transactions_table',13),(37,'2026_10_14_140001_add_customer_hidden_at_to_transactions_table',14),(38,'2026_10_22_181412_create_password_reset_tokens_table',15),(39,'2026_10_27_000001_add_google_id_to_users_table',16);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int unsigned NOT NULL,
  `price` int unsigned NOT NULL,
  `subtotal` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `session_id` bigint unsigned DEFAULT NULL,
  `transaction_id` bigint unsigned DEFAULT NULL,
  `status` enum('pending','processing','ready','delivered','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `total_price` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_session_id_foreign` (`session_id`),
  KEY `orders_transaction_id_foreign` (`transaction_id`),
  CONSTRAINT `orders_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint unsigned NOT NULL,
  `method` enum('cash','qris','transfer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int unsigned NOT NULL,
  `status` enum('pending','paid','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_transaction_id_foreign` (`transaction_id`),
  CONSTRAINT `payments_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',1,'auth_token','6ab14b666dc380489ace207fe708c6a5bfca9866787e8e05a3a7d16f81f90c54','[\"*\"]','2026-08-21 22:51:02',NULL,'2026-08-21 22:32:37','2026-08-21 22:51:02'),(2,'App\\Models\\User',1,'auth_token','ceb335bb8ee038e10bc5dc9be6e2a3c31b9d23a443b0bc3ab6275f332a893a28','[\"*\"]','2026-08-22 02:56:36',NULL,'2026-08-22 01:39:37','2026-08-22 02:56:36'),(3,'App\\Models\\User',1,'auth_token','e01fa8f5ea3fe0a205476d96e4022f35023e8070437f811336884e50ef372eec','[\"*\"]','2026-08-22 02:43:10',NULL,'2026-08-22 02:33:01','2026-08-22 02:43:10'),(28,'App\\Models\\User',5,'auth_token','bcd89f2a2b4fb52ecc399f0524bbea9279f3543e3a83fd526a4b1895d79d4d1c','[\"*\"]','2026-09-14 00:59:18',NULL,'2026-09-14 00:59:02','2026-09-14 00:59:18'),(58,'App\\Models\\User',2,'auth_token','2d71a6048451030e69c02b4eee743cf83dd8cc933eb2e9e70f2f939650755fee','[\"*\"]','2026-09-24 00:54:49',NULL,'2026-09-24 00:21:12','2026-09-24 00:54:49'),(63,'App\\Models\\User',2,'auth_token','1b71418db4440f5c50428dd111b7376cb3a4048802b6444e368f3c88fe26e494','[\"*\"]','2026-09-24 07:32:52',NULL,'2026-09-24 06:31:58','2026-09-24 07:32:52'),(70,'App\\Models\\User',2,'auth_token','b3d6b38a79fc1d9c08617f05073df5a895dfc09835a620363f0b89cd62a03226','[\"*\"]','2026-09-30 12:12:16',NULL,'2026-09-30 11:38:21','2026-09-30 12:12:16'),(75,'App\\Models\\User',1,'auth_token','46781c1a1b8ef8de3d324cfe6a381eb99c8918dd699e661dfd931ac5923c181c','[\"*\"]','2026-10-01 07:15:27',NULL,'2026-10-01 05:44:05','2026-10-01 07:15:27'),(78,'App\\Models\\User',2,'auth_token','b82a66260821663aee30efef7bc5596977ac8e39646147725f723b132c9916d3','[\"*\"]','2026-10-03 11:24:53',NULL,'2026-10-03 11:24:12','2026-10-03 11:24:53'),(79,'App\\Models\\User',2,'auth_token','5bce8220be6a1fb1d5ab7331e2b730e747c430b3664659d7b923fc3e1968d58b','[\"*\"]','2026-10-03 11:30:38',NULL,'2026-10-03 11:30:36','2026-10-03 11:30:38'),(102,'App\\Models\\User',2,'auth_token','afce2f3a17f8672eb250ff4c79153ca52f8a868201c917bb22962f4a353ad9bd','[\"*\"]','2026-10-22 07:33:22',NULL,'2026-10-22 06:40:47','2026-10-22 07:33:22'),(103,'App\\Models\\User',4,'auth_token','492f432ddde9220e5d8da7172ba6f467dc0c7ad6d5cd2d740061bc5741c5ea34','[\"*\"]',NULL,NULL,'2026-10-22 11:34:03','2026-10-22 11:34:03'),(113,'App\\Models\\User',2,'auth_token','e6472b8f05a7d3affba23b65e6583e23c45bea6bd66d694b0ec5ac9bafa61564','[\"*\"]','2026-10-24 07:22:25',NULL,'2026-10-24 05:49:23','2026-10-24 07:22:25'),(117,'App\\Models\\User',1,'auth_token','adbb9aa1f8852109d88d5af9a44ac3d71817373e903752f140a0a6d92ace4634','[\"*\"]','2026-10-26 06:26:07',NULL,'2026-10-26 06:25:32','2026-10-26 06:26:07'),(118,'App\\Models\\User',4,'auth_token','94787ebe48abb361ca4ed52c2dcc4d2dbb155a782793b7acac26c21d4769e018','[\"*\"]',NULL,NULL,'2026-10-27 01:17:54','2026-10-27 01:17:54'),(119,'App\\Models\\User',8,'auth_token','feff61c54300b504cff8379ebc70240f01cc8a48f41933767cec87d84fe52cd9','[\"*\"]',NULL,NULL,'2026-10-27 01:22:56','2026-10-27 01:22:56'),(125,'App\\Models\\User',2,'auth_token','d2a8bf7106e0c68f2bbd2ab8b4fa9f7185f16dcf6d972000da6b4e1f08cfcd3d','[\"*\"]','2026-10-28 12:08:32',NULL,'2026-10-28 11:43:58','2026-10-28 12:08:32'),(126,'App\\Models\\User',1,'auth_token','4e77e623062aa3ee3fb6bc1b86f44c869952a14a4a5b6fe4d6ce716264803c6b','[\"*\"]','2026-10-29 06:49:23',NULL,'2026-10-29 05:41:25','2026-10-29 06:49:23');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int unsigned NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `minimum_stock` int unsigned NOT NULL DEFAULT '5',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_reward_item` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Mie Kuah Soto',7000,15,3,'products/UDK1MokCn3e0SJtKy82Vy0r9E1p6W7agol5alY5j.jpg',NULL,1,0,'2026-08-22 20:36:31','2026-08-31 05:23:51'),(2,1,'Mie Kuah Ayam Bawang',7000,15,5,'products/FiWfb6VdHbVNz3znMV6t22nfb5sybRURdereTpH7.jpg',NULL,1,0,'2026-08-22 20:40:09','2026-08-31 05:21:32'),(3,1,'Mie Goreng Ayam Bawang',7000,20,3,'products/cRvcjp7Jr2yvMBte0QW0g3Q7O44jWAtZ6UZ1qlom.avif',NULL,1,0,'2026-08-31 05:15:38','2026-08-31 05:15:38'),(4,1,'MIe Goreng Rendang',7000,18,3,'products/JlRE4y4SLnaX9irDcfwAisbYoFfaIC6w8iBVN0Ph.png',NULL,1,0,'2026-08-31 05:18:08','2026-10-24 05:46:11'),(5,1,'Mie Goreng Aceh',7000,18,5,'products/PqWpx14J1IfD64ygWSEeeTV6UMLj0Pw48nH9Uowe.png',NULL,1,0,'2026-08-31 05:19:52','2026-10-22 07:08:14'),(6,1,'Nasi Goreng',15000,10,2,'products/yr4cWqIxcohgtGinz9izeiFWBdcgSTnZA6GQg6ZG.jpg',NULL,1,0,'2026-08-31 05:24:39','2026-08-31 05:24:39'),(7,1,'Sosis Bakar',5000,14,3,'products/M3arNT15QPpkqarT2qEUBaylyNYLPrNpGJa39Irk.jpg',NULL,1,0,'2026-08-31 05:27:04','2026-09-24 00:38:54'),(8,2,'Es Teh',5000,19,5,'products/hrF1qXKNlXgWlMxo5B9GgmRng0SwYIyoTBmhBO3A.jpg',NULL,1,0,'2026-08-31 05:28:47','2026-10-28 12:06:43'),(9,2,'Le Minerale',5000,17,5,'products/M7xVQ9Upy7FiCpxzz0WtBGJlVg3uu8dNGYo2nxNS.avif',NULL,1,0,'2026-08-31 05:29:58','2026-10-24 05:46:11'),(10,4,'Kopi Good Day',5000,14,5,'products/CFD0zKRc0zb43Fqlhom6XZTVjR7gRmJM5JJI4qNQ.jpg',NULL,1,0,'2026-08-31 05:32:20','2026-09-18 12:22:37'),(11,4,'Kopi Hitam',5000,11,5,'products/igKv1i6Chg37Fgdc8iTkMpAtAtkAqDmD4UYsSc9i.png',NULL,1,0,'2026-08-31 05:33:39','2026-10-24 05:46:11'),(12,6,'Beng Beng',3000,12,2,'products/K6ACo5DJFXajoCQloW8rWjBcXqAUtqrwK9wdzTJ0.jpg',NULL,1,0,'2026-08-31 05:34:50','2026-08-31 05:34:50'),(13,6,'Pilus Garuda',2000,30,5,'products/saLe9n6UJYwzKJEa8eUvFIWcWZncza20rBemR5z9.jpg',NULL,1,0,'2026-08-31 05:36:11','2026-08-31 05:36:11');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'OWNER','2026-08-21 22:22:21','2026-08-21 22:22:21'),(2,'ADMIN','2026-08-21 22:22:21','2026-08-21 22:22:21'),(3,'STAFF_CAFE','2026-08-21 22:22:21','2026-08-21 22:22:21'),(4,'CUSTOMER','2026-08-21 22:22:21','2026-08-21 22:22:21');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `booking_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `guest_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_id` bigint unsigned NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `duration` int unsigned NOT NULL,
  `price` int unsigned NOT NULL,
  `status` enum('active','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_booking_id_foreign` (`booking_id`),
  KEY `sessions_user_id_foreign` (`user_id`),
  KEY `sessions_device_id_status_index` (`device_id`,`status`),
  CONSTRAINT `sessions_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sessions_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `transaction_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `guest_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_id` bigint unsigned DEFAULT NULL,
  `gaming_amount` int unsigned NOT NULL DEFAULT '0',
  `food_amount` int unsigned NOT NULL DEFAULT '0',
  `total_amount` int unsigned NOT NULL,
  `status` enum('pending','paid','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `archived_at` timestamp NULL DEFAULT NULL,
  `hidden_at` timestamp NULL DEFAULT NULL,
  `customer_hidden_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transactions_transaction_code_unique` (`transaction_code`),
  KEY `transactions_user_id_foreign` (`user_id`),
  KEY `transactions_session_id_foreign` (`session_id`),
  CONSTRAINT `transactions_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loyalty_points` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`),
  KEY `users_role_id_foreign` (`role_id`),
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'Owner Elysium Arena','elysiumarena1@gmail.com',NULL,'083869002070','avatars/TC8MJEpWPKS8miV3UFjOMstQzQgSDDYix2V4BgCe.jpg',450,1,NULL,'$2y$12$33QC6r8oOSFbPS4R9Ale4ORVBOfeIeW3wMOC5FguTE9p4fNSvfsDq',NULL,'2026-08-21 22:22:21','2026-10-22 12:03:33'),(2,2,'Admin Elysium Arena','haffidinwilly@gmail.com',NULL,'081234567891',NULL,975,1,NULL,'$2y$12$jsHa.P5mHmAwwA0fj.GErOPYQmnzlh/CPMRBC8.KnFNJ4VVCWuFJa',NULL,'2026-08-21 22:22:21','2026-10-22 12:05:06'),(3,3,'Staff Cafe Elysium Arena','elysiumcafe@gmail.com',NULL,'081234567892',NULL,0,1,NULL,'$2y$12$LUipkySbzJpIadt/6eHgjuaP0cQ08.YMeKEXMVXd.fl4gRLS4ZyCG',NULL,'2026-08-21 22:22:22','2026-10-22 12:05:59'),(4,4,'Bagas Nurhadi','bagasnurhadi17@gmail.com','108903571472788941799','083869002070','avatars/OzrZzHipGkYePPXmUPWuyHmso66awQCJGZo611ce.jpg',12,1,NULL,'$2y$12$6kEbDOjsa5ggfIR9AgRMsOlgoP2XtoqnY/tGM6HqvGvkciPfc5wSC',NULL,'2026-09-02 23:44:34','2026-10-28 11:45:50'),(6,4,'Damarr','damargonzales67@gmail.com',NULL,'083869002111','avatars/LKSO2obw9UUnfnfbn9Xa9ZZV3TwPcUNvbVWSHZI6.jpg',200,1,NULL,'$2y$12$OTsCxS7tOAURiZMs4FRDG.DvnDwZkv0grEtZW7LXH7DhT3BT7VBhu',NULL,'2026-09-14 06:45:09','2026-10-12 11:45:56'),(7,4,'Sandi Setiawan','sandisetiawan009@gmail.com',NULL,'089782651516',NULL,200,1,NULL,'$2y$12$kXgMLGi3wrRXDnSbh11Tw.noBvEeYu7FzoWk2D57Zc9IgboYCT4gC',NULL,'2026-09-16 20:15:10','2026-10-22 07:13:52'),(8,4,'Indonesia 876','i3768515@gmail.com','112467507679538127945',NULL,'https://lh3.googleusercontent.com/a/ACg8ocKsRFoCFwXeHCz_uhXUstw04QZzdV9a-vB8BlhRvT4DlWC3RA=s96-c',0,1,NULL,NULL,NULL,'2026-10-27 01:22:56','2026-10-27 01:22:56');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-29 13:49:24
