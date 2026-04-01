<?php
// ═══════════════════════════════════════════════════
// AUTH API — register, login, logout, check
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {

    // ─── REGISTER ───
    case 'register':
        $input = json_decode(file_get_contents('php://input'), true);
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $password = $input['password'] ?? '';

        if (!$name || !$email || !$password) {
            jsonResponse(false, null, 'Name, email and password are required.', 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(false, null, 'Invalid email address.', 400);
        }
        if (strlen($password) < 6) {
            jsonResponse(false, null, 'Password must be at least 6 characters.', 400);
        }

        // Check duplicate email
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            jsonResponse(false, null, 'Email already registered.', 409);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $email, $phone ?: null, $hash]);

        $userId = $pdo->lastInsertId();
        $_SESSION['user_id'] = (int) $userId;
        $_SESSION['user_name'] = $name;

        jsonResponse(true, [
            'id' => (int) $userId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ], 'Registration successful.');
        break;

    // ─── LOGIN ───
    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (!$email || !$password) {
            jsonResponse(false, null, 'Email and password are required.', 400);
        }

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            jsonResponse(false, null, 'Invalid email or password.', 401);
        }

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['user_name'] = $user['name'];

        jsonResponse(true, [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone']
        ], 'Login successful.');
        break;

    // ─── LOGOUT ───
    case 'logout':
        session_destroy();
        jsonResponse(true, null, 'Logged out.');
        break;

    // ─── CHECK SESSION ───
    case 'check':
        if (!empty($_SESSION['user_id'])) {
            $stmt = $pdo->prepare('SELECT id, name, email, phone FROM users WHERE id = ?');
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch();
            if ($user) {
                jsonResponse(true, $user);
            }
        }
        jsonResponse(false, null, 'Not logged in.');
        break;

    default:
        jsonResponse(false, null, 'Invalid action.', 400);
}
