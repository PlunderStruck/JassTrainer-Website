<?php
require_once '../lib/db.php'; // Include your database connection file
require_once '../lib/auth.php'; // Include your authentication helpers

// Get the JSON payload from the frontend
$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? null;
$newPassword = $data['newPassword'] ?? null;

// Check if token and new password are provided
if (!$token || !$newPassword) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request. Missing token or new password.']);
    exit;
}

try {
    // Validate the token
    $stmt = $pdo->prepare("
        SELECT user_id 
        FROM verification_tokens 
        WHERE token = ? AND expires_at > NOW()
    ");
    $stmt->execute([$token]);
    $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tokenData) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or expired token.']);
        exit;
    }

    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update the user's password
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $tokenData['user_id']]);

    // Delete the used token
    $stmt = $pdo->prepare("DELETE FROM verification_tokens WHERE token = ?");
    $stmt->execute([$token]);

    // Respond with success
    echo json_encode(['success' => true, 'message' => 'Password reset successfully!']);

} catch (Exception $e) {
    // Handle any unexpected errors
    http_response_code(500);
    echo json_encode(['error' => 'An error occurred. Please try again later.']);
}
?>
