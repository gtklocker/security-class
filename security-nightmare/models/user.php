<?php
    class User extends Model {
        public $username;
        public $password;

        public static function findByUsername($username) {
            $res = db("SELECT * FROM users WHERE username=:username", compact('username'));
            if (mysql_num_rows($res) == 0) {
                return false;
            }
            $row = mysql_fetch_array($res);
            $user = new User();
            $user->username = $row['username'];
            return $user;
        }
        public function delete($userid) {
            // prevent SQL injection by ensuring it's an int
            assert(is_int($userid));

            db("DELETE FROM users WHERE userid=$userid");
        }
        public function authenticatesWith($password) {
            $res = db(
                "SELECT * FROM users WHERE username=:username",
                ['username' => $this->username]
            );
            if (mysql_num_rows($res) == 0) {
                return false;
            }
            $row = mysql_fetch_array($res);

            // compare stored (already hashed password) with password provided
            return $row['password'] == md5($password);
        }
        public function save() {
            $username = $this->username;
            // hash the password for security-in-depth
            $password = md5($this->password);

            db(
                "INSERT INTO users SET username=:username, password=:password",
                compact('username', 'password')
            );
        }
    }
?>
