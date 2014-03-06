<?php
    global $config;

    mysql_connect($config['db_host'], $config['db_username'], $config['db_password']);
    mysql_select_db($config['db_name']);

    // separate code from data
    function db($sql, $bind = []) {
        // avoid SQL injections through prepared queries

        foreach ($bind as $key => $value) {
            if (is_string($value)) {
                // escape all valuesk
                $value = mysql_real_escape_string($value);
                $value = '"' . $value . '"';
            }
            else if (is_array($value)) {
                foreach ($value as $i => $subvalue) {
                    $value[$i] = addslashes($subvalue);
                }
                $value = "('" . implode("', '", $value) . "')";
            }
            else if (is_null($value)) {
                $value = '""';
            }
            $bind[':' . $key] = $value;
            unset($bind[$key]);
        }
        $finalsql = strtr($sql, $bind);
        $res = mysql_query($finalsql);
        if ($res === false) {
            die(mysql_error());
        }
        return $res;
    }
?>
