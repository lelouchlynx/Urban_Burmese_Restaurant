<?php
require_once __DIR__ . '/config.php';
try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare(
        'INSERT INTO orders (user_id, guest_name, guest_email, guest_phone, delivery_address, total, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        null, // user_id (INT DEFAULT NULL)
        'Guest Name', // guest_name
        'guest@example.com', // guest_email
        '123456789', // guest_phone
        'Test Address', // delivery_address
        150.00, // total
        'Test Notes' // notes
    ]);
    $orderId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare(
        'INSERT INTO order_items (order_id, item_name, spice_level, portion, qty, unit_price, line_total, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmtItem->execute([
        $orderId,
        'Test Dish',
        'None',
        'Regular',
        2,
        75.00,
        150.00,
        ''
    ]);
    $pdo->commit();
    echo "SUCCESS\n";
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    file_put_contents(__DIR__ . '/error.txt', $e->getMessage());
    echo "ERROR WRITTEN TO file\n";
}
