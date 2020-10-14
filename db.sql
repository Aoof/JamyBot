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
  UNIQUE KEY `userid_UNIQUE` (`userid`),
  CONSTRAINT `userdata_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userdata`
--

LOCK TABLES `userdata` WRITE;
/*!40000 ALTER TABLE `userdata` DISABLE KEYS */;
INSERT INTO `userdata` VALUES (6,2,0,14918,'200460509'),(7,1,0,14013,'213706333'),(8,2,0,5000,'593911415'),(9,0,0,40599,'61846554'),(10,0,0,0,'530875172'),(11,0,0,0,'184358349'),(12,0,0,5040,'588969079'),(13,0,0,0,'149482725'),(14,3,0,7500,'102955824'),(15,0,0,0,'548554311'),(16,0,0,0,'563338152'),(17,0,0,0,'165867613'),(18,0,0,0,'423866064'),(19,0,0,14399,'568945878'),(20,0,0,0,'585182932'),(21,0,2,25000,'450880092'),(22,0,0,0,'253094956'),(23,0,0,25278,'96621085'),(24,0,0,0,'79221081'),(25,0,0,0,'161275835'),(26,1,0,2500,'142766312'),(27,0,0,26860,'501679795'),(28,0,0,0,'437334348'),(29,1,0,2500,'100173513'),(30,1,0,2500,'543522407'),(31,69,420,0,'24544309'),(32,0,0,0,'205452582'),(33,0,0,0,'534952315'),(34,0,0,0,'545261034'),(35,0,0,0,'247518476'),(36,0,0,0,'79932828'),(37,0,0,0,'540300086'),(38,1,0,2500,'486338618'),(39,0,0,18980,'103317993'),(40,0,0,0,'132846831'),(41,0,0,0,'460907769'),(42,0,0,0,'163040449'),(43,0,0,0,'594561702'),(44,0,0,0,'466374671'),(45,0,0,0,'551532471'),(46,0,0,0,'94694398'),(47,0,0,0,'135106728'),(48,0,0,0,'271441919'),(49,0,0,0,'475510479'),(50,0,0,0,'581551757'),(51,0,0,0,'548145707'),(52,0,0,0,'192026929'),(53,0,0,11580,'88741442'),(54,0,0,0,'236276236'),(55,0,0,0,'563650336'),(56,0,0,0,'583437542'),(57,0,0,12640,'201313088'),(58,0,0,0,'565188243'),(59,0,0,0,'574152727'),(60,0,0,9180,'212603318'),(61,0,0,0,'552292486'),(62,0,0,0,'549576826'),(63,0,0,0,'485422859'),(64,0,0,101208,'544737782'),(65,0,0,0,'568435914'),(66,0,0,12478,'115396070'),(67,0,0,0,'186921429'),(68,0,0,0,'526482150'),(69,0,0,0,'593685503'),(70,0,0,0,'100135110'),(71,0,0,0,'90119761'),(72,0,0,0,'579891022'),(73,0,0,0,'278654335'),(74,0,0,0,'439725969'),(75,0,0,0,'557599417'),(76,0,0,0,'38322079'),(77,0,0,0,'114255972'),(78,0,0,0,'521982987'),(79,0,0,0,'498127502'),(80,0,0,0,'89202342'),(81,0,0,0,'572933969'),(82,0,0,0,'138389212'),(83,0,0,0,'422254678'),(84,0,0,0,'76046362'),(85,0,0,0,'423704655'),(86,0,0,0,'586708741'),(87,0,0,0,'425636557'),(88,0,0,0,'155528106'),(89,0,0,0,'513925796'),(90,0,0,0,'233701625'),(91,0,0,0,'216725829'),(92,0,0,0,'98360359'),(93,0,0,0,'491433823'),(94,0,0,0,'423661441'),(95,0,0,0,'136294967'),(96,0,0,0,'469984450'),(97,0,0,0,'434296232'),(98,0,0,0,'507234744'),(99,0,0,0,'591131980'),(100,0,0,0,'465231686'),(101,0,0,0,'92829348'),(102,0,0,0,'519310038'),(103,0,0,0,'276263000'),(104,0,0,0,'430214396');
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
  `displayname` varchar(50) DEFAULT NULL,
  `badgesraw` varchar(50) DEFAULT NULL,
  `room_id` varchar(50) DEFAULT NULL,
  `moderator` tinyint(1) DEFAULT NULL,
  `subscriber` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `displayname_UNIQUE` (`displayname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('100135110','streamelements','StreamElements','moderator/1,partner/1','24544309',1,0),('100173513','gkaisauce',NULL,'premium/1','24544309',0,0),('102955824','ocerebirth','OCERebirth',NULL,'24544309',0,0),('103317993','skiddoo',NULL,'founder/0','24544309',0,0),('114255972','unmxxn','unmxxn',NULL,'24544309',0,0),('115396070','daddyofdaddies',NULL,NULL,'24544309',0,0),('132846831','knackerbags',NULL,'premium/1','24544309',0,0),('135106728','verywaterymelon',NULL,'premium/1','24544309',0,0),('136294967','zerozevenzero','ZeroZevenZero','bits-charity/1','24544309',0,0),('138389212','kyllero','Kyllero','vip/1','24544309',0,0),('142766312','wittywonk',NULL,NULL,'24544309',0,0),('149482725','sm0lcats',NULL,NULL,'24544309',0,0),('155528106','alderthewolf','AlderTheWolf',NULL,'24544309',0,0),('161275835','thewolfygt',NULL,NULL,'24544309',0,0),('163040449','hamoose135',NULL,'premium/1','24544309',0,0),('165867613','borb20',NULL,NULL,'24544309',0,0),('184358349','dezlain_',NULL,NULL,'24544309',0,0),('186921429','thefrenchnarrator',NULL,'premium/1','24544309',0,0),('192026929','janaaaaaaaaaaaaaaaaaaaa',NULL,'bits/1','24544309',0,0),('200460509','4oofxd','4oofxd','subscriber/0','24544309',0,1),('201313088','kishiioo',NULL,'moderator/1,founder/0,premium/1','24544309',1,0),('205452582','bapity69',NULL,NULL,'24544309',0,0),('212603318','xaver2225',NULL,NULL,'24544309',0,0),('213706333','toaster1542','toaster1542',NULL,'24544309',0,0),('216725829','darkstarowo','DarkstarOwO',NULL,'24544309',0,0),('233701625','ekuboo23','ekuboo23',NULL,'24544309',0,0),('236276236','benhart668',NULL,'bits-charity/1','24544309',0,0),('24544309','jamystro','Jamystro','broadcaster/1,subscriber/3,sub-gifter/1','24544309',0,1),('247518476','chowchuen',NULL,NULL,'24544309',0,0),('253094956','v2ik3',NULL,NULL,'24544309',0,0),('271441919','xxfiammettaxx',NULL,'premium/1','24544309',0,0),('276263000','memelord1378','memelord1378',NULL,'24544309',0,0),('278654335','giri__','giri__',NULL,'24544309',0,0),('38322079','herqqless','herQQless','premium/1','24544309',0,0),('422254678','sennateauwu','SennaTeaUwU','glhf-pledge/1','24544309',0,0),('423661441','snrix2410','snrix2410',NULL,'24544309',0,0),('423704655','chessergamer','ChesserGamer','glhf-pledge/1','24544309',0,0),('423866064','droid69420',NULL,NULL,'24544309',0,0),('425636557','montyjr_','MontyJR_','premium/1','24544309',0,0),('430214396','dtuxu','dtuxu',NULL,'24544309',0,0),('434296232','brokaeu','brokaeu',NULL,'24544309',0,0),('437334348','asashi_tan',NULL,NULL,'24544309',0,0),('439725969','n0wayj0s3','N0WayJ0s3',NULL,'24544309',0,0),('450880092','mamamoon2019',NULL,NULL,'24544309',0,0),('460907769','heathwilson32',NULL,'premium/1','24544309',0,0),('465231686','lordvalks','lordvalks','glhf-pledge/1','24544309',0,0),('466374671','the_offishal_bot',NULL,'premium/1','24544309',0,0),('469984450','meszii_','Meszii_',NULL,'24544309',0,0),('475510479','natsu3913',NULL,'subscriber/0,premium/1','24544309',0,1),('485422859','huukunosu',NULL,NULL,'24544309',0,0),('486338618','badshruod',NULL,NULL,'24544309',0,0),('491433823','alfie94','Alfie94',NULL,'24544309',0,0),('498127502','exo_tmp','EXO_TMP',NULL,'24544309',0,0),('501679795','farelesssquare',NULL,'premium/1','24544309',0,0),('507234744','t0ne_deaf_bard','T0ne_Deaf_Bard',NULL,'24544309',0,0),('513925796','syedayman','syedayman',NULL,'24544309',0,0),('519310038','dxvans','dxvans',NULL,'24544309',0,0),('521982987','atteullitv','atteullitv','glhf-pledge/1','24544309',0,0),('526482150','eddy584',NULL,NULL,'24544309',0,0),('530875172','majorgamertwitch',NULL,'glhf-pledge/1','24544309',0,0),('534952315','bakazi69',NULL,NULL,'24544309',0,0),('540300086','shinikii_',NULL,NULL,'24544309',0,0),('543522407','zotemilk_mcqueen',NULL,NULL,'24544309',0,0),('544737782','ysbee',NULL,'moderator/1,founder/0,sub-gift-leader/1','24544309',1,0),('545261034','ervin078',NULL,NULL,'24544309',0,0),('548145707','lamintys',NULL,NULL,'24544309',0,0),('548554311','danial420_',NULL,NULL,'24544309',0,0),('549576826','sigmagamingsbu',NULL,NULL,'24544309',0,0),('551532471','montypythonantheholygrail',NULL,NULL,'24544309',0,0),('552292486','13rnh',NULL,NULL,'24544309',0,0),('557599417','raz3dup','Raz3dup',NULL,'24544309',0,0),('563338152','mooniekai03',NULL,NULL,'24544309',0,0),('563650336','randyburans4',NULL,NULL,'24544309',0,0),('565188243','investedcrybaby',NULL,NULL,'24544309',0,0),('568435914','egirlwafiu',NULL,NULL,'24544309',0,0),('568945878','oraclevt',NULL,'subscriber/0','24544309',0,1),('572933969','dmitrieh','dmitrieh',NULL,'24544309',0,0),('574152727','dufufsisalwaystaken',NULL,NULL,'24544309',0,0),('579891022','vack1435','vack1435',NULL,'24544309',0,0),('581551757','ttvstonk',NULL,NULL,'24544309',0,0),('583437542','public_butter',NULL,NULL,'24544309',0,0),('585182932','matthew_hendo11',NULL,NULL,'24544309',0,0),('586708741','agenta223','agenta223',NULL,'24544309',0,0),('588969079','snuuzu',NULL,'subscriber/0,premium/1','24544309',0,1),('591131980','lightning13245','lightning13245',NULL,'24544309',0,0),('593685503','aoof_bot','aoof_bot',NULL,'200460509',0,0),('593911415','royalbutler',NULL,'moderator/1','24544309',1,0),('594561702','carlosblaine6000',NULL,NULL,'24544309',0,0),('61846554','tyablix',NULL,'subscriber/2,bits-leader/1','24544309',0,1),('76046362','visceroustv','ViscerousTV','premium/1','24544309',0,0),('79221081','damnkid',NULL,'subscriber/2,bits/100','24544309',0,1),('79932828','marcus_xxx',NULL,NULL,'24544309',0,0),('88741442','avantgob',NULL,'subscriber/0,premium/1','24544309',0,1),('89202342','gregeregeru','gregeregeru','subscriber/0','24544309',0,1),('90119761','floatgoat','Floatgoat',NULL,'24544309',0,0),('92829348','chocola_osu','Chocola_osu',NULL,'24544309',0,0),('94694398','gentlb0y',NULL,NULL,'24544309',0,0),('96621085','thickup',NULL,'vip/1,founder/0,premium/1','24544309',0,0),('98360359','princessramina','PrincessRamina',NULL,'24544309',0,0);
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

-- Dump completed on 2020-10-14 14:05:07
