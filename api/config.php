<?php
// ═══════════════════════════════════════════════════
// URBAN BURMESE RESTAURANT – Database Configuration
// ═══════════════════════════════════════════════════

session_start();
header('Content-Type: application/json');

// Allow credentials for session cookies
header('Access-Control-Allow-Credentials: true');

define('DB_HOST', 'localhost');
define('DB_NAME', 'urban_burmese');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

/**
 * Helper: send JSON response and exit
 */
function jsonResponse($success, $data = null, $message = '', $code = 200) {
    http_response_code($code);
    $res = ['success' => $success];
    if ($data !== null) $res['data'] = $data;
    if ($message) $res['message'] = $message;
    echo json_encode($res);
    exit;
}

/**
 * Helper: require user to be logged in
 */
function requireAuth() {
    if (empty($_SESSION['user_id'])) {
        jsonResponse(false, null, 'Not authenticated.', 401);
    }
}
