<?php
    class UserController extends Controller {
        public function createView($emptyusername, $emptypassword, $duplicateusername, $shortpassword) {
            require 'views/user/create.php';
        }
        public function create($username, $password) {
            if (empty($username)) {
                return redirect('user/createview?emptyusername=yes');
            }
            if (empty($password)) {
                return redirect('user/createview?emptypassword=yes');
            }
            if (strlen($password) < 7) {
                // ensure our users' security by requiring at least 7 characters in the password
                return redirect('user/createview?shortpassword=yes');
            }
            if (User::usernameExists($username)) {
                return redirect('user/createview?duplicateusername=yes');
            }

            $user = new User();
            $user->username = $username;
            $user->password = $password;
            $user->save();

            // log the user in
            $_SESSION['user'] = $user;

            // take the user to the home page after registration
            return redirect();
        }
        public function updateView() {
            if (!isset($_SESSION['user'])) {
                // require login
                redirect('session/createview');
            }

            require 'views/user/update.php';
        }
        public function delete($userid) {
            $user = new User($userid);
            $user->delete();
        }
    }
?>
