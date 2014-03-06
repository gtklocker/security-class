<?php
require 'views/header.php';
?>

<h2>Register</h2>

<form action='user/create' method='post'>
    <div>
        <?php
        if ($emptyusername) {
            ?><div class='error'>Your username was empty! Please enter a username</div><?php
        }
        else if ($duplicateusername) {
            ?><div class='error'>Username is taken.</div><?php
        }
        ?>
        <label>Username:</label>
        <input type='text' name='username' />
    </div>

    <div>
        <?php
        if ($emptypassword) {
            ?><div class='error'>Your password was empty! Please enter a password</div><?php
        }
        else if ($shortpassword) {
            ?><div class='error'>Your password was too short! Please enter at least 7 characters</div><?php
        }
        ?>
        <label>Password:</label>
        <input type='password' name='password' />
    </div>

    <div>
        <input type='submit' value='Create account' />
    </div>
</form>

<a href='user/createview'>Already have an account?</a>

<?php
require 'views/footer.php';
?>
