{/* Center: Navigation Menus */}
<div className="flex gap-[2rem] relative justify-center items-center">
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
