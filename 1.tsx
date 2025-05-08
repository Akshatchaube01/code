'use client'

import React, { useEffect, useState } from 'react'
import * as Select from '@radix-ui/react-select'
import axios from '@/components/gra-propel/CustomAxios'
import TableComponent from '@/components/gra-propel/userInputs/table-leadException'
import { CheckIcon, ChevronDownIcon, UserCheck } from 'lucide-react'

interface LeadOption {
  value: string
  label: string
}

interface LeadException {
  psid: string
  employee_name: string
}

const Page = () => {
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null)
  const [search, setSearch] = useState('')
  const [leadOptions, setLeadOptions] = useState<LeadOption[]>([])
  const [exceptions, setExceptions] = useState<LeadException[]>([])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/propel/employees/', {
          params: {
            order: 'descending',
            field: 'gcb',
            condition: 'gt',
            value: 4,
            include_special_leads: false,
            functional_manager_flow: false
          }
        })

        const options = res.data.data.map((lead: any) => ({
          value: lead.psid,
          label: `${lead.employee_name} (${lead.psid})`
        }))

        setLeadOptions(options)
      } catch (err) {
        console.error(err)
      }
    }

    fetchLeads()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/propel/lead_exceptions/')
        setExceptions(res.data.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const handleAdd = async () => {
    if (!selectedLead) return

    try {
      await axios.post('http://127.0.0.1:8000/propel/lead_exceptions/', {
        psid: selectedLead.value,
        employee_name: selectedLead.label
      })

      setExceptions((prev) => [
        ...prev,
        { psid: selectedLead.value, employee_name: selectedLead.label }
      ])

      setSelectedLead(null)
      setSearch('')
    } catch (err) {
      console.error(err)
    }
  }

  const filteredOptions = leadOptions.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='p-6 max-w-8xl mx-auto'>
      <div className='border rounded p-6 shadow-md mb-6 bg-white'>
        <h2 className='text-2xl font-bold mb-6 text-center text-blue-800'>
          Add Employee To Project Lead1/Project Lead2 Exception List
        </h2>

        <h3 className='mt-4 font-bold text-gray-600'>Select Employee</h3>

        <Select.Root
          value={selectedLead?.value}
          onValueChange={(val) => {
            const selected = leadOptions.find((opt) => opt.value === val)
            setSelectedLead(selected || null)
          }}
        >
          <Select.Trigger className='flex items-center justify-between w-full px-3 py-2 border rounded shadow-sm'>
            <Select.Value placeholder='Select Lead Exception' />
            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className='bg-white border border-gray-300 rounded shadow z-50'>
              <div className='px-3 py-2'>
                <input
                  className='w-full px-2 py-1 border border-gray-300 rounded text-sm'
                  placeholder='Search...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select.Viewport className='p-2 max-h-60 overflow-y-auto'>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className='px-3 py-2 rounded cursor-pointer hover:bg-gray-100 flex items-center justify-between'
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                      <Select.ItemIndicator>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))
                ) : (
                  <div className='px-3 py-2 text-sm text-gray-500'>No matches</div>
                )}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <button
          onClick={handleAdd}
          className='mb-6 flex gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          <UserCheck />
          Add
        </button>

        <div>
          <TableComponent data={exceptions} />
        </div>
      </div>
    </div>
  )
}

export default Page
