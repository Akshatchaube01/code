'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';

interface OptionType {
  id: number;
  name: string;
}

interface ProjectTypeL2 {
  id: number;
  project_type_12_name: string;
  project_types: string[];
}

const ProjectTypeL2Page = () => {
  const [project_type_12_name, setProjectTypeL2Name] = useState('');
  const [selectedProjectType, setSelectedProjectType] = useState<OptionType | null>(null);
  const [projectTypeList, setProjectTypeList] = useState<OptionType[]>([]);
  const [projectTypeL2List, setProjectTypeL2List] = useState<ProjectTypeL2[]>([]);
  const [apiUrls, setApiUrls] = useState<any>(null);
  const [getById, setGetById] = useState('');
  const [singleItem, setSingleItem] = useState<ProjectTypeL2 | null>(null);

  // Load route map (optional)
  useEffect(() => {
    const fetchUrls = async () => {
      const res = await fetch('/api-routes.json');
      const data = await res.json();
      setApiUrls(data);
    };
    fetchUrls();
  }, []);

  const fetchProjectTypeList = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/propel/project_types/');
      setProjectTypeList(
        res.data.data.map((item: any) => ({
          id: Number(item.project_type_id),
          name: item.project_type_name,
        }))
      );
    } catch (err) {
      console.log('Error loading project types', err);
    }
  };

  const fetchProjectTypeL2List = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/propel/project_type_12/');
      setProjectTypeL2List(res.data.data);
    } catch (err) {
      console.log('Error loading project type L2 list', err);
    }
  };

  const fetchProjectTypeL2ById = async () => {
    if (!getById) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/propel/project_type_12/${getById}`);
      setSingleItem(res.data);
    } catch (err) {
      console.log('Error fetching by ID', err);
      setSingleItem(null);
    }
  };

  useEffect(() => {
    fetchProjectTypeList();
    fetchProjectTypeL2List();
  }, []);

  const addProjectTypeL2 = async () => {
    if (!project_type_12_name.trim()) return;

    const payload = {
      project_type_12_name,
      project_types: [selectedProjectType?.name || ''],
    };

    try {
      const res = await axios.post('http://127.0.0.1:8000/propel/project_type_12/', payload);
      console.log('Created:', res.data);
      setProjectTypeL2Name('');
      setSelectedProjectType(null);
      fetchProjectTypeL2List();
    } catch (err) {
      console.log('Error creating project_type_12', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Create Section */}
      <div className="border rounded p-6 shadow-md mb-6 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Add New Project Type L2</h2>
        <input
          type="text"
          placeholder="Enter new project type L2"
          value={project_type_12_name}
          onChange={(e) => setProjectTypeL2Name(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <Autocomplete
          options={projectTypeList}
          getOptionLabel={(option) => option.name}
          value={selectedProjectType}
          onChange={(event, newValue) => setSelectedProjectType(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Project Type" variant="outlined" fullWidth size="small" />
          )}
        />
        <button
          onClick={addProjectTypeL2}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* GET by ID */}
      <div className="border rounded p-6 shadow-md mb-6 bg-white">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Get Project Type L2 by ID</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="Enter ID"
            value={getById}
            onChange={(e) => setGetById(e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <button
            onClick={fetchProjectTypeL2ById}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Fetch
          </button>
        </div>
        {singleItem && (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>ID:</strong> {singleItem.id}</p>
            <p><strong>Name:</strong> {singleItem.project_type_12_name}</p>
            <p><strong>Project Types:</strong> {singleItem.project_types.join(', ')}</p>
          </div>
        )}
      </div>

      {/* List Table */}
      <div className="border rounded p-6 shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">All Project Type L2 Entries</h2>
        <table className="min-w-full border text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Types</th>
            </tr>
          </thead>
          <tbody>
            {projectTypeL2List.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.project_type_12_name}</td>
                <td className="border px-4 py-2">{item.project_types.join(', ')}</td>
              </tr>
            ))}
            {projectTypeL2List.length === 0 && (
              <tr>
                <td colSpan={3} className="border px-4 py-2 text-gray-500">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTypeL2Page;
