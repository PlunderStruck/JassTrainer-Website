<?php
ini_set('session.gc_maxlifetime', 0);
ini_set('session.cookie_lifetime', 0);

session_set_cookie_params([
    'lifetime' => 0,  
    'path' => '/',
    'domain' => '',
    'secure' => isset($_SERVER['HTTPS']),
    'httponly' => true,
    'samesite' => 'Strict'
]);

session_start();
require_once '../lib/db.php';
require_once '../lib/auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, password_hash, is_verified FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !verifyPassword($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid email or password']);
    exit;
}

if (!$user['is_verified']) {
    http_response_code(403);
    echo json_encode(['error' => 'Please verify your email before logging in']);
    exit;
}

// ✅ Store user session after successful login
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

// ✅ Set a cookie that expires on browser close (fix for Chrome)
setcookie('sessionStorageActive', '1', 0, '/', '', isset($_SERVER['HTTPS']), true);

echo json_encode(['success' => true, 'message' => 'Login successful']);

?>
