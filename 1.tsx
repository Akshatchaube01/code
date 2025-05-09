<div className='mb-4'>
  <label className='block font-semibold mb-1'>Project Lead 2</label>
  <Autocomplete
    multiple
    options={projectLeads}
    getOptionLabel={(option) => option.name}
    value={project_lead2}
    onChange={(event, newValue) => setProjectLead2(newValue)}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Select Project Lead 2"
        variant="outlined"
        fullWidth
        size="small"
      />
    )}
  />
</div>

<div className='mb-4'>
  <label className='block font-semibold mb-1'>Project Lead</label>
  <Autocomplete
    options={projectLeads}
    getOptionLabel={(option) => option.name}
    value={project_lead}
    onChange={(event, newValue) => setProjectLead(newValue)}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Select Project Lead"
        variant="outlined"
        fullWidth
        size="small"
      />
    )}
  />
</div>

<div className='mb-4'>
  <label className='block font-semibold mb-1'>Project Label</label>
  <Autocomplete
    options={labelOptions}
    getOptionLabel={(option) => option.name}
    value={project_label}
    onChange={(event, newValue) => setProjectLabel(newValue)}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Select Project Label"
        variant="outlined"
        fullWidth
        size="small"
      />
    )}
  />
</div>








