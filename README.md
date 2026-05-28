🍳 Plat culinary — Database & XAMPP Setup Guide

Welcome to the **Plat Recipe Sharing Platform** database setup documentation! This guide explains how the system automates database operations, how to configure MySQL/MariaDB inside XAMPP, and how to resolve common database errors (such as pasting PHP code into phpMyAdmin).

---

🚨 Troubleshooting: "Variable name was expected / SQL Syntax Error near `<?php`"

Why Did This Error Happen?
When you received the error `#1064 - You have an error in your SQL syntax close to <?php`, it is because **you pasted the contents of `db.php` directly into the "SQL" query editor inside phpMyAdmin**.

* `db.php` is a PHP script, not a SQL database file. It contains backend logical directions, parameters, and credentials used by the server to run your database.
* SQL Editor in phpMyAdmin only understands standard database commands such as `CREATE`, `SELECT`, and `INSERT`. It does not understand PHP tags (`<?php`) or PHP programming structures.

### How to Fix It?
You do not need to paste or import any code into phpMyAdmin at all!

Our application features an Auto-Bootstrapping Engine. Simply starting MySQL in XAMPP and running the application in your browser is enough. The PHP code in `db.php` will automatically create the database `plat_recipes`, define all tables (users, recipes), create search indexes, and populate initial gourmet recipes for you!

---

🛠️ Complete Guide: Setting up XAMPP Database Connection

Follow these step-by-step instructions to get your local environment running beautifully:

Step 1: Start Apache & MySQL in XAMPP
1. Open your XAMPP Control Panel on your computer.
2. Locate Apache and click the Start button next to it.
3. Locate MySQL and click the Start button next to it.
4. Ensure both indicators highlight green.

Step 2: Configure Database Credentials in `db.php`
By default, the application is set to `'auto'` mode. If MySQL in XAMPP is active, it connects instantly. If MySQL is stopped, it gracefully falls back to local file-based SQLite so that your application never crashes!

If you have a custom username or password for your XAMPP's phpMyAdmin setup, open `/db.php` in your code editor and adjust the settings at the top of the file:

```php
// Option 'auto': Tries XAMPP MySQL first, and falls back to SQLite if MySQL is not running! (Recommended)
define('DB_MODE', 'auto'); 

// MySQL/MariaDB Configuration
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'plat_recipes'); // This database is created automatically!
define('DB_USER', 'root');         // Default XAMPP username is 'root'
define('DB_PASS', '');             // Default XAMPP database has no password (empty string)
```

Step 3: Run the System Diagnostics Tool
We have written a dedicated visual diagnostic panel to help you monitor and verify your database connection in real-time.

1. Open your web browser.
2. Navigate to your local server url path, for example:
   ```text
   http://localhost/Tushar/PLATUE/test.php
   ```
3. The Plat Diagnostics Panel will render a complete checklist:
   - Database Connection Status: Displays `ACTIVE & OPERATIONAL` with a green indicator if connected successfully.
   - Connected Engine Details: Shows whether it is connected to **XAMPP MySQL / MariaDB** or running the portable **SQLite** fallback.
   - Environment Parameters: Displays the host, port, database name, and username currently in use.
   - Active Record Statistics: Lists the total number of registered accounts and active gourmet recipes.
   - PHP Extension Checklist: Verifies if your PHP configuration has `pdo_mysql` and `pdo_sqlite` extensions enabled.

---

📊 Manual SQL Setup (Optional)

If you explicitly prefer to set up the database and prepopulate it manually inside phpMyAdmin instead of letting the PHP auto-bootstrap complete it, paste the following script into the phpMyAdmin **SQL tab** instead of the PHP code:

```sql
-- Create the database manually if it doesn't exist
CREATE DATABASE IF NOT EXISTS `plat_recipes` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `plat_recipes`;

-- Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `email` VARCHAR(128) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `fullname` VARCHAR(128) NOT NULL,
  `plan` VARCHAR(32) DEFAULT 'free',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Recipes Table
CREATE TABLE IF NOT EXISTS `recipes` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(64) NOT NULL,
  `prep` VARCHAR(32) DEFAULT NULL,
  `cook` VARCHAR(32) DEFAULT NULL,
  `servings` VARCHAR(32) DEFAULT NULL,
  `difficulty` VARCHAR(32) DEFAULT NULL,
  `image` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `ingredients` TEXT DEFAULT NULL,
  `steps` TEXT DEFAULT NULL,
  `created_at` BIGINT DEFAULT NULL,
  `updated_at` BIGINT DEFAULT NULL,
  INDEX `idx_recipes_category` (`category`),
  INDEX `idx_recipes_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---
🔒 Key Design Achievements of the Plat Database Layer

1. **Robust Failover System**: Built with an intelligence wrapper that handles service interruptions. If your database server restarts or fails, the platform falls back to SQLite instantly.
2. **Dynamic Bootstrapping**: Tables, columns, and seed data are managed on-the-fly, removing the need for manual configuration.
3. **Optimized Indexes**: Fully equipped with fast-lookup indexes (`idx_users_email`, `idx_recipes_category`) for quick performance.
