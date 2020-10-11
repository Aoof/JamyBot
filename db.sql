-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: royalbutlerbot
-- ------------------------------------------------------
-- Server version	8.0.20

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
-- Table structure for table `tcommands`
--

DROP TABLE IF EXISTS `tcommands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tcommands` (
  `command_id` int NOT NULL AUTO_INCREMENT,
  `command` varchar(50) NOT NULL,
  `reply` varchar(300) NOT NULL,
  PRIMARY KEY (`command_id`),
  UNIQUE KEY `command_UNIQUE` (`command`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tcommands`
--

LOCK TABLES `tcommands` WRITE;
/*!40000 ALTER TABLE `tcommands` DISABLE KEYS */;
/*!40000 ALTER TABLE `tcommands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userdata`
--

DROP TABLE IF EXISTS `userdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userdata` (
  `userdataid` int NOT NULL AUTO_INCREMENT,
  `goldcrowns` int DEFAULT '0',
  `platcrowns` int DEFAULT '0',
  `points` int DEFAULT '0',
  `userid` varchar(50) NOT NULL,
  PRIMARY KEY (`userdataid`,`userid`),
  KEY `userid` (`userid`),
  CONSTRAINT `userdata_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userdata`
--

LOCK TABLES `userdata` WRITE;
/*!40000 ALTER TABLE `userdata` DISABLE KEYS */;
INSERT INTO `userdata` VALUES (6,1,0,2500,'200460509'),(7,1,0,2500,'213706333'),(8,2,0,5000,'593911415'),(9,0,0,0,'61846554'),(10,0,0,0,'530875172'),(11,0,0,0,'184358349'),(12,0,0,0,'588969079'),(13,0,0,0,'149482725'),(14,3,0,7500,'102955824'),(15,0,0,0,'548554311'),(16,0,0,0,'563338152'),(17,0,0,0,'165867613'),(18,0,0,0,'423866064'),(19,0,0,0,'568945878'),(20,0,0,0,'585182932'),(21,0,2,25000,'450880092'),(22,0,0,0,'253094956'),(23,0,0,0,'96621085'),(24,0,0,0,'79221081'),(25,0,0,0,'161275835'),(26,1,0,2500,'142766312'),(27,0,0,0,'501679795'),(28,0,0,0,'437334348'),(29,1,0,2500,'100173513'),(30,1,0,2500,'543522407'),(31,0,0,0,'24544309'),(32,0,0,0,'205452582'),(33,0,0,0,'534952315'),(34,0,0,0,'545261034'),(35,0,0,0,'247518476'),(36,0,0,0,'79932828'),(37,0,0,0,'540300086'),(38,1,0,2500,'486338618'),(39,0,0,0,'103317993'),(40,0,0,0,'132846831'),(41,0,0,0,'460907769'),(42,0,0,0,'163040449'),(43,0,0,0,'594561702'),(44,0,0,0,'466374671'),(45,0,0,0,'551532471'),(46,0,0,0,'94694398'),(47,0,0,0,'135106728'),(48,0,0,0,'271441919'),(49,0,0,0,'475510479'),(50,0,0,0,'581551757'),(51,0,0,0,'548145707'),(52,0,0,0,'192026929'),(53,0,0,0,'88741442'),(54,0,0,0,'236276236'),(55,0,0,0,'563650336'),(56,0,0,0,'583437542'),(57,0,0,0,'201313088'),(58,0,0,0,'565188243'),(59,0,0,0,'574152727'),(60,0,0,0,'212603318'),(61,0,0,0,'552292486'),(62,0,0,0,'549576826'),(63,0,0,0,'485422859'),(64,0,0,0,'544737782'),(65,0,0,0,'568435914'),(66,0,0,0,'115396070'),(67,0,0,0,'186921429'),(68,0,0,0,'526482150');
/*!40000 ALTER TABLE `userdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `badgesraw` varchar(50) DEFAULT NULL,
  `room_id` varchar(50) DEFAULT NULL,
  `moderator` tinyint(1) DEFAULT NULL,
  `subscriber` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('100173513','gkaisauce','premium/1','24544309',0,0),('102955824','ocerebirth',NULL,'24544309',0,0),('103317993','skiddoo','founder/0','24544309',0,0),('115396070','daddyofdaddies',NULL,'24544309',0,0),('132846831','knackerbags','premium/1','24544309',0,0),('135106728','verywaterymelon','premium/1','24544309',0,0),('142766312','wittywonk',NULL,'24544309',0,0),('149482725','sm0lcats',NULL,'24544309',0,0),('161275835','thewolfygt',NULL,'24544309',0,0),('163040449','hamoose135','premium/1','24544309',0,0),('165867613','borb20',NULL,'24544309',0,0),('184358349','dezlain_',NULL,'24544309',0,0),('186921429','thefrenchnarrator','premium/1','24544309',0,0),('192026929','janaaaaaaaaaaaaaaaaaaaa','bits/1','24544309',0,0),('200460509','4oofxd','subscriber/0','24544309',0,1),('201313088','kishiioo','moderator/1,founder/0,premium/1','24544309',1,0),('205452582','bapity69',NULL,'24544309',0,0),('212603318','xaver2225',NULL,'24544309',0,0),('213706333','toaster1542',NULL,'24544309',0,0),('236276236','benhart668','bits-charity/1','24544309',0,0),('24544309','jamystro','broadcaster/1,subscriber/3,sub-gifter/1','24544309',0,1),('247518476','chowchuen',NULL,'24544309',0,0),('253094956','v2ik3',NULL,'24544309',0,0),('271441919','xxfiammettaxx','premium/1','24544309',0,0),('423866064','droid69420',NULL,'24544309',0,0),('437334348','asashi_tan',NULL,'24544309',0,0),('450880092','mamamoon2019',NULL,'24544309',0,0),('460907769','heathwilson32','premium/1','24544309',0,0),('466374671','the_offishal_bot','premium/1','24544309',0,0),('475510479','natsu3913','subscriber/0,premium/1','24544309',0,1),('485422859','huukunosu',NULL,'24544309',0,0),('486338618','badshruod',NULL,'24544309',0,0),('501679795','farelesssquare','premium/1','24544309',0,0),('526482150','eddy584',NULL,'24544309',0,0),('530875172','majorgamertwitch','glhf-pledge/1','24544309',0,0),('534952315','bakazi69',NULL,'24544309',0,0),('540300086','shinikii_',NULL,'24544309',0,0),('543522407','zotemilk_mcqueen',NULL,'24544309',0,0),('544737782','ysbee','moderator/1,founder/0,sub-gift-leader/1','24544309',1,0),('545261034','ervin078',NULL,'24544309',0,0),('548145707','lamintys',NULL,'24544309',0,0),('548554311','danial420_',NULL,'24544309',0,0),('549576826','sigmagamingsbu',NULL,'24544309',0,0),('551532471','montypythonantheholygrail',NULL,'24544309',0,0),('552292486','13rnh',NULL,'24544309',0,0),('563338152','mooniekai03',NULL,'24544309',0,0),('563650336','randyburans4',NULL,'24544309',0,0),('565188243','investedcrybaby',NULL,'24544309',0,0),('568435914','egirlwafiu',NULL,'24544309',0,0),('568945878','oraclevt','subscriber/0','24544309',0,1),('574152727','dufufsisalwaystaken',NULL,'24544309',0,0),('581551757','ttvstonk',NULL,'24544309',0,0),('583437542','public_butter',NULL,'24544309',0,0),('585182932','matthew_hendo11',NULL,'24544309',0,0),('588969079','snuuzu','subscriber/0,premium/1','24544309',0,1),('593911415','royalbutler','moderator/1','24544309',1,0),('594561702','carlosblaine6000',NULL,'24544309',0,0),('61846554','tyablix','subscriber/2,bits-leader/1','24544309',0,1),('79221081','damnkid','subscriber/2,bits/100','24544309',0,1),('79932828','marcus_xxx',NULL,'24544309',0,0),('88741442','avantgob','subscriber/0,premium/1','24544309',0,1),('94694398','gentlb0y',NULL,'24544309',0,0),('96621085','thickup','vip/1,founder/0,premium/1','24544309',0,0);
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

-- Dump completed on 2020-10-11 17:38:10
