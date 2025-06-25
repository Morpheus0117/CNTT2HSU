-- Tạo database
CREATE DATABASE IF NOT EXISTS iot_database;
USE iot_database;

-- Bảng lưu log cảm biến độ ẩm
CREATE TABLE IF NOT EXISTS humidity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    humidity FLOAT NOT NULL,
    temperature FLOAT NOT NULL,
    recorded_at DATETIME NOT NULL
);

-- Bảng thiết bị
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mode ENUM('manual', 'automatic', 'timer') DEFAULT 'manual',
    timer_setting VARCHAR(255) DEFAULT NULL,
    relay_state BOOLEAN DEFAULT 0
);

-- Bảng log hoạt động thiết bị
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT,
    type VARCHAR(50),
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- Dữ liệu mẫu cho bảng devices
INSERT INTO devices (id, name, mode)
VALUES (1, 'Thiết bị 1', 'manual') AS new
ON DUPLICATE KEY UPDATE
  name = new.name,
  mode = new.mode;

-- Dữ liệu mẫu cho bảng humidity_logs
INSERT INTO humidity_logs (device_id, humidity, temperature, recorded_at) VALUES
('DEVICE_001', 75.5, 28.3, NOW()),
('DEVICE_002', 68.2, 27.8, NOW()),
('DEVICE_001', 73.1, 29.0, NOW()),
('DEVICE_003', 70.5, 26.5, NOW()),
('DEVICE_002', 71.8, 28.7, NOW());

-- Dữ liệu mẫu cho bảng logs
INSERT INTO logs (device_id, type, message) VALUES (1, 'manual', 'Chuyển sang chế độ manual');
INSERT INTO logs (device_id, type, message) VALUES (1, 'automatic', 'Chuyển sang chế độ automatic');
INSERT INTO logs (device_id, type, message) VALUES (1, 'timer', 'Cài đặt định thời 08:00-10:00');
