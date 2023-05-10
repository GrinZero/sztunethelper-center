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
  `rate` INT NULL DEFAULT -1, -- -1,0~5
  `read` INT(1) NOT NULL DEFAULT 0,
  `contactType` INT NULL DEFAULT 0, -- 0: socket 1: mail 2: image 3: other
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
  `sender` VARCHAR(45) NOT NULL,
  `content` TEXT NULL,
  `type` INT NULL DEFAULT 0, -- 0: text 1: image 2: file
  `status` INT NULL DEFAULT 0,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `uploadID` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `ticketID` (`ticketID` ASC) VISIBLE
);


-- ----------------------------
-- Table structure for duty
-- ----------------------------
CREATE TABLE `nethelper`.`duty` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userID` INT NOT NULL,
  `contact` VARCHAR(45) NULL,
  `contactType` ENUM('socket', 'mail', 'image', 'other') NOT NULL DEFAULT 'socket',
  `onDutyTime` INT NULL,
  `createTime` BIGINT NOT NULL,
  `updateTime` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE
);

-- ----------------------------
-- Table structure for banner
-- ----------------------------
CREATE TABLE `nethelper`.`banner` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NULL,
  `url` VARCHAR(45) NULL,
  `img` VARCHAR(45) NOT NULL,
  `createTime` BIGINT NOT NULL,
  `updateTime` BIGINT NOT NULL,
  `overdueTime` BIGINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE
);

CREATE TABLE `nethelper`.`notice` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `title` VARCHAR(45) NULL,
  `createTime` BIGINT NOT NULL,
  `updateTime` BIGINT NOT NULL,
  `overdueTime` BIGINT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);



-- ----------------------------
-- Records of base
-- ----------------------------
BEGIN;
INSERT INTO `nethelper`.`user` VALUES (1, 0, 'bugyaluwang@qq.com','bugyaluwang@qq.com','bugyaluwang@qq.com', 'https://s.gravatar.com/avatar/d8065bea49aa2877ce13686772727711?s=80', 'Hello World', 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`user` VALUES (2, 1, '源心锁','774933704@qq.com','774933704@qq.com', 'https://s.gravatar.com/avatar/d8065bea49aa2877ce13686772727711?s=80', 'Hello World', 1675082983269, 1675082983269);

INSERT INTO `nethelper`.`ticket` VALUES (1, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联1', 0, -1,0,   0,1675082983269, 1675082983269); 
INSERT INTO `nethelper`.`ticket` VALUES (2, 'bugyaluwang@qq.com', '774933704@qq.com','网络问题','网络总是断联2', 2, -1,1,   3,1575082983269, 1675082983269); 


INSERT INTO `nethelper`.`duty` VALUES (1, 2, 'vx:bugyaluwang', 'socket', 0, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`duty` VALUES (2, 2, 'vx:bugyaluwang', 'socket', 1, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`duty` VALUES (3, 2, 'vx:bugyaluwang', 'socket', 2, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`duty` VALUES (4, 2, 'vx:bugyaluwang', 'socket', 3, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`duty` VALUES (5, 2, 'vx:bugyaluwang', 'socket', 4, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`duty` VALUES (6, 2, 'vx:bugyaluwang', 'socket', 5, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`duty` VALUES (7, 2, 'vx:bugyaluwang', 'socket', 6, 1675082983269, 1675082983269);

INSERT INTO `nethelper`.`banner` VALUES (1, 'banner1', 'https://www.baidu.com', 'https://www.baidu.com/img/bd_logo1.png', 1675082983269, 1675082983269, 1675082983269);
INSERT INTO `nethelper`.`banner` VALUES (2, 'banner2', 'https://www.baidu.com', 'https://www.baidu.com/img/bd_logo1.png', 1675082983269, 1675082983269, 1675082983269);

INSERT INTO `nethelper`.`notice` VALUES (1, 'notice1', 'notice1', 1675082983269, 1675082983269, 1675082983269);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;