<?php
// ═══════════════════════════════════════════════════
// RESERVATIONS API — GET / POST / DELETE
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ─── GET RESERVATIONS ───
    case 'GET':
        // Public: get reservations for a specific date (for floor plan)
        if (!empty($_GET['date'])) {
            $date = $_GET['date'];
            $time = $_GET['time'] ?? null;

            $sql = 'SELECT table_number, reservation_time, party_size, status FROM reservations WHERE reservation_date = ? AND status = "confirmed"';
            $params = [$date];

            if ($time) {
                $sql .= ' AND reservation_time = ?';
                $params[] = $time;
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            jsonResponse(true, $stmt->fetchAll());
        }

        // Authenticated: get user's own reservations
        if (empty($_SESSION['user_id'])) {
            jsonResponse(false, null, 'Login required to view your reservations.', 401);
        }

        $stmt = $pdo->prepare('SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC, reservation_time DESC');
        $stmt->execute([$_SESSION['user_id']]);
        jsonResponse(true, $stmt->fetchAll());
        break;

    // ─── CREATE RESERVATION ───
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        $guestName = trim($input['guest_name'] ?? '');
        $guestEmail = trim($input['guest_email'] ?? '');
        $guestPhone = trim($input['guest_phone'] ?? '');
        $tableNumber = (int) ($input['table_number'] ?? 0);
        $partySize = (int) ($input['party_size'] ?? 2);
        $resDate = $input['reservation_date'] ?? '';
        $resTime = $input['reservation_time'] ?? '';
        $specialReq = trim($input['special_requests'] ?? '');
        $userId = $_SESSION['user_id'] ?? null;

        // Validation
        if (!$guestName || !$guestEmail || !$tableNumber || !$resDate || !$resTime) {
            jsonResponse(false, null, 'Name, email, table, date and time are required.', 400);
        }

        // Check if table is already booked for that date + time
        $stmt = $pdo->prepare('SELECT id FROM reservations WHERE table_number = ? AND reservation_date = ? AND reservation_time = ? AND status = "confirmed"');
        $stmt->execute([$tableNumber, $resDate, $resTime]);
        if ($stmt->fetch()) {
            jsonResponse(false, null, 'This table is already reserved for the selected date and time.', 409);
        }

        $stmt = $pdo->prepare('INSERT INTO reservations (user_id, guest_name, guest_email, guest_phone, table_number, party_size, reservation_date, reservation_time, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $userId,
            $guestName,
            $guestEmail,
            $guestPhone ?: null,
            $tableNumber,
            $partySize,
            $resDate,
            $resTime,
            $specialReq ?: null
        ]);

        jsonResponse(true, [
            'id' => (int) $pdo->lastInsertId(),
            'table_number' => $tableNumber,
            'reservation_date' => $resDate,
            'reservation_time' => $resTime,
            'party_size' => $partySize,
            'guest_name' => $guestName
        ], 'Reservation confirmed!');
        break;

    // ─── CANCEL RESERVATION ───
    case 'DELETE':
        if (empty($_SESSION['user_id'])) {
            jsonResponse(false, null, 'Login required.', 401);
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $id = (int) ($input['id'] ?? 0);

        if (!$id) {
            jsonResponse(false, null, 'Reservation ID required.', 400);
        }

        $stmt = $pdo->prepare('UPDATE reservations SET status = "cancelled" WHERE id = ? AND user_id = ? AND status = "confirmed"');
        $stmt->execute([$id, $_SESSION['user_id']]);

        if ($stmt->rowCount() > 0) {
            jsonResponse(true, null, 'Reservation cancelled.');
        }
        jsonResponse(false, null, 'Reservation not found or already cancelled.', 404);
        break;

    default:
        jsonResponse(false, null, 'Method not allowed.', 405);
}
