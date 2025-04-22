"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  Shield,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Shapes,
  Database,
  FileChartLine,
  UserRoundPlus,
  MessageSquare
} from "lucide-react"

export default function HorizontalNavbar() {
  const menus = [
    {
      title: "User Menu",
      items: [
        { href: "/appx/feedback", icon: <MessageSquare />, label: "My DashBoard" },
        { href: "/appx/login", icon: <UserRoundPlus />, label: "Print DashBoard" },
        { href: "/appx/feedback", icon: <MessageSquare />, label: "Data Quality" },
        { href: "/appx/login", icon: <UserRoundPlus />, label: "Edit User Role" },
        { href: "/appx/feedback", icon: <MessageSquare />, label: "Assign Team" },
        { href: "/appx/login", icon: <UserRoundPlus />, label: "Feedback & Comments" },
        { href: "/appx/login", icon: <UserRoundPlus />, label: "Log out" },
      ]
    },
    {
      title: "User Inputs",
      items: [
        { href: "/apps/add_project", icon: <FileChartLine />, label: "Add Project" },
        { href: "/appx/assign_projects", icon: <FileCheck2 />, label: "Assign Project" },
        { href: "/appx/lead_exception", icon: <Shield />, label: "Add Efforts" },
        { href: "/appx/lead_exception", icon: <Shield />, label: "Register Holidays" },
        { href: "/appx/lead_exception", icon: <Shield />, label: "Add Lead Exceptions" }
      ]
    },
    {
      title: "Add/Modify Data",
      items: [
        { href: "/appx/region", label: "Employee Details" },
        { href: "/appx/region", label: "Employee Team Details" },
        { href: "/appx/region", label: "Region Owner" },
        { href: "/appx/project_funding", label: "Project Funding" },
        { href: "/appx/portfolio", label: "Portfolio" },
        { href: "/appx/project_type", label: "Project Type" },
        { href: "/appx/project_type_12", label: "Project Type L2" },
        { href: "/appx/task", label: "Project Task" },
        { href: "/appx/sub_task", label: "Project Sub-task" },
        { href: "/appx/project_status", label: "Project Status" }
      ].map(item => ({
        ...item,
        icon: <Database />
      }))
    },
    {
      title: "Reports",
      items: [
        { href: "/appx/employees", icon: <Users />, label: "My Team" },
        { href: "/appx/projects", icon: <Shapes />, label: "Projects" },
        { href: "/appx/assignments", icon: <Shapes />, label: "Assignments" },
        { href: "/appx/assignments", icon: <Shapes />, label: "My Efforts" }
      ]
    }
  ]

  return (
    <div className="w-full bg-gray-800 text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4 font-semibold">
        {/* Left: Logo and Text */}
        <div className="flex items-center gap-4">
          <Image src="/hsbc_logo.png" alt="Logo" width={180} height={60} />
          <Link href="/appx">
            <h1 className="text-2xl tracking-wide font-bold">PROPEL</h1>
          </Link>
        </div>

        {/* Center: Navigation Menus */}
        <div className="flex gap-10 relative justify-center items-center">
          {menus.map((menu, index) => (
            <div key={index} className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-300 transition">
                {menu.title}
                <ChevronDown size={18} />
              </button>
              <div className="absolute top-full left-0 bg-gray-700 mt-2 rounded-md shadow-lg min-w-max z-50 hidden group-hover:block">
                {menu.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-2 px-5 py-3 hover:bg-gray-600 transition whitespace-nowrap"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: User Profile */}
        <div className="text-white font-medium whitespace-nowrap">
          User Profile
        </div>
      </div>
    </div>
  )
}
