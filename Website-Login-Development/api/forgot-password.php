<?php
require_once '../lib/db.php';
require_once '../lib/auth.php';

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;

if (!$email) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit;
}

// Check if the email exists in the database
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'Email not found']);
    exit;
}

// Generate a reset token
$resetToken = generateToken();
$expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Store the reset token in the database
$stmt = $pdo->prepare("
    INSERT INTO verification_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)
");
$stmt->execute([$user['id'], $resetToken, $expiresAt]);

// Send the reset email
$resetLink = "https://www.jasstrainer.xyz/pages/reset-password.html?token=$resetToken";
$subject = "Password Reset Request";
$message = "Click the link below to reset your password:\n\n$resetLink\n\nThis link will expire in 1 hour.";
$headers = "From: noreply@jasstrainer.xyz";

if (mail($email, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Password reset email sent']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
