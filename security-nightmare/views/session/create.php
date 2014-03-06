<?php
require 'views/header.php';
?>

<h2>Log in</h2>

<?php
    if (!empty($wrong)) {
        ?><div>You have entered an incorrect username or password.</div><?php
    }
?>

<form action='session/create' method='post'>
    <div>
        <label>Username:</label>
        <input type='text' name='username' <?php
        if (!empty($username)) {
            ?>value='<?php
            echo $username;
            ?>' <?php
        }
        ?> />
    </div>

    <div>
        <label>Password:</label>
        <input type='password' name='password' />
    </div>

    <div>
        <input type='submit' value='Log in' />
    </div>
</form>

<a href='user/createview'>Don't have an account?</a>

<?php
require 'views/footer.php';
?>
