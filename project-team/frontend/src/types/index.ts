export interface SensorData {
  id: number;
  device_id: string;
  humidity: number;
  temperature: number;
  recorded_at: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: SensorData[];
  count?: number;
}

export interface DeviceStatus {
  id: number;
  mode: 'manual' | 'automatic' | 'timer';
  timer_setting?: string;
  relay_state?: boolean;
  // Thêm các trường khác nếu cần
}

export interface LogEntry {
  id: number;
  device_id: number;
  type: string;
  message: string;
  timestamp: string;
}

export interface DeviceLogRequest {
  type: string;
  message: string;
} 