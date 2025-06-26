import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DeviceStatus } from '../types';

const DeviceStatusComponent = ({ deviceId }: { deviceId: number }) => {
  const [status, setStatus] = useState<DeviceStatus | null>(null);

  useEffect(() => {
    api.getDeviceStatus(deviceId).then(setStatus);
  }, [deviceId]);

  if (!status) return <div>Không có dữ liệu thiết bị</div>;

  return (
    <div>
      <h3>Device Status</h3>
      <p>Mode: {status.mode}</p>
      {status.mode === 'timer' && <p>Timer: {status.timer_setting}</p>}
      {/* Thêm các thông tin khác nếu cần */}
    </div>
  );
};

export default DeviceStatusComponent; 