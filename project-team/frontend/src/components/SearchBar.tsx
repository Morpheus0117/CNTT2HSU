import React from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Box>
      <TextField
        fullWidth
        label="Tìm kiếm theo ID thiết bị"
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập ID thiết bị..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'primary.main',
          },
        }}
      />
    </Box>
  );
};

export default SearchBar; 