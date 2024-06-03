import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import api from './api';

const ExpenseForm = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [response, setResponse] = useState('');
  const [data, setData] = useState({
    date: '',
    reason: '',
    category: '',
    price: ''
  });

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setCurrentDate(`${yyyy}-${mm}-${dd}`);
    setData({
      ...data,
      date: today.toISOString()
    });
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeCategory = (e) => {
    setData({
      ...data,
      category: Number(e.target.value)
    });
  };

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
    const date = new Date(e.target.value);
    setData({
      ...data,
      date: date.toISOString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/django/create-or-list-spending-obj/', data);
      setResponse(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleSubmit}>
      <TextField
        label="Date"
        type="date"
        name="date"
        value={currentDate}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Reason"
        name="reason"
        placeholder="Enter reason"
        onChange={handleChange}
      />
      <FormControl fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={data.category}
          onChange={handleChangeCategory}
        >
          <MenuItem value=""><em>Select category</em></MenuItem>
          <MenuItem value={1}>Food</MenuItem>
          <MenuItem value={2}>Transportation</MenuItem>
          <MenuItem value={3}>Entertainment</MenuItem>
          <MenuItem value={4}>Health</MenuItem>
          <MenuItem value={5}>Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Price"
        type="number"
        name="price"
        placeholder="Enter price"
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
};

export default ExpenseForm;
