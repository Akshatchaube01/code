'use client'

import React, { useEffect, useState } from 'react';
import axios from '@/components/gra-propel/CustomAxios';
import { ProjectL2Table } from '@/components/gra-propel/add_Modify_data/project_type_L2/table-projectTym';
import { Autocomplete, TextField } from '@mui/material';

interface ProjectL2 {
  project_type_id: number;
  project_type_name: string;
}

interface OptionType {
  id: number;
  name: string;
}

const ProjectL2Page = () => {
  const [apiurls, setApiUrls] = useState<any>(null);
  const [projectTypeName, setProjectTypeName] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState<OptionType | null>(null);
  const [projectL2List, setProjectL2List] = useState<ProjectL2[]>([]);
  const [projectTypeList, setProjectTypeList] = useState<OptionType[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      const res = await fetch('/api-routes.json');
      const data = await res.json();
      setApiUrls(data);
    };
    fetchUrls();
  }, []);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/propel/project_type_12/')
      .then((res) => {
        setProjectL2List(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log('Error in loading data');
      });
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [typesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/propel/project_type_12/'),
        ]);
        setProjectTypeList(
          typesRes.data.data.map((item: any) => ({
            id: Number(item.project_type_id),
            name: item.project_type_name,
          }))
        );
      } catch (error) {
        console.log('Error', error);
      }
    };
    fetchDropdownData();
  }, []);

  const addProjectL2 = async () => {
    if (projectTypeName.length === 0) return;
    const payload = {
      project_type_id: selectedProjectType?.id,
      project_type_name: projectTypeName,
    };

    const res = await axios.post('http://127.0.0.1:8000/propel/project_type_12/', payload);
    setProjectTypeName('');
    setSelectedProjectType(null);
    console.log(res);
  };

  return (
    <div className='p-6 max-w-8xl mx-auto'>
      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <h2 className='text-2xl font-bold mb-6 text-blue-800'>Add New Project</h2>
        <input
          type='text'
          placeholder='Enter new project type name'
          value={projectTypeName}
          onChange={(e) => setProjectTypeName(e.target.value)}
          className='leading-relaxed tracking-wider border p-2 rounded w-full mb-4'
        />
        <h2 className='text-2xl font-bold mb-6 text-blue-800'>Project Type ID</h2>
        <Autocomplete
          options={projectTypeList}
          getOptionLabel={(option) => option.name}
          value={selectedProjectType}
          onChange={(event, newValue) => setSelectedProjectType(newValue)}
          renderInput={(params) => (
            <TextField {...params} label='Select Project Type ID' variant='outlined' fullWidth size='small' />
          )}
        />
        <button
          onClick={addProjectL2}
          className='mt-4 leading-relaxed tracking-wider bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Add ProjectL2
        </button>
      </div>

      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <ProjectL2Table data={projectL2List} />
      </div>
    </div>
  );
};

export default ProjectL2Page;
