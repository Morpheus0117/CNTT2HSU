import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DeviceStatus } from '../types';

const DeviceControl = ({ deviceId }: { deviceId: number }) => {
  const [mode, setMode] = useState<'manual' | 'automatic' | 'timer'>('manual');
  const [timerStart, setTimerStart] = useState('');
  const [timerEnd, setTimerEnd] = useState('');
  const [message, setMessage] = useState('');
  const [relayState, setRelayState] = useState(false);
  const [status, setStatus] = useState<DeviceStatus | null>(null);

  useEffect(() => {
    api.getDeviceStatus(deviceId).then(s => {
      setStatus(s);
      setMode(s.mode);
      setRelayState(!!s.relay_state);
      if (s.timer_setting) {
        const [start, end] = s.timer_setting.split('-');
        setTimerStart(start || '');
        setTimerEnd(end || '');
      }
    });
  }, [deviceId]);

  useEffect(() => {
    if (mode === 'manual' && status) {
      setRelayState(!!status.relay_state);
    }
  }, [mode, status]);

  const handleSubmit = async () => {
    let timerSetting = undefined;
    if (mode === 'timer') {
      timerSetting = `${timerStart}-${timerEnd}`;
    }
    try {
      await api.setDeviceMode(deviceId, mode, timerSetting);
      setMessage('Cập nhật thành công!');
    } catch (err) {
      setMessage('Có lỗi xảy ra!');
    }
  };

  const handleRelayToggle = async () => {
    try {
      await api.setRelayState(deviceId, !relayState);
      setRelayState(!relayState);
      setMessage('Cập nhật relay thành công!');
    } catch (err) {
      setMessage('Có lỗi khi cập nhật relay!');
    }
  };

  return (
    <div>
      <h3>Device Control</h3>
      <select value={mode} onChange={e => setMode(e.target.value as any)}>
        <option value="manual">Manual</option>
        <option value="automatic">Automatic</option>
        <option value="timer">Timer</option>
      </select>
      {mode === 'timer' && (
        <div style={{ margin: '8px 0' }}>
          <label>Bắt đầu: </label>
          <input
            type="time"
            value={timerStart}
            onChange={e => setTimerStart(e.target.value)}
            required={mode === 'timer'}
            style={{ marginRight: 8 }}
          />
          <label>Kết thúc: </label>
          <input
            type="time"
            value={timerEnd}
            onChange={e => setTimerEnd(e.target.value)}
            required={mode === 'timer'}
          />
        </div>
      )}
      {mode === 'manual' && (
        <div style={{ margin: '8px 0' }}>
          <button onClick={handleRelayToggle} style={{ marginRight: 8 }}>
            {relayState ? 'Tắt relay' : 'Bật relay'}
          </button>
          <span>Trạng thái relay: <b>{relayState ? 'BẬT' : 'TẮT'}</b></span>
        </div>
      )}
      {mode === 'automatic' && status && (
        <div style={{ margin: '8px 0' }}>
          <span>Trạng thái relay (tự động): <b>{status.relay_state ? 'BẬT' : 'TẮT'}</b></span>
        </div>
      )}
      <button onClick={handleSubmit}>Set Mode</button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default DeviceControl; 