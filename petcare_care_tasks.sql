-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: petcare
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `care_tasks`
--

DROP TABLE IF EXISTS `care_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `care_tasks` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `pet_id` int NOT NULL,
  `task_type` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `scheduled_time` varchar(255) DEFAULT NULL,
  `completed` varchar(255) DEFAULT NULL,
  `completed_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`task_id`),
  KEY `pet_id` (`pet_id`),
  CONSTRAINT `care_tasks_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`pet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `care_tasks`
--

LOCK TABLES `care_tasks` WRITE;
/*!40000 ALTER TABLE `care_tasks` DISABLE KEYS */;
INSERT INTO `care_tasks` VALUES (1,1,'Dog walking','Taking dogs for exercise','one hour','yes','58 min'),(2,2,'Supervise the cat','Clean enclosure','two hour','no','began 28 mins ago'),(3,3,'Grooming Service',' directly at the owner home.','two hour','yes','Three hours'),(4,4,'Administering medications','Offering insurance veterinary plans','12 hours','yes','Three days'),(5,5,'Training','Offering obedience','60 hours','no','2 weeks'),(6,6,'Pet Uber','Transportation service','60 mins','no','no'),(7,7,'Training','Offering obedience','60 hours','no','1 week');
/*!40000 ALTER TABLE `care_tasks` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-23 14:57:44
