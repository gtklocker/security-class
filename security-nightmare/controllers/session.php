<?php
    class SessionController extends Controller {
        public function createView($username = '', $wrong = false) {
            require 'views/session/create.php';
        }
        // log in
        public function create($username, $password) {
            global $config;

            $user = User::findByUsername($username);
            if ($user === false) {
                // username does not exist
                redirect();
            }
            else {
                // username exists
                if (!$user->authenticatesWith($password)) {
                    // stop script and redirect the user to try to login again
                    redirect('session/createview?wrong=yes&username=' . $username);
                }
                // login successful, set the session cookie
                $_SESSION['user'] = $user;

                require 'views/session/created.php';
            }
        }
        // log out
        public function delete() {
            unset($_SESSION['user']);

            redirect();
        }
    }
?>
