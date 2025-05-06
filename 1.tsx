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
