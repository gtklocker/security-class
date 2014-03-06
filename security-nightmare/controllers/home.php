<?php
    class HomeController extends Controller {
        public function view() {
            if (isset($_SESSION['user'])) {
                include 'views/home/loggedin.php';
            }
            else {
                include 'views/home/loggedout.php';
            }
        }
    }
?>
