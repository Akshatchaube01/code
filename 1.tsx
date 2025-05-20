"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";

export default function HorizontalNavbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 500);
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
        { href: "/gra-propel/region", icon: <Database />, label: "Region Owner" },
        { href: "/gra-propel/project_funding", icon: <Database />, label: "Project Funding" },
        { href: "/gra-propel/portfolio", icon: <Database />, label: "Portfolio" },
        { href: "/gra-propel/project_type", icon: <Database />, label: "Project Type" },
        { href: "/gra-propel/project_type_L2", icon: <Database />, label: "Project Type L2" },
        { href: "/gra-propel/task", icon: <Database />, label: "Project Task" },
        { href: "/gra-propel/sub_task", icon: <Database />, label: "Project Sub-task" },
        { href: "/gra-propel/project_status", icon: <Database />, label: "Project Status" },
      ],
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
        // { href: "/gra-propel/logout", icon: <MessageSquare />, label: "Log Out" },
      ],
    },
  ];

  return (
    <div className="w-full bg-gray-800 text-white shadow-md relative">
      <div className="flex items-center justify-between px-6 py-4 font-semibold">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-wider text-red-500 text-[22px]">PROPEL</span>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[700px] flex md:flex-row flex-col md:justify-between items-center z-[100] overflow-x-auto">
          {menus.map((menu, index) => (
            <div
              key={index}
              className="relative p-2 hover:bg-gray-600 rounded-lg"
              onMouseEnter={() => handleMouseEnter(menu.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-2 text-lg transition">
                {menu.title}
                <ChevronDown size={18} />
              </button>

              {openMenu === menu.title && (
                <div className="absolute top-full left-0 bg-gray-700 mt-2 rounded-md shadow-lg min-w-max z-[100]">
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
          ))}
        </div>

        <div className="text-white font-medium whitespace-nowrap pr-[74px]">
          {userProfile.map((menu, index) => (
            <div
              key={index}
              className="relative p-2 hover:bg-gray-600 rounded-lg"
              onMouseEnter={() => handleMouseEnter(menu.title)}
              onMouseLeave={handleMouseLeave}
            >
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
          ))}
        </div>
      </div>
    </div>
  );
}
