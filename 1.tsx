'use client';

import React, { useEffect, useState } from 'react';
import AssignmentTable from '@/components/gra-propel/reports/table-assignments';
import axios from 'axios';

type Assignment = {
  assignment_id: number;
  psid: string;
  assigned_fte: number;
  start_date: string;
  end_date: string;
  disable: boolean;
  is_past: boolean;
};

export default function Page() {
  const [data, setData] = useState<Assignment[]>([]);

  useEffect(() => {
    axios.get('/propel/assignments/')
      .then((res) => {
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load assignments', err));
  }, []);

  return (
    <div className='p-6 max-w-8xl mx-auto'>
      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <h2 className='text-2xl font-bold mb-6 text-center text-blue-800'>
          Assignments
        </h2>
        <div className='border rounded p-6 shadow-sm mb-6 bg-white'>
          <AssignmentTable data={data} />
        </div>
      </div>
    </div>
  );
}
