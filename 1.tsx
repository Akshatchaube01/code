'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/components/gra-propel/CustomAxios'
import { ProjectL2Table } from '@/components/gra-propel/add_Modify_data/project_type_L2/table-projectTym'
import { Autocomplete, TextField } from '@mui/material'

interface RawProjectL2 {
  project_type_12_id: number
  project_type_12_name: string
  project_type_id: number
}

interface ProjectTypeOption {
  project_type_id: number
  project_type_name: string
}

const ProjectL2Page = () => {
  const [projectTypeName, setProjectTypeName] = useState('')
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectTypeOption | null>(null)
  const [rawProjectL2List, setRawProjectL2List] = useState<RawProjectL2[]>([])
  const [projectTypes, setProjectTypes] = useState<ProjectTypeOption[]>([])

  useEffect(() => {
    axios.get('/propel/project_type_12/').then((res) => {
      setRawProjectL2List(res.data.data)
    })
  }, [])

  useEffect(() => {
    axios.get('/propel/project_types/').then((res) => {
      setProjectTypes(res.data.data)
    })
  }, [])

  const addProjectL2 = async () => {
    if (!projectTypeName || !selectedProjectType) return

    const payload = {
      project_type_id: selectedProjectType.project_type_id,
      project_type_12_name: projectTypeName,
    }

    try {
      await axios.post('/propel/project_type_12/', payload)
      setProjectTypeName('')
      setSelectedProjectType(null)

      const updated = await axios.get('/propel/project_type_12/')
      setRawProjectL2List(updated.data.data)
    } catch (error) {
      console.error('Error adding project:', error)
    }
  }

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

        <h2 className='text-2xl font-bold mb-6 text-blue-800'>Project Type</h2>
        <Autocomplete
          options={projectTypes}
          getOptionLabel={(option) => option?.project_type_name ?? ''}
          value={selectedProjectType}
          onChange={(event, newValue) => setSelectedProjectType(newValue)}
          isOptionEqualToValue={(option, value) => option.project_type_id === value.project_type_id}
          renderInput={(params) => (
            <TextField {...params} label='Select Project Type' variant='outlined' fullWidth size='small' />
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
        <ProjectL2Table
          data={rawProjectL2List.map(item => ({
            project_type_id: item.project_type_id,
            project_type_name: item.project_type_12_name,
          }))}
          projectTypes={projectTypes}
        />
      </div>
    </div>
  )
}

export default ProjectL2Page
