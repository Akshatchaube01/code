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
      required
      error={!project_lead2 || project_lead2.length === 0}
      helperText={
        !project_lead2 || project_lead2.length === 0
          ? "Project Lead 2 is required"
          : ""
      }
    />
  )}
/>
