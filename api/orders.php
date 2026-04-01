<?php
// ═══════════════════════════════════════════════════
// ORDERS API — POST (place order) / GET (my orders) / PATCH (cancel/confirm payment)
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ─── PLACE ORDER ───
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $items = $input['items'] ?? [];
        $address = trim($input['delivery_address'] ?? '');
        $orderNotes = trim($input['notes'] ?? '');
        $paymentMethod = strtolower(trim($input['payment_method'] ?? 'cod'));

        $validPaymentMethods = ['cod', 'bank'];
        if (!in_array($paymentMethod, $validPaymentMethods, true)) {
            jsonResponse(false, null, 'Invalid payment method.', 400);
        }

        if (empty($items)) {
            jsonResponse(false, null, 'Cart is empty.', 400);
        }

        // Calculate total
        $total = 0;
        foreach ($items as $item) {
            $total += floatval($item['lineTotal'] ?? 0);
        }

        // Determine user info
        $userId = $_SESSION['user_id'] ?? null;
        $guestName = null;
        $guestEmail = null;
        $guestPhone = null;

        if (!$userId) {
            // Guest order — accept optional guest info
            $guestName = trim($input['guest_name'] ?? 'Guest');
            $guestEmail = trim($input['guest_email'] ?? '');
            $guestPhone = trim($input['guest_phone'] ?? '');
        }

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare(
                'INSERT INTO orders (user_id, guest_name, guest_email, guest_phone, delivery_address, total, notes, payment_method)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $userId,
                $guestName,
                $guestEmail ?: null,
                $guestPhone ?: null,
                $address ?: null,
                $total,
                $orderNotes ?: null,
                $paymentMethod
            ]);
            $orderId = $pdo->lastInsertId();

            $stmtItem = $pdo->prepare(
                'INSERT INTO order_items (order_id, item_name, spice_level, `portion`, qty, unit_price, line_total, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($items as $item) {
                $qty = intval($item['qty'] ?? 1);
                $lineTotal = floatval($item['lineTotal'] ?? 0);
                $unitPrice = $qty > 0 ? round($lineTotal / $qty, 2) : $lineTotal;

                $stmtItem->execute([
                    $orderId,
                    $item['name'] ?? 'Unknown',
                    $item['spiceLabel'] ?? null,
                    $item['portion'] ?? 'Regular',
                    $qty,
                    $unitPrice,
                    $lineTotal,
                    $item['notes'] ?? null
                ]);
            }

            $pdo->commit();

            jsonResponse(true, [
                'order_id' => $orderId,
                'total' => $total,
                'payment_method' => $paymentMethod
            ], 'Order placed successfully!');
        } catch (Exception $e) {
            $pdo->rollBack();
            file_put_contents(__DIR__ . '/error.txt', date('Y-m-d H:i:s') . ' - ' . $e->getMessage() . "\n", FILE_APPEND);
            jsonResponse(false, null, 'Failed to place order.', 500);
        }
        break;

    // ─── GET MY ORDERS ───
    case 'GET':
        // If user is logged in, return their orders
        if (empty($_SESSION['user_id'])) {
            jsonResponse(false, null, 'Not authenticated.', 401);
        }

        $stmt = $pdo->prepare(
            'SELECT id, delivery_address, status, total, notes, created_at, updated_at, payment_method, payment_status
             FROM orders WHERE user_id = ? ORDER BY created_at DESC'
        );
        $stmt->execute([$_SESSION['user_id']]);
        $orders = $stmt->fetchAll();

        // Attach items to each order
        $stmtItems = $pdo->prepare(
            'SELECT item_name, spice_level, `portion`, qty, unit_price, line_total, notes
             FROM order_items WHERE order_id = ?'
        );
        foreach ($orders as &$order) {
            $stmtItems->execute([$order['id']]);
            $order['items'] = $stmtItems->fetchAll();
        }

        jsonResponse(true, $orders);
        break;

    // ─── PATCH: CANCEL / CONFIRM PAYMENT ───
    case 'PATCH':
        requireAuth();

        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) $input = [];

        $action = strtolower(trim($_GET['action'] ?? ($input['action'] ?? '')));
        $orderId = intval($input['order_id'] ?? 0);

        if (!$orderId) {
            jsonResponse(false, null, 'Invalid order ID.', 400);
        }

        // Validate ownership & get current state
        $stmt = $pdo->prepare('SELECT id, user_id, status, payment_method, payment_status FROM orders WHERE id = ? LIMIT 1');
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        if (!$order) {
            jsonResponse(false, null, 'Order not found.', 404);
        }
        if (intval($order['user_id']) !== intval($_SESSION['user_id'])) {
            jsonResponse(false, null, 'Forbidden.', 403);
        }

        if ($action === 'cancel') {
            $allowed = ['pending', 'preparing'];
            if (!in_array($order['status'], $allowed, true)) {
                jsonResponse(false, null, 'Order cannot be cancelled at this stage.', 409);
            }
            $u = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
            $u->execute(['cancelled', $orderId]);
            jsonResponse(true, null, 'Order cancelled.');
        }

        if ($action === 'confirm_payment') {
            if ($order['payment_method'] !== 'bank') {
                jsonResponse(false, null, 'This order does not use bank transfer.', 409);
            }
            if ($order['payment_status'] !== 'unpaid') {
                jsonResponse(false, null, 'Payment is already confirmed.', 409);
            }
            $u = $pdo->prepare('UPDATE orders SET payment_status = ? WHERE id = ?');
            $u->execute(['paid', $orderId]);
            jsonResponse(true, null, 'Payment confirmed.');
        }

        jsonResponse(false, null, 'Invalid action.', 400);
        break;

    default:
        jsonResponse(false, null, 'Method not allowed.', 405);
}
