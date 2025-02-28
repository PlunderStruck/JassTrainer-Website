<?php
require_once '../lib/db.php';
require_once '../lib/auth.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;
$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

// Validate inputs
if (!$email || !$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Check for duplicate email or username
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->execute([$email, $username]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email or username already exists']);
    exit;
}

// Hash the password
$passwordHash = hashPassword($password);

// Create a verification token
$verificationToken = generateToken();

// Insert the user into the database
$stmt = $pdo->prepare("INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$email, $username, $passwordHash]);

// Insert the verification token
$userId = $pdo->lastInsertId();
$stmt = $pdo->prepare("INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))");
$stmt->execute([$userId, $verificationToken]);

// Send verification email (simplified for testing)
mail($email, "Verify Your Account", "Click this link to verify: https://www.jasstrainer.xyz/api/verify-email.php?token=$verificationToken");

// Respond to the client
echo json_encode(['success' => true, 'message' => 'Registration successful! Please check your email to verify your account.']);
?>
