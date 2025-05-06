'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type ProjectTypeL2 = {
  id: number;
  project_type_12_name: string;
  project_types: string[];
};

const ProjectTypeL2Page = () => {
  const [projectTypeL2Data, setProjectTypeL2Data] = useState<ProjectTypeL2[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const [getById, setGetById] = useState('');
  const [singleItem, setSingleItem] = useState<ProjectTypeL2 | null>(null);

  const API_URL = '/propel/project_type_12/';

  const fetchL2 = async () => {
    try {
      const res = await axios.get(API_URL);
      setProjectTypeL2Data(res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchL2();
  }, []);

  const handleSubmit = async () => {
    if (!name || !type) return;

    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}${editingId}`, {
          project_type_12_name: name,
          project_types: [type],
        });
      } else {
        await axios.post(API_URL, {
          project_type_12_name: name,
          project_types: [type],
        });
      }

      setName('');
      setType('');
      setEditingId(null);
      fetchL2();
    } catch (err) {
      console.error('Submit Error:', err);
    }
  };

  const handleEdit = (item: ProjectTypeL2) => {
    setEditingId(item.id);
    setName(item.project_type_12_name);
    setType(item.project_types[0] || '');
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}${id}`);
      fetchL2();
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  const fetchById = async () => {
    if (!getById) return;
    try {
      const res = await axios.get(`${API_URL}${getById}`);
      setSingleItem(res.data);
    } catch (err) {
      setSingleItem(null);
      console.error('Error fetching by ID', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Add / Edit Section */}
      <div className="border rounded p-6 shadow-md mb-6 bg-white">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          {editingId ? 'Edit Project Type L2' : 'Add New Project Type L2'}
        </h2>
        <input
          type="text"
          placeholder="Project Type L2 Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select Project Type</option>
          <option value="Tool Development and maintenance">Tool Development and maintenance</option>
          <option value="Model Monitoring">Model Monitoring</option>
          <option value="Model Development (New)">Model Development (New)</option>
          <option value="Model Execution">Model Execution</option>
          <option value="Model Implementation">Model Implementation</option>
          <option value="Governance and Control">Governance and Control</option>
          <option value="Generic Activities">Generic Activities</option>
          <option value="Regulatory Engagement">Regulatory Engagement</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      {/* GET by ID Section */}
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
            onClick={fetchById}
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

      {/* Table Section */}
      <div className="border rounded p-6 shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">All Project Type L2 Entries</h2>
        <table className="min-w-full border text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Project Type L2 Name</th>
              <th className="border px-4 py-2">Project Types</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectTypeL2Data.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.project_type_12_name}</td>
                <td className="border px-4 py-2">{item.project_types?.join(', ')}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projectTypeL2Data.length === 0 && (
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTypeL2Page;
