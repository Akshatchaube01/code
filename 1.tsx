'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ReactTabulator } from 'react-tabulator'
import type { ReactTabulatorOptions } from 'react-tabulator'
import 'react-tabulator/lib/styles.css'
import 'tabulator-tables/dist/css/tabulator.min.css'
import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css'
import axios from 'axios'

interface ProjectL2 {
  project_type_id: number
  project_type_name: string
}

interface ProjectTypeOption {
  project_type_id: number
  project_type_name: string
}

interface ProjectL2Props {
  data: ProjectL2[]
  projectTypes: ProjectTypeOption[]
}

const Table = ({ data, projectTypes }: ProjectL2Props) => {
  const tableRef = useRef<any>(null)
  const [tableData, setTableData] = useState<ProjectL2[]>(data)

  useEffect(() => {
    setTableData(data)
  }, [data])

  const handleDelete = async (rowData: ProjectL2) => {
    setTableData((prev) => prev.filter((r) => r.project_type_id !== rowData.project_type_id))
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/propel/tasks/${rowData.project_type_id}`)
      console.log(res)
    } catch (error) {
      console.log('Error in delete', error)
    }
  }

  const handleSave = async (rowData: ProjectL2) => {
    try {
      await axios.put('http://127.0.0.1:8000/propel/tasks/', {
        task_id: rowData.project_type_id,
        task_name: rowData.project_type_name,
      })
      console.log('Save button clicked')
    } catch (error) {
      console.log('Error in save', error)
    }
  }

  const dropdownMap = projectTypes.reduce((acc, item) => {
    acc[item.project_type_id] = item.project_type_name
    return acc
  }, {} as Record<number, string>)

  const columns = [
    {
      title: 'Project Type',
      field: 'project_type_id',
      sorter: 'number',
      headerFilter: 'select',
      editor: 'select',
      editorParams: {
        values: dropdownMap,
      },
      formatter: (cell: any) => {
        const id = cell.getValue()
        return dropdownMap[id] || `ID: ${id}`
      },
    },
    {
      title: 'Project Type Name',
      field: 'project_type_name',
      sorter: 'string',
      headerFilter: 'input',
      editor: 'input',
    },
    {
      title: 'Actions',
      field: 'actions',
      width: 150,
      hozAlign: 'center',
      formatter: () =>
        `<button class='save-btn bg-blue-600 text-white px-2 py-1 rounded mr-1'>Save</button>
         <button class='delete-btn bg-red-600 text-white px-2 py-1 rounded'>Delete</button>`,
      cellClick: function (e: any, cell: any) {
        const rowData: ProjectL2 = cell.getRow().getData()
        const target = e.target
        if (target.classList.contains('delete-btn')) {
          handleDelete(rowData)
        } else if (target.classList.contains('save-btn')) {
          handleSave(rowData)
        }
      },
    },
  ]

  const options: ReactTabulatorOptions = {
    layout: 'fitColumns',
    pagination: true,
    paginationSize: 8,
    movableColumns: true,
    resizableRows: true,
    reactiveData: true,
    height: '330px',
  }

  return (
    <div>
      <ReactTabulator ref={tableRef} data={tableData} columns={columns} options={options} />
    </div>
  )
}

export const ProjectL2Table = (props: ProjectL2Props) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <section className='p-4 bg-white rounded shadow-lg'>
      <h2 className='text-2xl font-bold underline mb-4'>Edit Task</h2>
      <Table {...props} />
    </section>
  )
}


'use client'

import React, { useEffect, useState } from 'react'
import axios from '@/components/gra-propel/CustomAxios'
import { ProjectL2Table } from '@/components/gra-propel/add_Modify_data/project_type_L2/table-projectTym'
import { Autocomplete, TextField } from '@mui/material'

interface ProjectL2 {
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
  const [projectL2List, setProjectL2List] = useState<ProjectL2[]>([])
  const [projectTypes, setProjectTypes] = useState<ProjectTypeOption[]>([])

  useEffect(() => {
    axios.get('/propel/project_type_12/').then((res) => {
      setProjectL2List(res.data.data)
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
      setProjectL2List(updated.data.data)
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
        <ProjectL2Table data={projectL2List} projectTypes={projectTypes} />
      </div>
    </div>
  )
}

export default ProjectL2Page
