<?php
require_once '../lib/db.php';

$token = $_GET['token'] ?? null;

if (!$token) {
    http_response_code(400);
    echo 'Invalid token.';
    exit;
}

// Find the token in the database
$stmt = $pdo->prepare("SELECT user_id FROM verification_tokens WHERE token = ? AND expires_at > NOW()");
$stmt->execute([$token]);
$tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$tokenData) {
    http_response_code(400);
    echo 'Invalid or expired token.';
    exit;
}

// Mark the user as verified
$stmt = $pdo->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
$stmt->execute([$tokenData['user_id']]);

// Delete the token
$stmt = $pdo->prepare("DELETE FROM verification_tokens WHERE user_id = ?");
$stmt->execute([$tokenData['user_id']]);

echo 'Email verified successfully! You can now log in.';
?>
