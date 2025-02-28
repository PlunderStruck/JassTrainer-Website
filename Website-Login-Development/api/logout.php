<?php
session_start();
session_destroy();

// ✅ Delete session cookie (if any)
setcookie(session_name(), '', time() - 3600, '/');

// ✅ Delete "Remember Me" token
setcookie("remember_token", "", time() - 3600, "/");

header("Location: ../login.html");
exit;
?>
