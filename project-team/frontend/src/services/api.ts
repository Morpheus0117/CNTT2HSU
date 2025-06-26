import axios from 'axios';
import { SensorData, ApiResponse } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  // Lấy tất cả dữ liệu cảm biến
  getAllSensors: async (): Promise<SensorData[]> => {
    const response = await axios.get<ApiResponse>(`${API_URL}/sensors`);
    return response.data.data;
  },

  // Xóa dữ liệu cảm biến theo ID
  deleteSensor: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/sensors/${id}`);
  },

  // Lấy dữ liệu theo device_id
  getSensorsByDeviceId: async (deviceId: string): Promise<SensorData[]> => {
    const response = await axios.get<ApiResponse>(`${API_URL}/sensors?device_id=${deviceId}`);
    return response.data.data;
  },

  // Lấy trạng thái thiết bị
  getDeviceStatus: async (id: number) => {
    const response = await axios.get(`${API_URL}/device/${id}/status`);
    return response.data.data;
  },

  // Đổi chế độ hoạt động
  setDeviceMode: async (id: number, mode: string, timerSetting?: string) => {
    await axios.post(`${API_URL}/device/${id}/mode`, { mode, timerSetting });
  },

  // Lấy log thiết bị
  getDeviceLogs: async (id: number) => {
    const response = await axios.get(`${API_URL}/device/${id}/logs`);
    return response.data.data;
  },

  // Gửi log thiết bị
  sendDeviceLog: async (id: number, type: string, message: string) => {
    await axios.post(`${API_URL}/device/${id}/log`, { type, message });
  },

  // Cập nhật trạng thái relay
  setRelayState: async (id: number, relayState: boolean) => {
    await axios.post(`${API_URL}/device/${id}/relay`, { relayState });
  }
}; 