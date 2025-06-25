CREATE DATABASE IF NOT EXISTS iot_database;
USE iot_database;

CREATE TABLE IF NOT EXISTS humidity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    humidity FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    recorded_at DATETIME NOT NULL
); 

INSERT INTO humidity_logs (device_id, humidity, temperature, recorded_at) VALUES
('DEVICE_001', 75.5, 28.3, NOW()),
('DEVICE_002', 68.2, 27.8, NOW()),
('DEVICE_001', 73.1, 29.0, NOW()),
('DEVICE_003', 70.5, 26.5, NOW()),
('DEVICE_002', 71.8, 28.7, NOW()); 

CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mode ENUM('manual', 'automatic', 'timer') DEFAULT 'manual',
    timer_setting VARCHAR(255) DEFAULT NULL,
    relay_state BOOLEAN DEFAULT 0
);


CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    type VARCHAR(50),
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);