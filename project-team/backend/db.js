// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'iot_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const poolPromise = pool.promise();

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Mất kết nối database');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database có quá nhiều kết nối');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Yêu cầu kết nối database bị từ chối');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Sai thông tin đăng nhập database');
    }
  }
  if (connection) {
    console.log('✅ Đã kết nối MySQL thành công!');
    connection.release();
  }
  return;
});

// Lấy trạng thái thiết bị
async function getDeviceStatus(deviceId) {
  const [rows] = await poolPromise.query('SELECT * FROM devices WHERE id = ?', [deviceId]);
  return rows[0];
}

// Đổi chế độ hoạt động
async function setDeviceMode(deviceId, mode, timerSetting = null) {
  await poolPromise.query(
    'UPDATE devices SET mode = ?, timer_setting = ? WHERE id = ?',
    [mode, timerSetting, deviceId]
  );
}

// Ghi log
async function addLog(deviceId, type, message) {
  await poolPromise.query(
    'INSERT INTO logs (device_id, type, message) VALUES (?, ?, ?)',
    [deviceId, type, message]
  );
}

// Lấy log
async function getLogs(deviceId) {
  const [rows] = await poolPromise.query(
    'SELECT * FROM logs WHERE device_id = ? ORDER BY timestamp DESC',
    [deviceId]
  );
  return rows;
}

module.exports = {
  pool: poolPromise,
  getDeviceStatus,
  setDeviceMode,
  addLog,
  getLogs
};
