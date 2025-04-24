"use client"

import { useState } from "react"

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState("")

  const roles = [
    "Admin",
    "Team Lead",
    "Developer",
    "QA Tester",
    "Project Manager"
  ]

  const handleSelect = (role: string) => {
    setSelectedRole(role)
    // You can add logic here to save role or redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-xl shadow-lg p-10 w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-6">Select Your Role</h2>
        <div className="flex flex-col gap-4">
          {roles.map((role, index) => (
            <button
              key={index}
              onClick={() => handleSelect(role)}
              className={`py-3 px-6 rounded-lg border border-gray-600 hover:bg-gray-700 transition ${
                selectedRole === role ? "bg-gray-700 text-yellow-300" : ""
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {selectedRole && (
          <div className="mt-6 text-green-400 font-semibold">
            Selected Role: {selectedRole}
          </div>
        )}
      </div>
    </div>
  )
}
