# CNTT2HSU

---

## 🔧 Backend (API + Database)

- NodeJS + Express + MySQL
- Quản lý dữ liệu cảm biến, trạng thái thiết bị, log hoạt động, điều khiển relay
- Hỗ trợ các chế độ: **manual**, **automatic**, **timer**

### Cài đặt:
```bash
cd backend
npm install
```

### Khởi tạo database:
- Import file `schema.sql` hoặc `sample_data.sql` vào MySQL:
  ```bash
  mysql -u root -p < schema.sql
  ```
- Cấu hình thông tin kết nối DB trong `backend/db.js` nếu cần.

### Chạy server:
```bash
node index.js
```

---

## 🔧 Thiết bị phần cứng

- Wemos D1 R1/R2, NodeMCU ESP8266, hoặc ESP32  
- Cảm biến độ ẩm đất, DHT11/DHT22, hoặc cảm biến tương tự  
- Relay module  
- Điện trở 10kΩ (nếu cần pull-up)  
- Kết nối WiFi  

---

## 📲 Thư viện cần cài trong Arduino IDE

Vào menu: **Tools → Manage Libraries** và tìm, cài đặt các thư viện sau:

- `ESP8266WiFi` hoặc `WiFi` (cho ESP32)
- `ArduinoJson`
- `NTPClient`
- (Nếu dùng cảm biến DHT) `DHT sensor library by Adafruit` và `Adafruit Unified Sensor`

---

## 💻 Frontend Web

- Sử dụng React (TypeScript)
- Giao diện hiển thị dữ liệu cảm biến, trạng thái thiết bị, log hoạt động
- Cho phép điều khiển relay (bật/tắt) ở chế độ manual, chuyển đổi chế độ hoạt động, cài đặt timer

### Cài đặt:
```bash
cd frontend
npm install
npm start
```

---

## ⚡ Chức năng chính

- **Giám sát nhiệt độ, độ ẩm** theo thời gian thực
- **Điều khiển relay**:  
  - **Manual**: Bật/tắt relay từ frontend  
  - **Auto**: Relay tự động bật/tắt theo ngưỡng cảm biến  
  - **Timer**: Relay tự động bật/tắt theo khung giờ cài đặt
- **Ghi log hoạt động** và hiển thị lịch sử trên web
- **Đồng bộ trạng thái relay giữa thiết bị, backend, frontend**

---

## 📌 Ghi chú

- Đảm bảo các thiết bị cùng một mạng LAN hoặc mở public địa chỉ IP/API nếu dùng qua internet.
- Kiểm tra đúng cổng COM và Board trong Arduino IDE khi upload code.
- Đổi IP backend trong code thiết bị cho đúng với máy chủ API.
- Có thể mở rộng thêm các loại cảm biến, nhiều thiết bị, hoặc các chức năng điều khiển khác.

---

