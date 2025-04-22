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

  return (
    <div className="w-full bg-gray-800 text-white shadow-md fixed top-0 z-50">
      <div className="flex flex-wrap justify-between items-center px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <Image src="/hsbc_logo.png" alt="Logo" width={120} height={50} />
          <Link href="/appx">
            <h1 className="text-xl md:text-2xl tracking-wide font-bold">PROPEL</h1>
          </Link>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-6 md:gap-10 overflow-x-auto">
          {[
            {
              title: "User Menu",
              items: [
                { href: "/appx/login", icon: <UserRoundPlus />, label: "Sign In" },
                { href: "/appx/feedback", icon: <MessageSquare />, label: "Feedback" }
              ]
            },
            {
              title: "User Inputs",
              items: [
                { href: "/apps/add project", icon: <FileChartLine />, label: "Add Project" },
                { href: "/appx/assign projects", icon: <FileCheck2 />, label: "Assign Project" },
                { href: "/appx/lead_exception", icon: <Shield />, label: "Add Lead Exceptions" }
              ]
            },
            {
              title: "Modify Data",
              items: [
                { href: "/appx/region", label: "Region Owner" },
                { href: "/appx/project_funding", label: "Project Funding" },
                { href: "/appx/portfolio", label: "Portfolio" },
                { href: "/appx/project_type", label: "Project Type" },
                { href: "/appx/project_type_12", label: "Project Type 12" },
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
                { href: "/appx/assignments", icon: <Shapes />, label: "Assignments" }
              ]
            }
          ].map((menu, index) => (
            <div key={index} className="relative">
              <button
                onClick={() => toggleMenu(menu.title)}
                className="flex items-center gap-1 whitespace-nowrap hover:text-gray-300 transition"
              >
                {menu.title}
                {openMenu === menu.title ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openMenu === menu.title && (
                <div className="absolute top-full left-0 bg-gray-700 mt-2 rounded-md shadow-lg z-50 min-w-max">
                  {menu.items.map((item, idx) => (
                    <Link
                      href={item.href}
                      key={idx}
                      className="flex items-center gap-2 px-5 py-3 hover:bg-gray-600 transition text-sm md:text-base whitespace-nowrap"
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
