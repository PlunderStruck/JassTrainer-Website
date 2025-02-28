<?php
session_start();
header('Content-Type: application/json');

$response = ["isLoggedIn" => false];

// Ensure session is active
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    $response["isLoggedIn"] = true;
    $response["username"] = $_SESSION['username'];

    // ✅ Ensure sessionStorage is updated (via JS)
    $response["forceSessionStorage"] = true;
} else {
    // ✅ If PHP session expired, tell frontend to remove `sessionStorage`
    $response["forceLogout"] = true;
}

echo json_encode($response);
exit;
?>
