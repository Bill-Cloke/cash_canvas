# React + Vite

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Cash Canvas 
A full-stack expense tracking app that combines Plaid synced bank transactions with manual cash entries.

## Env

Create a file called `.env` in the project root:

```ini

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_NAME=cashcanvas

PLAID_ENV=sandbox
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_PRODUCTS=auth,transactions,balance
PLAID_COUNTRY_CODES=US


```

## Sql 

cashcanvas schema:

```ini

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema cashcanvas
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cashcanvas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cashcanvas` DEFAULT CHARACTER SET utf8mb3 ;
USE `cashcanvas` ;

-- -----------------------------------------------------
-- Table `cashcanvas`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cashcanvas`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `access_phrase` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 34
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cashcanvas`.`bank_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cashcanvas`.`bank_accounts` (
  `account_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `access_token` VARCHAR(255) NULL DEFAULT NULL,
  `item_id` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `mask` INT NULL DEFAULT NULL,
  `type` VARCHAR(255) NULL DEFAULT NULL,
  `balance` DECIMAL(15,2) NULL DEFAULT NULL,
  `last_sync_cursor` TEXT NULL DEFAULT NULL,
  `last_sync_at` DATETIME NULL DEFAULT NULL,
  `p_account_id` VARCHAR(225) NULL DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `account_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `cashcanvas`.`users` (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 37
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cashcanvas`.`goals`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cashcanvas`.`goals` (
  `goal_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `category` VARCHAR(255) NULL DEFAULT NULL,
  `target` DECIMAL(15,2) NULL DEFAULT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `complete` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`goal_id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `goal_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `cashcanvas`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cashcanvas`.`transactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cashcanvas`.`transactions` (
  `tid` INT NOT NULL AUTO_INCREMENT,
  `account_id` INT NOT NULL,
  `plaid_tid` VARCHAR(255) NULL DEFAULT NULL,
  `date` DATE NULL DEFAULT NULL,
  `amount` DECIMAL(15,2) NOT NULL DEFAULT '0.00',
  `merchant` VARCHAR(255) NOT NULL DEFAULT 'NA',
  `category` VARCHAR(255) NOT NULL DEFAULT 'none',
  PRIMARY KEY (`tid`),
  UNIQUE INDEX `plaid_tid_UNIQUE` (`plaid_tid` ASC) VISIBLE,
  INDEX `account_id_idx` (`account_id` ASC) VISIBLE,
  CONSTRAINT `account_id`
    FOREIGN KEY (`account_id`)
    REFERENCES `cashcanvas`.`bank_accounts` (`account_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 146
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

```