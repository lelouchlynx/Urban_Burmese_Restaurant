<?php
// ═══════════════════════════════════════════════════
// ADMIN ORDERS API — View all orders & update status
// ═══════════════════════════════════════════════════
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ─── GET ALL ORDERS (for admin panel) ───
    case 'GET':
        $status = $_GET['status'] ?? null;
        $sql = 'SELECT o.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id';
        $params = [];

        if ($status && $status !== 'all') {
            $sql .= ' WHERE o.status = ?';
            $params[] = $status;
        }
        $sql .= ' ORDER BY o.created_at DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        // Attach items
        $stmtItems = $pdo->prepare(
            'SELECT item_name, spice_level, `portion`, qty, unit_price, line_total, notes
             FROM order_items WHERE order_id = ?'
        );
        foreach ($orders as &$order) {
            $stmtItems->execute([$order['id']]);
            $order['items'] = $stmtItems->fetchAll();
            // Merge user info for display
            if (!$order['user_id']) {
                $order['customer_name'] = $order['guest_name'] ?: 'Guest';
                $order['customer_email'] = $order['guest_email'] ?: '—';
                $order['customer_phone'] = $order['guest_phone'] ?: '—';
            } else {
                $order['customer_name'] = $order['user_name'] ?: '—';
                $order['customer_email'] = $order['user_email'] ?: '—';
                $order['customer_phone'] = $order['user_phone'] ?: '—';
            }
        }

        jsonResponse(true, $orders);
        break;

    // ─── UPDATE ORDER STATUS ───
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = intval($input['order_id'] ?? 0);
        $newStatus = $input['status'] ?? '';

        $validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!$orderId || !in_array($newStatus, $validStatuses)) {
            jsonResponse(false, null, 'Invalid order ID or status.', 400);
        }

        $stmt = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
        $stmt->execute([$newStatus, $orderId]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(false, null, 'Order not found.', 404);
        }

        jsonResponse(true, null, 'Order status updated.');
        break;

    default:
        jsonResponse(false, null, 'Method not allowed.', 405);
}
