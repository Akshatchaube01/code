'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';
import TableComponent from '@/components/gra-propel/add_Modify_data/project_type_L2/table-projectTypeL2';

interface OptionType {
  id: number;
  name: string;
}

interface ProjectTypeL2 {
  project_type_12_id: number;
  project_type_12_name: string;
  project_type_id: number;
  project_type_name?: string;
}

const ProjectTypeL2Page = () => {
  const [taskName, setTaskName] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState<OptionType | null>(null);
  const [projectTypeList, setProjectTypeList] = useState<OptionType[]>([]);
  const [projectTypeL2List, setProjectTypeL2List] = useState<ProjectTypeL2[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/propel/project_types/')
      .then((res) => {
        setProjectTypeList(
          res.data.data.map((item: any) => ({
            id: item.project_type_id,
            name: item.project_type_name,
          }))
        );
      })
      .catch((err) => console.log('Project Type load error', err));
  }, []);

  const fetchProjectTypeL2 = () => {
    axios
      .get('http://127.0.0.1:8000/propel/project_type_12/')
      .then((res) => {
        setProjectTypeL2List(res.data.data);
      })
      .catch((err) => {
        console.log('Project Type L2 fetch error', err);
      });
  };

  useEffect(() => {
    fetchProjectTypeL2();
  }, []);

  const addOrUpdate = async () => {
    if (!taskName || !selectedProjectType) return;

    const payload = {
      project_type_12_name: taskName,
      project_type_id: selectedProjectType.id,
    };

    if (editingId === null) {
      // POST
      await axios.post('http://127.0.0.1:8000/propel/project_type_12/', payload);
    } else {
      // PUT
      await axios.put(`http://127.0.0.1:8000/propel/project_type_12/${editingId}`, payload);
      setEditingId(null);
    }

    setTaskName('');
    setSelectedProjectType(null);
    fetchProjectTypeL2();
  };

  const deleteProjectTypeL2 = async (id: number) => {
    await axios.delete(`http://127.0.0.1:8000/propel/project_type_12/${id}`);
    fetchProjectTypeL2();
  };

  const editProjectTypeL2 = (item: ProjectTypeL2) => {
    setTaskName(item.project_type_12_name);
    setSelectedProjectType({
      id: item.project_type_id,
      name: item.project_type_name || '',
    });
    setEditingId(item.project_type_12_id);
  };

  return (
    <div className='p-6 max-w-8xl mx-auto'>
      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <h2 className='text-2xl font-bold mb-6 text-blue-800'>Add or Update Project Type L2</h2>
        <input
          type='text'
          placeholder='Enter project type L2 name'
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className='border p-2 rounded w-full mb-4'
        />

        <Autocomplete
          options={projectTypeList}
          getOptionLabel={(option) => option.name}
          value={selectedProjectType}
          onChange={(e, value) => setSelectedProjectType(value)}
          renderInput={(params) => (
            <TextField {...params} label='Select Project Type' fullWidth size='small' />
          )}
        />

        <button
          onClick={addOrUpdate}
          className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          {editingId === null ? 'Add' : 'Update'}
        </button>
      </div>

      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <TableComponent
          data={projectTypeL2List}
          onEdit={editProjectTypeL2}
          onDelete={deleteProjectTypeL2}
        />
      </div>
    </div>
  );
};

export default ProjectTypeL2Page;
