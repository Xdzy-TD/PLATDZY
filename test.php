<?php
/**
 * Plat — Full Database & Environment Diagnostics for XAMPP / Local Setup
 */

// Disable caching for tests
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Set diagnostics definition so db.php throws errors instead of exiting with JSON
define('IN_DIAGNOSTICS', true);

// Set up diagnostic variables
$php_version = PHP_VERSION;
$pdo_enabled = extension_loaded('pdo');
$pdo_sqlite_enabled = extension_loaded('pdo_sqlite');
$pdo_mysql_enabled = extension_loaded('pdo_mysql');
$sqlite3_enabled = class_exists('SQLite3');

$dir_writable = is_writable(__DIR__);
$db_file = __DIR__ . '/plat.db';
$db_exists = file_exists($db_file);
$db_writable = $db_exists ? is_writable($db_file) : $dir_writable;

$db_status = false;
$db_error = '';
$db_driver = '';
$db_mode_configured = 'unknown';
$mysql_host = '';
$mysql_port = '';
$mysql_name = '';
$mysql_user = '';
$user_count = 0;
$recipe_count = 0;

if ($pdo_enabled) {
    try {
        require_once __DIR__ . '/db.php';
        
        if (isset($pdo)) {
            $db_status = true;
            try {
                $db_driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            } catch (Exception $ex) {
                $db_driver = 'unknown';
            }
            
            // Fetch configuration constants safely
            $db_mode_configured = defined('DB_MODE') ? DB_MODE : 'auto';
            $mysql_host = defined('DB_HOST') ? DB_HOST : 'localhost';
            $mysql_port = defined('DB_PORT') ? DB_PORT : '3306';
            $mysql_name = defined('DB_NAME') ? DB_NAME : 'plat_recipes';
            $mysql_user = defined('DB_USER') ? DB_USER : 'root';

            // Fetch stats safely
            $resUser = $pdo->query("SELECT COUNT(*) as count FROM users");
            $user_count = $resUser ? $resUser->fetch(PDO::FETCH_ASSOC)['count'] : 0;
            
            $resRecipe = $pdo->query("SELECT COUNT(*) as count FROM recipes");
            $recipe_count = $resRecipe ? $resRecipe->fetch(PDO::FETCH_ASSOC)['count'] : 0;
        }
    } catch (Exception $e) {
        $db_status = false;
        $db_error = $e->getMessage();
        // Fallbacks for display
        $db_mode_configured = defined('DB_MODE') ? DB_MODE : 'auto';
        $mysql_host = defined('DB_HOST') ? DB_HOST : 'localhost';
        $mysql_port = defined('DB_PORT') ? DB_PORT : '3306';
        $mysql_name = defined('DB_NAME') ? DB_NAME : 'plat_recipes';
        $mysql_user = defined('DB_USER') ? DB_USER : 'root';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plat Engine — Database & System Diagnostics</title>
    <!-- Use Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #09090f;
            --card-bg: rgba(18, 18, 29, 0.65);
            --border: rgba(255, 255, 255, 0.08);
            --accent: #e8632a;
            --accent-glow: rgba(232, 99, 42, 0.2);
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg);
            background-image: 
                radial-gradient(circle at 10% 20%, rgba(232, 99, 42, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 40%);
            color: var(--text-primary);
            font-family: 'Inter', sans-serif;
            min-height: 100vh;
            line-height: 1.5;
            padding: 2.5rem 1rem;
        }

        .container {
            max-width: 850px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            margin-bottom: 2.5rem;
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }

        .logo {
            font-size: 2.3rem;
            font-weight: 800;
            font-style: italic;
            letter-spacing: -0.02em;
            color: #fff;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            margin-bottom: 0.5rem;
        }

        .logo span {
            color: var(--accent);
            text-shadow: 0 0 15px rgba(232, 99, 42, 0.4);
        }

        .subtitle {
            font-size: 0.95rem;
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 1.75rem;
            margin-bottom: 1.5rem;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
            color: #fff;
            border-left: 3px solid var(--accent);
            padding-left: 0.75rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .stat-badge {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border);
            padding: 0.2rem 0.6rem;
            font-size: 0.75rem;
            border-radius: 99px;
            color: var(--text-secondary);
            font-family: 'JetBrains Mono', monospace;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        @media (min-width: 640px) {
            .grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .status-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.85rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 8px;
        }

        .status-name {
            font-weight: 500;
            font-size: 0.9rem;
        }

        .status-detail {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            background: rgba(0, 0, 0, 0.25);
            padding: 0.15rem 0.4rem;
            border-radius: 4px;
            color: var(--text-secondary);
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.8rem;
            font-weight: 600;
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .badge-success {
            background: rgba(16, 185, 129, 0.15);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.25);
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
        }

        .badge-error {
            background: rgba(239, 68, 68, 0.15);
            color: var(--error);
            border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .badge-warning {
            background: rgba(245, 158, 11, 0.15);
            color: var(--warning);
            border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .badge-info {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
            text-align: center;
            margin-top: 1rem;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            padding: 1.25rem 0.5rem;
            transition: all 0.2s;
        }

        .stat-card:hover {
            border-color: rgba(232, 99, 42, 0.2);
            background: rgba(255, 255, 255, 0.03);
        }

        .stat-count {
            font-size: 2rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 0.25rem;
            text-shadow: 0 0 10px rgba(232, 99, 42, 0.1);
        }

        .stat-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .instructions-list {
            list-style: none;
        }

        .instruction-item {
            position: relative;
            padding-left: 2rem;
            margin-bottom: 1.25rem;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }

        .instruction-item::before {
            content: "→";
            position: absolute;
            left: 0;
            color: var(--accent);
            font-weight: 700;
            font-size: 1.1rem;
        }

        .instruction-item strong {
            color: var(--text-primary);
        }

        .cmd-box {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 0.75rem;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: #ddd;
            margin-top: 0.5rem;
            overflow-x: auto;
            white-space: pre-wrap;
        }

        .links-group {
            margin-top: 1.5rem;
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.65rem 1.4rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
        }

        .btn-primary {
            background: var(--accent);
            color: #fff;
            border: none;
            box-shadow: 0 4px 15px var(--accent-glow);
        }

        .btn-primary:hover {
            opacity: 0.95;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(232, 99, 42, 0.3);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            border: 1px solid var(--border);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
        }

        .error-banner {
            background: rgba(239, 68, 68, 0.06);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #fca5a5;
            padding: 1rem 1.25rem;
            border-radius: 8px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
            white-space: pre-wrap;
        }

        .driver-badge {
            background: linear-gradient(135deg, rgba(232, 99, 42, 0.15) 0%, rgba(9, 9, 15, 0.4) 100%);
            border: 1px solid rgba(232, 99, 42, 0.3);
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .driver-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .driver-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background: rgba(232, 99, 42, 0.1);
            border: 1px solid rgba(232, 99, 42, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .driver-title {
            font-size: 0.75rem;
            color: var(--accent);
            text-transform: uppercase;
            font-family: 'JetBrains Mono', monospace;
            letter-spacing: 0.1em;
            margin-bottom: 0.2rem;
        }

        .driver-value {
            font-size: 1.1rem;
            font-weight: 700;
            color: #fff;
        }

        .info-pill {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border);
            padding: 0.2rem 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo">Plat<span>.</span></div>
            <div class="subtitle">System & Database Diagnostics Panel</div>
        </header>

        <!-- Active Connection Badge -->
        <?php if ($db_status): ?>
            <div class="driver-badge" style="border-color: rgba(16, 185, 129, 0.35); background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(9, 9, 15, 0.4) 100%);">
                <div class="driver-info">
                    <div class="driver-icon" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.25);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <ellipse cx="12" cy="5" rx="9" ry="3"/>
                            <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
                            <path d="M3 12A9 3 0 0 0 21 12"/>
                        </svg>
                    </div>
                    <div>
                        <div class="driver-title" style="color: #10b981;">Database Connection Status</div>
                        <div class="driver-value" style="display: flex; align-items: center; gap: 0.5rem;">
                            ACTIVE & OPERATIONAL 
                            <span class="badge badge-success" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">Connected</span>
                        </div>
                    </div>
                </div>
                <div>
                    <span class="info-pill" style="border-color: rgba(16, 185, 129, 0.25); color: #10b981;">
                        Driver: <?php echo strtoupper($db_driver); ?>
                    </span>
                </div>
            </div>
        <?php else: ?>
            <div class="driver-badge" style="border-color: rgba(239, 68, 68, 0.35); background: linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(9, 9, 15, 0.4) 100%);">
                <div class="driver-info">
                    <div class="driver-icon" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.25);">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <ellipse cx="12" cy="5" rx="9" ry="3"/>
                            <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
                            <path d="M3 12A9 3 0 0 0 21 12"/>
                        </svg>
                    </div>
                    <div>
                        <div class="driver-title" style="color: #ef4444;">Database Connection Status</div>
                        <div class="driver-value">CONNECTION DEFERRED / OFFLINE</div>
                    </div>
                </div>
                <div>
                    <span class="badge badge-error">Disconnected</span>
                </div>
            </div>
        <?php endif; ?>

        <!-- Active Database Engine Configuration & Stats -->
        <div class="card">
            <h3 class="card-title">Connected Engine Details <span class="stat-badge">Dynamic Probe</span></h3>
            
            <?php if (!$db_status && !empty($db_error)): ?>
                <div class="error-banner">
                    <strong>Exception Trapped during Connection:</strong><br>
                    <?php echo htmlspecialchars($db_error); ?><br><br>
                    <em>Note: Since SQLite was also unable to load (or database driver was blocked), check if your local htdocs folder is write-configured.</em>
                </div>
            <?php endif; ?>

            <div class="grid" style="margin-bottom: 1.5rem;">
                <div class="status-row">
                    <span class="status-name">Configured Mode (`DB_MODE`)</span>
                    <span class="badge <?php echo $db_mode_configured === 'auto' ? 'badge-success' : 'badge-info'; ?>">
                        <?php echo htmlspecialchars($db_mode_configured); ?>
                    </span>
                </div>
                <div class="status-row">
                    <span class="status-name">Active Engine Connection</span>
                    <?php if ($db_status): ?>
                        <span class="badge badge-success" style="font-size:0.8rem;">
                            <?php echo $db_driver === 'mysql' ? 'XAMPP MySQL / MariaDB' : 'Embedded SQLite (plat.db)'; ?>
                        </span>
                    <?php else: ?>
                        <span class="badge badge-error">Failed</span>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Configuration values info table -->
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid var(--border); padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
                <h4 style="margin-bottom: 0.75rem; font-size: 0.9rem; color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 600;">Active Environment Parameters</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; font-family: 'JetBrains Mono', monospace;">
                    <div>• Server Host: <span class="status-detail"><?php echo htmlspecialchars($mysql_host); ?></span></div>
                    <div>• Port Number: <span class="status-detail"><?php echo htmlspecialchars($mysql_port); ?></span></div>
                    <div>• DB Name: <span class="status-detail"><?php echo htmlspecialchars($mysql_name); ?></span></div>
                    <div>• DB Username: <span class="status-detail"><?php echo htmlspecialchars($mysql_user); ?></span></div>
                    <div style="grid-column: span 2;">• Local SQLite File: <span class="status-detail"><?php echo htmlspecialchars($db_file); ?></span></div>
                </div>
            </div>

            <?php if ($db_status): ?>
                <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-secondary); margin-bottom: 0.75rem; font-weight: 600; font-family:'JetBrains Mono', monospace;">Database Records / Seed Data Status</h4>
                <div class="stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="stat-card">
                        <div class="stat-count"><?php echo $user_count; ?></div>
                        <div class="stat-label">Registered Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-count"><?php echo $recipe_count; ?></div>
                        <div class="stat-label">Gourmet Recipes</div>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <!-- PHP & Extension Requirements -->
        <div class="card">
            <h3 class="card-title">PHP Extension Environment Checks <span class="stat-badge">Local System PHP</span></h3>
            <div class="grid">
                <div class="status-row">
                    <span class="status-name">PHP Version</span>
                    <span class="status-detail"><?php echo htmlspecialchars($php_version); ?></span>
                </div>
                
                <div class="status-row">
                    <span class="status-name">PDO Core Driver</span>
                    <?php if ($pdo_enabled): ?>
                        <span class="badge badge-success">✓ Enabled</span>
                    <?php else: ?>
                        <span class="badge badge-error">✗ Missing</span>
                    <?php endif; ?>
                </div>

                <div class="status-row">
                    <span class="status-name">PDO MySQL Connector (XAMPP)</span>
                    <?php if ($pdo_mysql_enabled): ?>
                        <span class="badge badge-success">✓ Enabled</span>
                    <?php else: ?>
                        <span class="badge badge-warning">⚠ Disabled</span>
                    <?php endif; ?>
                </div>

                <div class="status-row">
                    <span class="status-name">PDO SQLite Connector (Fallback)</span>
                    <?php if ($pdo_sqlite_enabled): ?>
                        <span class="badge badge-success">✓ Enabled</span>
                    <?php else: ?>
                        <span class="badge badge-warning">⚠ Disabled</span>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- Directory Write Checks -->
        <div class="card">
            <h3 class="card-title">Directory & File Permissions <span class="stat-badge">SQLite Cache Access</span></h3>
            <div class="grid">
                <div class="status-row">
                    <span class="status-name">Root Directory Writable</span>
                    <?php if ($dir_writable): ?>
                        <span class="badge badge-success">✓ Writable</span>
                    <?php else: ?>
                        <span class="badge badge-error">✗ Read-Only</span>
                    <?php endif; ?>
                </div>

                <div class="status-row">
                    <span class="status-name">Database File (`plat.db`)</span>
                    <?php if ($db_exists): ?>
                        <?php if ($db_writable): ?>
                            <span class="badge badge-success">✓ Modifiable</span>
                        <?php else: ?>
                            <span class="badge badge-error">✗ Read-Only</span>
                        <?php endif; ?>
                    <?php else: ?>
                        <span class="badge badge-warning">⚠ Ignored (Will Create)</span>
                    <?php endif; ?>
                </div>
            </div>
        </div>

        <!-- How to fix errors in XAMPP -->
        <div class="card">
            <h3 class="card-title">Quick Settings & Configuration for XAMPP</h3>
            
            <div style="background: rgba(232, 99, 42, 0.05); border-left: 3px solid var(--accent); padding: 0.75rem 1rem; border-radius: 4px; margin-bottom: 1.25rem; font-size: 0.85rem;">
                <strong>Pro-Tip Auto-Fallback:</strong> Our codebase uses <code>'auto'</code> database mode. It automatically attempts to create and connect to XAMPP MySQL under <code>root</code>. If XAMPP's MySQL is stopped, it gracefully falls back to local file SQLite (<code>plat.db</code>) with no interruption! This ensures your recipe platform is ALWAYS operational.
            </div>

            <ul class="instructions-list">
                <li class="instruction-item">
                    <strong>Step 1: Start Apache & MySQL in XAMPP</strong><br>
                    Open your <strong>XAMPP Control Panel</strong> and click the <strong>Start</strong> buttons next to both <strong>Apache</strong> and <strong>MySQL</strong>.
                </li>
                <li class="instruction-item">
                    <strong>Step 2: Accessing phpMyAdmin / Quick Creation</strong><br>
                    Once MySQL is running, click the <strong>Admin</strong> button next to MySQL inside the XAMPP Control Panel, or go to:
                    <div class="cmd-box">http://localhost/phpmyadmin/</div>
                    There is <strong>no need to manual create tables</strong>! Our PHP script auto-generates the database <code>plat_recipes</code> and bootstraps all tables/indexes/sample recipes instantly!
                </li>
                <li class="instruction-item">
                    <strong>Step 3: Enable SQLite/PDO Extensions (If fallback doesn't work)</strong><br>
                    Open your <code>php.ini</code> (In XAMPP, click <strong>Config</strong> button next to Apache in XAMPP Control Panel, then select <code>PHP (php.ini)</code>). Search for the following extensions and ensure there is NO semicolon (<code>;</code>) in front of them:
                    <div class="cmd-box">extension=pdo_mysql
extension=pdo_sqlite</div>
                </li>
                <li class="instruction-item">
                    <strong>Step 4: Custom Credentials Configuration</strong><br>
                    If you set up custom passwords for your database root user, you can configure them easily at the top of <code>db.php</code>:
                    <div class="cmd-box">define('DB_USER', 'your_user');
define('DB_PASS', 'your_password');</div>
                </li>
            </ul>
        </div>

        <!-- Quick actions -->
        <div class="links-group">
            <a href="index.html" class="btn btn-primary">Go to Recipe Application</a>
            <button onclick="window.location.reload();" class="btn btn-secondary">Refresh Status Monitor</button>
        </div>
    </div>
</body>
</html>
