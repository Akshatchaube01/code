"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  FileCheck2,
  ChevronDown,
  Shapes,
  Database,
  FileChartLine,
  UserRoundPlus,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

export default function ResponsiveNavbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 1000);
  };

  const menus = [
    {
      title: "ADMINISTRATOR",
      items: [
        { href: "/gra-propel/data_quality", icon: <MessageSquare />, label: "Data Quality" },
        { href: "/gra-propel/manage_users", icon: <UserRoundPlus />, label: "Edit User Role" },
        { href: "/gra-propel/assign_team", icon: <MessageSquare />, label: "Assign Team" },
      ],
    },
    {
      title: "USER INPUTS",
      items: [
        { href: "/gra-propel/add_project", icon: <FileChartLine />, label: "Add Project" },
        { href: "/gra-propel/assign_projects", icon: <FileCheck2 />, label: "Assign Project" },
        { href: "/gra-propel/add_efforts", icon: <Shield />, label: "Add Efforts" },
        { href: "/gra-propel/register_holiday", icon: <Shield />, label: "Register Holidays" },
        { href: "/gra-propel/lead_exception", icon: <Shield />, label: "Add Lead Exceptions" },
      ],
    },
    {
      title: "ADD/MODIFY DATA",
      items: [
        { href: "/gra-propel/region", label: "Region Owner" },
        { href: "/gra-propel/project_funding", label: "Project Funding" },
        { href: "/gra-propel/portfolio", label: "Portfolio" },
        { href: "/gra-propel/project_type", label: "Project Type" },
        { href: "/gra-propel/project_type_L2", label: "Project Type L2" },
        { href: "/gra-propel/task", label: "Project Task" },
        { href: "/gra-propel/sub_task", label: "Project Sub-task" },
        { href: "/gra-propel/project_status", label: "Project Status" },
      ].map((item) => ({
        ...item,
        icon: <Database />,
      })),
    },
    {
      title: "REPORTS",
      items: [
        { href: "/gra-propel/employees", icon: <Users />, label: "My Team" },
        { href: "/gra-propel/projects", icon: <Shapes />, label: "Projects" },
        { href: "/gra-propel/assignments", icon: <Shapes />, label: "Assignments" },
        { href: "/gra-propel/my_efforts", icon: <Shapes />, label: "My Efforts" },
      ],
    },
  ];

  const userProfile = [
    {
      title: "USER PROFILE",
      items: [
        { href: "/gra-propel/dashboard", icon: <MessageSquare />, label: "My Dashboard" },
        { href: "/gra-propel/login", icon: <UserRoundPlus />, label: "Print Dashboard" },
        { href: "/gra-propel/feedback", icon: <UserRoundPlus />, label: "Feedback and Comments" },
      ],
    },
  ];

  return (
    <div className="w-full bg-gray-800 text-white shadow-md relative">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 font-semibold">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-wider text-red-500 text-[20px]">PROPEL</span>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          {[...menus, ...userProfile].map((menu, index) => (
            <div key={index}>
              <button
                className="w-full text-left flex items-center justify-between py-2 text-sm font-medium bg-gray-700 px-3 rounded"
                onClick={() => setOpenMenu(openMenu === menu.title ? null : menu.title)}
              >
                {menu.title}
                <ChevronDown size={16} className={`transition-transform ${openMenu === menu.title ? "rotate-180" : ""}`} />
              </button>
              {openMenu === menu.title && (
                <div className="mt-1 bg-gray-700 rounded">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="block px-4 py-2 text-sm hover:bg-gray-600 flex items-center gap-2"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-[700px] justify-between items-center z-[100]">
        {menus.map((menu, index) => (
          <div
            key={index}
            className="group p-2 hover:bg-gray-600 rounded-lg"
            onMouseEnter={() => handleMouseEnter(menu.title)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative">
              <button className="flex items-center gap-2 text-lg transition">
                {menu.title}
                <ChevronDown size={18} />
              </button>
              {openMenu === menu.title && (
                <div className="absolute top-full left-0 bg-gray-700 mt-2 rounded-md shadow-lg min-w-max z-[9999]">
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
              )}
            </div>
          </div>
        ))}

        {/* User Profile menu (desktop) */}
        {userProfile.map((menu, index) => (
          <div
            key={index}
            className="group p-2 hover:bg-gray-600 rounded-lg"
            onMouseEnter={() => handleMouseEnter(menu.title)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative">
              <button className="flex items-center gap-2 text-lg transition">
                {menu.title}
                <ChevronDown size={18} />
              </button>
              {openMenu === menu.title && (
                <div className="absolute top-full left-0 bg-gray-700 mt-2 rounded-md shadow-lg min-w-max z-[9999]">
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
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
