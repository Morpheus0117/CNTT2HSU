const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// RESTful API Routes
const router = express.Router();

// GET /api/sensors - Lấy tất cả dữ liệu cảm biến
router.get('/sensors', async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT * FROM humidity_logs ORDER BY recorded_at DESC');
    res.json({
      success: true,
      data: rows,
      count: rows.length,
      message: 'Lấy dữ liệu thành công'
    });
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi lấy dữ liệu từ database',
      error: err.message 
    });
  }
});

// GET /api/sensors/:id - Lấy dữ liệu cảm biến theo ID
router.get('/sensors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.pool.query('SELECT * FROM humidity_logs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy dữ liệu với id ${id}`
      });
    }
    res.json({
      success: true,
      data: rows[0],
      message: 'Lấy dữ liệu thành công'
    });
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu từ database',
      error: err.message
    });
  }
});

// POST /api/sensors - Thêm dữ liệu cảm biến mới
router.post('/sensors', async (req, res) => {
  const { device_id, humidity, temperature } = req.body;

  if (!device_id || humidity === undefined || temperature === undefined) {
    return res.status(400).json({ 
      success: false,
      message: 'Thiếu thông tin! Cần có device_id, humidity và temperature' 
    });
  }

  try {
    const query = 'INSERT INTO humidity_logs (device_id, humidity, temperature, recorded_at) VALUES (?, ?, ?, NOW())';
    const [result] = await db.pool.execute(query, [device_id, humidity, temperature]);
    
    // Lấy dữ liệu vừa thêm
    const [newData] = await db.pool.query('SELECT * FROM humidity_logs WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      success: true,
      message: 'Thêm dữ liệu thành công',
      data: newData[0]
    });
  } catch (err) {
    console.error('Lỗi khi thêm dữ liệu:', err);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi thêm dữ liệu vào database',
      error: err.message 
    });
  }
});

// PUT /api/sensors/:id - Cập nhật dữ liệu cảm biến
router.put('/sensors/:id', async (req, res) => {
  const { id } = req.params;
  const { device_id, humidity, temperature } = req.body;

  if (!device_id || humidity === undefined || temperature === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin! Cần có device_id, humidity và temperature'
    });
  }

  try {
    // Kiểm tra xem dữ liệu có tồn tại không
    const [existing] = await db.pool.query('SELECT * FROM humidity_logs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy dữ liệu với id ${id}`
      });
    }

    // Cập nhật dữ liệu
    const query = 'UPDATE humidity_logs SET device_id = ?, humidity = ?, temperature = ? WHERE id = ?';
    await db.pool.execute(query, [device_id, humidity, temperature, id]);
    
    // Lấy dữ liệu sau khi cập nhật
    const [updated] = await db.pool.query('SELECT * FROM humidity_logs WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Cập nhật dữ liệu thành công',
      data: updated[0]
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật dữ liệu:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật dữ liệu',
      error: err.message
    });
  }
});

// DELETE /api/sensors/:id - Xóa dữ liệu cảm biến
router.delete('/sensors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Kiểm tra xem dữ liệu có tồn tại không
    const [existing] = await db.pool.query('SELECT * FROM humidity_logs WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy dữ liệu với id ${id}`
      });
    }

    const query = 'DELETE FROM humidity_logs WHERE id = ?';
    await db.pool.execute(query, [id]);
    
    res.json({
      success: true,
      message: 'Xóa dữ liệu thành công',
      data: existing[0] // Trả về dữ liệu đã xóa
    });
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi xóa dữ liệu',
      error: err.message 
    });
  }
});

// LẤY TRẠNG THÁI THIẾT BỊ
router.get('/device/:id/status', async (req, res) => {
  try {
    const status = await db.getDeviceStatus(req.params.id);
    if (!status) return res.status(404).json({ success: false, message: 'Không tìm thấy thiết bị' });
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy trạng thái thiết bị', error: err.message });
  }
});

// ĐỔI CHẾ ĐỘ HOẠT ĐỘNG
router.post('/device/:id/mode', async (req, res) => {
  const { mode, timerSetting } = req.body;
  try {
    await db.setDeviceMode(req.params.id, mode, timerSetting || null);
    await db.addLog(req.params.id, 'mode_change', `Set mode to ${mode}${mode === 'timer' ? ' (' + timerSetting + ')' : ''}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi đổi chế độ thiết bị', error: err.message });
  }
});

// LẤY LOG LỊCH SỬ
router.get('/device/:id/logs', async (req, res) => {
  try {
    const logs = await db.getLogs(req.params.id);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi lấy log', error: err.message });
  }
});

// NHẬN LOG TỪ THIẾT BỊ (ARDUINO/ESP)
router.post('/device/:id/log', async (req, res) => {
  const { id } = req.params;
  const { type, message } = req.body;
  if (!type || !message) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin! Cần có type và message.'
    });
  }
  try {
    await db.addLog(id, type, message);
    res.status(201).json({
      success: true,
      message: 'Log đã được lưu thành công.'
    });
  } catch (err) {
    console.error('Lỗi khi lưu log:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lưu log vào database',
      error: err.message
    });
  }
});

// CẬP NHẬT TRẠNG THÁI RELAY
router.post('/device/:id/relay', async (req, res) => {
  const { id } = req.params;
  const { relayState } = req.body;
  if (relayState === undefined) {
    return res.status(400).json({ success: false, message: 'Thiếu relayState' });
  }
  try {
    await db.pool.query('UPDATE devices SET relay_state = ? WHERE id = ?', [relayState ? 1 : 0, id]);
    res.json({ success: true, message: 'Cập nhật trạng thái relay thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật relay', error: err.message });
  }
});

// Sử dụng router với prefix /api
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
