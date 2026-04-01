<?php
// ═══════════════════════════════════════════════════
// CONTACT API — Save contact form submissions
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, null, 'Method not allowed.', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$eventType = trim($input['event_type'] ?? '');
$eventDate = $input['event_date'] ?? null;
$guests = (int) ($input['guests'] ?? 0);
$message = trim($input['message'] ?? '');

// Validation
if (strlen($name) < 2) {
    jsonResponse(false, null, 'Name must be at least 2 characters.', 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, null, 'Invalid email address.', 400);
}
if (strlen($message) < 10) {
    jsonResponse(false, null, 'Message must be at least 10 characters.', 400);
}

$stmt = $pdo->prepare('INSERT INTO contact_inquiries (name, email, phone, event_type, event_date, guests, message) VALUES (?, ?, ?, ?, ?, ?, ?)');
$stmt->execute([
    $name,
    $email,
    $phone ?: null,
    $eventType ?: null,
    $eventDate ?: null,
    $guests ?: null,
    $message
]);

jsonResponse(true, ['id' => (int) $pdo->lastInsertId()], 'Inquiry submitted successfully.');
