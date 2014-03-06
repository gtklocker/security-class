<?php
    function redirect($url = '') {
        global $config;

        return header('Location: ' . $config['base'] . $url);
    }
?>
