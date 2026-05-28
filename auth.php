<?php
/**
 * Plat Authentication Handler (Login / Registration)
 * Secure password storage utilizing bcrypt hashing algorithms.
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight cors requests gracefully
if ($method === 'OPTIONS') {
    exit;
}

// Extract raw POST JSON data parameters
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['action'])) {
    echo json_encode([
        "success" => false,
        "message" => "Bad request. Action payload missing."
    ]);
    exit;
}

$action = $data['action'];
$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if ($action === 'register') {
    if (empty($email) || empty($password)) {
        echo json_encode([
            "success" => false,
            "message" => "All credentials (email and password) are required."
        ]);
        exit;
    }
    $fullname = isset($data['fullname']) ? trim($data['fullname']) : 'Guest Chef';
    $plan = isset($data['plan']) ? trim($data['plan']) : 'free';

    // 1. Check if email is already taken in Database
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Email address already registered on this platform."
        ]);
        exit;
    }

    // 2. Hash raw password with secure bCrypt hash
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $user_id = 'u_' . uniqid();

    try {
        $stmt = $pdo->prepare("INSERT INTO users (id, email, password_hash, fullname, plan) VALUES (:id, :email, :password_hash, :fullname, :plan)");
        $stmt->execute([
            'id' => $user_id,
            'email' => $email,
            'password_hash' => $password_hash,
            'fullname' => $fullname,
            'plan' => $plan
        ]);

        echo json_encode([
            "success" => true,
            "user" => [
                "email" => $email,
                "fullname" => $fullname,
                "plan" => $plan
            ],
            "message" => "Registration successful. Subscription active."
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Database insertion fault: " . $e->getMessage()
        ]);
    }

} elseif ($action === 'login') {
    if (empty($email) || empty($password)) {
        echo json_encode([
            "success" => false,
            "message" => "All credentials (email and password) are required."
        ]);
        exit;
    }
    // Lookup user in database
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        echo json_encode([
            "success" => true,
            "user" => [
                "email" => $user['email'],
                "fullname" => $user['fullname'],
                "plan" => $user['plan']
            ],
            "message" => "Sign in verified."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email or incorrect password combination."
        ]);
    }
} elseif ($action === 'forgot_password') {
    if (empty($email) || empty($password)) {
        echo json_encode([
            "success" => false,
            "message" => "All credentials (email and password) are required."
        ]);
        exit;
    }
    // Check if user exists first
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "No registered account found with that email address."
        ]);
        exit;
    }

    // Hash the new password securely
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("UPDATE users SET password_hash = :password_hash WHERE email = :email");
        $stmt->execute([
            'password_hash' => $password_hash,
            'email' => $email
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Password successfully reset! You can now sign in with your new credentials."
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Database update fault: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Unrecognized authorization action."
    ]);
}
