-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE `nethelper`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` INT NOT NULL DEFAULT 0,  -- 0:普通用户 1:管理员 2:超级管理员 -1 禁用
  `username` VARCHAR(45) NOT NULL,
  `mail` VARCHAR(45) NOT NULL,
  `nickName` VARCHAR(45) NOT NULL,
  `avatar` TEXT NULL,
  `introduce` TEXT NULL,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `mail_UNIQUE` (`mail` ASC) VISIBLE
);


-- ----------------------------
-- Table structure for mail_verify_code
-- ----------------------------
CREATE TABLE `nethelper`.`mail_verify_code` (
  `mail` VARCHAR(45) NOT NULL,
  `code` VARCHAR(8) NULL,
  `count` INT NULL DEFAULT 3,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  PRIMARY KEY (`mail`),
  UNIQUE INDEX `id_UNIQUE` (`mail` ASC) VISIBLE
);


-- ----------------------------
-- Table structure for ticket
-- ----------------------------
CREATE TABLE `nethelper`.`ticket` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `from` VARCHAR(45) NOT NULL,
  `to` VARCHAR(45) NOT NULL,
  `type` VARCHAR(45) NOT NULL, 
  `title` VARCHAR(45) NOT NULL,
  `status` INT NOT NULL DEFAULT 0, -- 0: open 1: close 2: delete
  `rate` INT NULL DEFAULT -1, -- -1,0~100
  `read` INT(1) NOT NULL DEFAULT 0,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `from` (`from` ASC) VISIBLE,
  INDEX `to` (`to` ASC) VISIBLE
);

-- ----------------------------
-- Table structure for ticket_content
-- ----------------------------
CREATE TABLE `nethelper`.`ticket_content` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ticketID` INT NOT NULL,
  `content` TEXT NULL,
  `type` INT NULL DEFAULT 0,
  `status` INT NULL DEFAULT 0,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `ticketID` (`ticketID` ASC) VISIBLE
);


-- ----------------------------
-- Records of base
-- ----------------------------
BEGIN;
INSERT INTO `nethelper`.`user` VALUES (1, 0, 'bugyaluwang@qq.com','bugyaluwang@qq.com','bugyaluwang@qq.com', 'https://s.gravatar.com/avatar/d8065bea49aa2877ce13686772727711?s=80', 'Hello World', 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`user` VALUES (2, 1, '源心锁','774933704@qq.com','774933704@qq.com', 'https://s.gravatar.com/avatar/d8065bea49aa2877ce13686772727711?s=80', 'Hello World', 1675082983269, 1675082983269);

INSERT INTO `nethelper`.`ticket` VALUES (1, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联1', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (2, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联2', 2, -1,1, 1575082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (3, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联3', 0, -1,2, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (4, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联4', 0, -1,3, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (5, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联5', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (6, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联6', 1, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (7, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联7', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (8, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联8', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (9, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联9', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (10, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联10', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (11, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联11', 0, -1,0, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (12, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联12', 2, -1,1, 1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (13, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联13', 0, -1,2, 1675082983269, 1675082983269); 
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;