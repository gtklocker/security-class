<?php
require 'views/header.php';
?>

<p>Welcome to Security Nightmare, <?php
// avoid XSS :)
echo htmlspecialchars($_SESSION['user']->username);
?>!</p>

<form action='session/delete' method='post'>
    <!-- make sure log out is called via HTTP post to avoid <img src='session/delete' />
         on malicious websites :) -->
    <input type='submit' value='Log out' />
</form>

<?php
require 'views/footer.php';
?>
