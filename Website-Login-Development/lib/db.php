<?php
$host = 'localhost';      // Default for XAMPP/MAMP
$dbname = 'leaderboard_db'; // Your database name
$user = 'root';           // Default username
$pass = '';               // Default password (empty)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>