-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE `nethelper`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `mail` VARCHAR(45) NOT NULL,
  `nickName` VARCHAR(45) NOT NULL,
  `avatar` TEXT NULL,
  `introduce` TEXT NULL,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `login` (`username` ASC, `password` ASC) VISIBLE
);


-- ----------------------------
-- Table structure for ticket
-- ----------------------------
CREATE TABLE `nethelper`.`ticket` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `from` VARCHAR(45) NOT NULL,
  `toID` INT NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  `createTime` BIGINT(20) NULL DEFAULT 1597618819100,
  `updateTime` BIGINT(20) NULL DEFAULT 1597618819100,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `from` (`from` ASC) VISIBLE,
  INDEX `toID` (`toID` ASC) VISIBLE);


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
  INDEX `ticketID` (`ticketID` ASC) VISIBLE);


-- ----------------------------
-- Records of base
-- ----------------------------
BEGIN;
INSERT INTO `nethelper`.`user` VALUES (1, 'admin', 'root','bugyaluwang@qq.com','源心锁', 'https://s.gravatar.com/avatar/d8065bea49aa2877ce13686772727711?s=80', 'Hello World', 1582595976253, 1582595976253);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;