import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LogEntry, DeviceLogRequest } from '../types';

const DeviceLogs = ({ deviceId }: { deviceId: number }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [newLog, setNewLog] = useState<DeviceLogRequest>({ type: '', message: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getDeviceLogs(deviceId).then((data) => {
      setLogs(data);
      console.log('Logs from API:', data); // Debug log
    });
  }, [deviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLog({ ...newLog, [e.target.name]: e.target.value });
  };

  const handleSendLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await api.sendDeviceLog(deviceId, newLog.type, newLog.message);
      setNewLog({ type: '', message: '' });
      // Reload logs
      const updatedLogs = await api.getDeviceLogs(deviceId);
      setLogs(updatedLogs);
    } catch (err) {
      setError('Gửi log thất bại!');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h3>Device Logs</h3>
      <form onSubmit={handleSendLog} style={{ marginBottom: 16 }}>
        <input
          type="text"
          name="type"
          placeholder="Type (e.g. auto/manual)"
          value={newLog.type}
          onChange={handleInputChange}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          name="message"
          placeholder="Message"
          value={newLog.message}
          onChange={handleInputChange}
          required
          style={{ marginRight: 8 }}
        />
        <button type="submit" disabled={sending}>Gửi log</button>
        {error && <span style={{ color: 'red', marginLeft: 8 }}>{error}</span>}
      </form>
      <ul>
        {logs.length === 0 && <li>Không có log nào.</li>}
        {[...logs].reverse().map(log => (
          <li key={log.id}>
            [{log.timestamp}] {log.type}: {log.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceLogs; 