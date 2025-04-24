"use client"

import { useState } from "react"

export default function RoleSelectionScreen() {
  const [role, setRole] = useState("")

  const roles = ["Admin", "Team Lead", "Developer", "QA Tester", "Project Manager"]

  const handleProceed = () => {
    if (role) {
      // Add your navigation or logic here
      alert(`Proceeding as ${role}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-10 rounded-xl shadow-xl max-w-lg w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Propel</h1>
        <p className="text-sm text-gray-300 tracking-wide">
          Project Resource Optimization Platform Enabling Linkages
        </p>
        <p className="text-xs text-gray-400">
          Propel supports Google Chrome and Microsoft Edge (except IE mode).
          <br />
          If Microsoft Edge opens in IE mode, click the three dots in the top-right,
          then select <b>"Open sites in Microsoft Edge"</b> from the "More Tools" menu.
        </p>
        <div>
          <label className="block mb-2 text-lg font-medium">Select your role to continue</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          >
            <option value="" disabled>Select a role</option>
            {roles.map((r, index) => (
              <option key={index} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {role && (
          <>
            <p className="text-green-400 font-semibold">Selected Role: {role}</p>
            <button
              onClick={handleProceed}
              className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-2 px-6 rounded-lg transition duration-200"
            >
              Proceed
            </button>
          </>
        )}
      </div>
    </div>
  )
}
