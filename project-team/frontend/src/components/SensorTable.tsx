import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SensorData } from '../types';

interface Props {
  data: SensorData[];
  onDelete: (id: number) => void;
  loading?: boolean;
}

const SensorTable: React.FC<Props> = ({ data, onDelete, loading = false }) => {
  return (
    <div className="dashboard-card">
      <div className="table-header">
        <Typography variant="h6" component="h2">
          Dữ liệu cảm biến độ ẩm
        </Typography>
      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Thiết bị</TableCell>
              <TableCell>Độ ẩm (%)</TableCell>
              <TableCell>Nhiệt độ (°C)</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} className="highlight-row">
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span 
                        className={`status-indicator ${
                          row.humidity < 30 
                            ? 'status-error' 
                            : row.humidity < 40 
                            ? 'status-warning' 
                            : 'status-normal'
                        }`}
                      />
                      {row.device_id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={
                        row.humidity < 30 
                          ? 'error' 
                          : row.humidity < 40 
                          ? 'warning' 
                          : 'inherit'
                      }
                      fontWeight={row.humidity < 40 ? 'bold' : 'normal'}
                    >
                      {row.humidity}%
                    </Typography>
                  </TableCell>
                  <TableCell>{row.temperature}°C</TableCell>
                  <TableCell>
                    {new Date(row.recorded_at).toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(row.id)}
                      size="small"
                      className="delete-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SensorTable; 