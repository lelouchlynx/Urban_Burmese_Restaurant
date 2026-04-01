<?php
// ═══════════════════════════════════════════════════
// PROFILE API — GET / POST user profile
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ─── GET PROFILE ───
    case 'GET':
        $stmt = $pdo->prepare('SELECT id, name, email, phone, created_at FROM users WHERE id = ?');
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        if ($user) {
            jsonResponse(true, $user);
        }
        jsonResponse(false, null, 'User not found.', 404);
        break;

    // ─── UPDATE PROFILE ───
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');

        if (!$name || !$email) {
            jsonResponse(false, null, 'Name and email are required.', 400);
        }

        // Check if email is taken by another user
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $stmt->execute([$email, $_SESSION['user_id']]);
        if ($stmt->fetch()) {
            jsonResponse(false, null, 'Email already in use by another account.', 409);
        }

        $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?');
        $stmt->execute([$name, $email, $phone ?: null, $_SESSION['user_id']]);

        $_SESSION['user_name'] = $name;

        jsonResponse(true, [
            'id' => $_SESSION['user_id'],
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ], 'Profile updated.');
        break;

    default:
        jsonResponse(false, null, 'Method not allowed.', 405);
}
