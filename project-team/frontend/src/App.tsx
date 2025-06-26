import React, { useEffect, useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import SensorTable from './components/SensorTable';
import SearchBar from './components/SearchBar';
import { api } from './services/api';
import { SensorData } from './types';
import './styles/App.css';
import DeviceStatusComponent from './components/DeviceStatus';
import DeviceLogs from './components/DeviceLogs';
import DeviceControl from './components/DeviceControl';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8f9fa',
        },
      },
    },
  },
});

function App() {
  const [data, setData] = useState<SensorData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const deviceId = 1; // Hoặc lấy từ props/router nếu cần

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchData();
    // Cập nhật dữ liệu mỗi 5 giây
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Lấy dữ liệu từ API
  const fetchData = async () => {
    try {
      const result = await api.getAllSensors();
      setData(result);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa dữ liệu
  const handleDelete = async (id: number) => {
    try {
      await api.deleteSensor(id);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
    }
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter(item =>
    item.device_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="header">
        <Container maxWidth="lg">
          <h1>🌱 Hệ thống Giám sát Độ ẩm</h1>
          <p>Theo dõi và quản lý dữ liệu cảm biến độ ẩm trong thời gian thực</p>
        </Container>
      </div>
      <Container maxWidth="lg">
        <Box display="flex" gap={4} alignItems="flex-start">
          <Box flex={1}>
        <Box className="search-container">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </Box>
        <Box className="table-container">
          <SensorTable
            data={filteredData}
            onDelete={handleDelete}
            loading={loading}
          />
            </Box>
          </Box>
          <Box minWidth={320}>
            <DeviceStatusComponent deviceId={deviceId} />
            <DeviceControl deviceId={deviceId} />
            <DeviceLogs deviceId={deviceId} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
