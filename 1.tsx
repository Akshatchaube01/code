'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import {
  TextField,
  Autocomplete,
  Button
} from '@mui/material';
import { TableComponent } from '@/components/gra-propel/userInputs/table-holidays';

interface Employee {
  psid: string;
  employee_name: string;
}

interface Holiday {
  id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  half_day: boolean;
  leave_type: string;
}

const Page = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [is_half_day, setIsHalfDay] = useState(false);
  const [leave_type, setLeaveType] = useState('Leave');
  const [total_days, setTotalDays] = useState(0);
  const [search, setSearch] = useState('');
  const [holidayData, setHolidayData] = useState<Holiday[]>([]);

  const fetchHolidayData = () => {
    axios.get('/propel/register_holidays?start=1&size=100')
      .then(res => setHolidayData(res.data.data))
      .catch(err => console.log('Error in loading data', err));
  };

  useEffect(() => {
    fetchHolidayData();
    axios.get('/test1.json') // Replace with real endpoint if available
      .then(res => setEmployees(res.data))
      .catch(err => console.log("error in loading employees"));
  }, []);

  useEffect(() => {
    if (start_date && end_date) {
      let days = differenceInCalendarDays(new Date(end_date), new Date(start_date)) + 1;
      if (days < 0) days = 0;
      setTotalDays(is_half_day ? days / 2 : days);
    } else {
      setTotalDays(0);
    }
  }, [start_date, end_date, is_half_day]);

  const handleSubmit = async () => {
    try {
      const payload = {
        rec_id: 0,
        psid: selectedEmployee,
        holiday_start_date: start_date,
        holiday_end_date: end_date,
        holiday_halfday: is_half_day,
        holiday_type: leave_type
      };
      await axios.post('/propel/register_holidays', payload);
      alert('Leave registered successfully');
      fetchHolidayData();
    } catch (err) {
      console.log(err);
      alert('Error submitting leave');
    }
  };

  const deleteHoliday = async (id: number) => {
    try {
      await axios.delete(`/propel/register_holidays/${id}`);
      alert('Deleted successfully');
      fetchHolidayData();
    } catch (err) {
      console.log('Error deleting record', err);
    }
  };

  const getHolidayById = async (id: number) => {
    try {
      const res = await axios.get(`/propel/register_holidays/${id}`);
      console.log(res.data);
    } catch (err) {
      console.log('Error fetching by ID', err);
    }
  };

  return (
    <div className='p-6 max-w-8xl mx-auto'>
      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4 items-end'>
          <div className='col-span-2'>
            <label className='text-blue-700 font-bold text-2xl'>Register Holidays</label>
            <Autocomplete
              options={employees}
              value={employees.find((e) => e.psid === selectedEmployee) || null}
              getOptionLabel={(option) => option.employee_name}
              onChange={(e, newValue) => setSelectedEmployee(newValue?.psid || '')}
              renderInput={(params) => <TextField {...params} label="Select Employee" />}
              fullWidth
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Leave Start Date</label>
            <input
              type="date"
              className='w-full border rounded p-2'
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Leave End Date</label>
            <input
              type="date"
              className='w-full border rounded p-2'
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <input
              type="checkbox"
              className='h-5 w-5'
              checked={is_half_day}
              onChange={() => setIsHalfDay(!is_half_day)}
            />
            <label className='block text-sm font-medium mb-1'>Half day</label>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Total Days</label>
            <div className='p-2 border rounded bg-gray-100'>{total_days}</div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Leave Type</label>
            <select
              className='w-full border rounded p-2'
              value={leave_type}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="Leave">Leave</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>
        </div>

        <div className='pt-4'>
          <button
            onClick={handleSubmit}
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
          >
            Submit
          </button>
        </div>

        <div className="mt-8">
          <TableComponent holidayData={holidayData} onDelete={deleteHoliday} />
        </div>
      </div>
    </div>
  );
};

export default Page;
