-- Plat Platform Database Schema Setup
-- Target engine: MariaDB / MySQL 8.0+

CREATE DATABASE IF NOT EXISTS `plat_culinary_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `plat_culinary_db`;

-- 1. USERS SECURITY TABLE
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `subscription_tier` ENUM('Free', 'Pro', 'Enterprise') DEFAULT 'Free',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. RECIPES CABINET REGISTRY TABLE
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL, -- Null refers to baseline system/seeded recipes
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drinks') DEFAULT 'Dinner',
  `prep_time` VARCHAR(50) DEFAULT NULL,
  `cook_time` VARCHAR(50) DEFAULT NULL,
  `servings` VARCHAR(50) DEFAULT NULL,
  `difficulty` ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Easy',
  `image_url` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_recipes_user_cat` (`user_id`, `category`),
  INDEX `idx_recipes_search` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. RECIPE INGREDIENTS SUB-COMPLEX TABLE (One-to-Many relational granularity)
CREATE TABLE IF NOT EXISTS `recipe_ingredients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` INT NOT NULL,
  `ingredient_text` VARCHAR(255) NOT NULL,
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. RECIPE STEPS SUB-COMPLEX TABLE (One-to-Many relational granularity)
CREATE TABLE IF NOT EXISTS `recipe_steps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipe_id` INT NOT NULL,
  `step_text` TEXT NOT NULL,
  `step_number` INT NOT NULL,
  FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SUBSCRIPTION RECORD TRANSACTIONS LOGS
CREATE TABLE IF NOT EXISTS `subscriptions_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `tier` ENUM('Free', 'Pro', 'Enterprise') NOT NULL,
  `amount_paid` DECIMAL(6,2) DEFAULT 0.00,
  `status` VARCHAR(50) DEFAULT 'Active',
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
