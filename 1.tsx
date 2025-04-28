<TabPanel>
  <div className="space-y-10">
    {/* Dashboard Cards */}
    <DashboardCards />

    {/* Employee Table */}
    <div className="text-center py-10">
      <h1 className="text-4xl font-semibold mb-6">Project Type Distribution</h1>
      <EmployeeTablePage />
    </div>

    {/* All Projects By Status - Bar Chart */}
    <div className="text-center">
      <h1 className="text-4xl font-semibold mb-6">All Projects By Status</h1>
      <DynamicBarChart data={bardata1} colors={barcolors1} />
    </div>

    {/* Projects by Type & Project Label - Pie Charts */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-6">Projects By Type</h1>
        <DynamicPieChart data={data1} colors={colors1} />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-6">Projects By Project Label</h1>
        <DynamicPieChart data={data2} colors={colors2} />
      </div>
    </div>

    {/* Projects by Type (Level 2) - Bar Chart */}
    <div className="text-center">
      <h1 className="text-4xl font-semibold mb-6">Projects By Type (Level-2)</h1>
      <DynamicBarChart data={bardata2} colors={barcolors2} />
    </div>
  </div>
</TabPanel>
