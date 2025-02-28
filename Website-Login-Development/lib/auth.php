<?php
// Hashes a password
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Verifies a password against a stored hash
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Generates a random token (for email verification or other purposes)
function generateToken($length = 64) {
    return bin2hex(random_bytes($length / 2));
}
?>
