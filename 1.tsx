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
</div>
