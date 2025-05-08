'use client'

import axios from '@/components/gra-propel/CustomAxios';
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
  holiday_start_date: string;
  holiday_end_date: string;
  leave_count: number;
  holiday_halfday: boolean;
  holiday_type: string;
  disable: boolean;
  holiday_id: number;
}

const Page = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [holiday_start_date, setStartDate] = useState('');
  const [holiday_end_date, setEndDate] = useState('');
  const [holiday_halfday, setIsHalfDay] = useState(false);
  const [holiday_type, setLeaveType] = useState('Leave');
  const [total_days, setTotalDays] = useState(0);
  const [holidayData, setHolidayData] = useState<Holiday[]>([]);

  useEffect(() => {
    fetchHolidayData();
    axios.get('http://127.0.0.1:8000/propel/employees')
      .then(res => setEmployees(res.data.data))
      .catch(err => console.log("error in loading"));
  }, []);

  useEffect(() => {
    if (holiday_start_date && holiday_end_date) {
      let days = differenceInCalendarDays(new Date(holiday_end_date), new Date(holiday_start_date)) + 1;
      if (days < 0) days = 0;
      setTotalDays(holiday_halfday ? days / 2 : days);
    } else {
      setTotalDays(0);
    }
  }, [holiday_start_date, holiday_end_date, holiday_halfday]);

  const handleSubmit = async () => {
    try {
      const payload = {
        rec_id: 0,
        psid: selectedEmployee,
        holiday_start_date,
        holiday_end_date,
        holiday_halfday,
        holiday_type
      };
      await axios.post('http://127.0.0.1:8000/propel/register_holidays/', payload);
      alert('Leave registered successfully');
      fetchHolidayData();
    } catch (err) {
      console.log(err);
      alert('Error submitting leave');
    }
  };

  const fetchHolidayData = () => {
    axios.get('http://127.0.0.1:8000/propel/register_holidays/')
      .then(res => setHolidayData(res.data))
      .catch(err => console.log('Error in loading data'));
  };

  return (
    <div className='p-6 max-w-8xl mx-auto'>
      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4 items-end'>
          <div className='col-span-2'>
            <label className='text-blue-700 font-bold text-2xl'>Register Holidays</label>
            <Autocomplete
              options={employees || []}
              value={Array.isArray(employees) ? employees.find((e) => e.psid === selectedEmployee) || null : null}
              getOptionLabel={(option) => option.employee_name || ''}
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
              value={holiday_start_date}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Leave End Date</label>
            <input
              type="date"
              className='w-full border rounded p-2'
              value={holiday_end_date}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <input
              type="checkbox"
              className='h-5 w-5'
              checked={holiday_halfday}
              onChange={() => setIsHalfDay(!holiday_halfday)}
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
              value={holiday_type}
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

        <div className='mt-8'>
          <TableComponent holidayData={holidayData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
