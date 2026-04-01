<?php
// ═══════════════════════════════════════════════════
// ADDRESSES API — CRUD saved delivery addresses
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$userId = $_SESSION['user_id'];

switch ($method) {

    // ─── LIST ADDRESSES ───
    case 'GET':
        $stmt = $pdo->prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC');
        $stmt->execute([$userId]);
        jsonResponse(true, $stmt->fetchAll());
        break;

    // ─── ADD ADDRESS ───
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $label = trim($input['label'] ?? 'Home');
        $addressText = trim($input['address_text'] ?? '');
        $isDefault = !empty($input['is_default']) ? 1 : 0;

        if (!$addressText) {
            jsonResponse(false, null, 'Address text is required.', 400);
        }

        // If setting as default, clear other defaults
        if ($isDefault) {
            $pdo->prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?')->execute([$userId]);
        }

        $stmt = $pdo->prepare('INSERT INTO addresses (user_id, label, address_text, is_default) VALUES (?, ?, ?, ?)');
        $stmt->execute([$userId, $label, $addressText, $isDefault]);

        jsonResponse(true, [
            'id' => (int) $pdo->lastInsertId(),
            'label' => $label,
            'address_text' => $addressText,
            'is_default' => $isDefault
        ], 'Address added.');
        break;

    // ─── UPDATE ADDRESS ───
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = (int) ($input['id'] ?? 0);
        $label = trim($input['label'] ?? 'Home');
        $addressText = trim($input['address_text'] ?? '');
        $isDefault = !empty($input['is_default']) ? 1 : 0;

        if (!$id || !$addressText) {
            jsonResponse(false, null, 'ID and address text are required.', 400);
        }

        // Verify ownership
        $stmt = $pdo->prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);
        if (!$stmt->fetch()) {
            jsonResponse(false, null, 'Address not found.', 404);
        }

        if ($isDefault) {
            $pdo->prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?')->execute([$userId]);
        }

        $stmt = $pdo->prepare('UPDATE addresses SET label = ?, address_text = ?, is_default = ? WHERE id = ? AND user_id = ?');
        $stmt->execute([$label, $addressText, $isDefault, $id, $userId]);

        jsonResponse(true, null, 'Address updated.');
        break;

    // ─── DELETE ADDRESS ───
    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = (int) ($input['id'] ?? 0);

        if (!$id) {
            jsonResponse(false, null, 'Address ID is required.', 400);
        }

        $stmt = $pdo->prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $userId]);

        if ($stmt->rowCount() > 0) {
            jsonResponse(true, null, 'Address deleted.');
        }
        jsonResponse(false, null, 'Address not found.', 404);
        break;

    default:
        jsonResponse(false, null, 'Method not allowed.', 405);
}
