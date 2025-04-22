"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users, Shield, FileCheck2, ChevronDown, ChevronUp, Shapes,
  Database, FileChartLine, UserRoundPlus, MessageSquare
} from 'lucide-react'

export default function HorizontalNavbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (menu: string) => {
    setOpenMenu(prev => (prev === menu ? null : menu))
  }

  const menus = [
    {
      title: "User Menu",
      items: [
        { href: "/appx/login", icon: <UserRoundPlus />, label: "Sign In" },
        { href: "/appx/feedback", icon: <MessageSquare />, label: "Feedback" },
      ]
    },
    {
      title: "User Inputs",
      items: [
        { href: "/apps/add_project", icon: <FileChartLine />, label: "Add Project" },
        { href: "/apps/assign_projects", icon: <FileCheck2 />, label: "Assign Project" },
        { href: "/appx/lead_exception", icon: <Shield />, label: "Add Lead Exceptions" }
      ]
    },
    {
      title: "Modify Data",
      items: [
        { href: "/appx/region", icon: <Database />, label: "Region Owner" },
        { href: "/appx/project_funding", icon: <Database />, label: "Project Funding" },
        { href: "/apps/portfolio", icon: <Database />, label: "Portfolio" },
        { href: "/appx/project_type", icon: <Database />, label: "Project Type" },
        { href: "/appx/project_type_12", icon: <Database />, label: "Project Type 12" },
        { href: "/apps/task", icon: <Database />, label: "Project Task" },
        { href: "/appx/sub_task", icon: <Database />, label: "Project Sub-task" },
        { href: "/appx/project_status", icon: <Database />, label: "Project Status" }
      ]
    },
    {
      title: "Reports",
      items: [
        { href: "/appx/employees", icon: <Users />, label: "My Team" },
        { href: "/appx/projects", icon: <Shapes />, label: "Projects" },
        { href: "/appx/assignments", icon: <Shapes />, label: "Assignments" }
      ]
    }
  ]

  return (
    <div className="w-screen bg-gray-800 text-white shadow-md overflow-x-auto">
      <div className="flex flex-nowrap justify-between items-center px-4 py-4 text-base font-medium w-full max-w-full gap-8">
        {/* Logo and title */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Image src="/hsbc_logo.png" alt="Logo" width={120} height={50} />
          <Link href="/appx" className="text-xl font-bold tracking-wide whitespace-nowrap">PROPEL</Link>
        </div>

        {/* Menu */}
        <div className="flex gap-6 flex-shrink-0">
          {menus.map((menu, index) => (
            <div key={index} className="relative flex-shrink-0">
              <button
                onClick={() => toggleMenu(menu.title)}
                className="flex items-center gap-1 hover:text-gray-300 transition whitespace-nowrap"
              >
                {menu.title}
                {openMenu === menu.title ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openMenu === menu.title && (
                <div className="absolute top-full left-0 bg-gray-700 mt-2 rounded-md shadow-lg z-50 min-w-max">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="flex items-center gap-2 px-5 py-3 hover:bg-gray-600 transition whitespace-nowrap"
                    >
                      <span className="w-5">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
