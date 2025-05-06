<Autocomplete
  options={projectTypeList}
  getOptionLabel={(option) => option?.name ?? ''}
  value={selectedProjectType}
  onChange={(event, newValue) => setSelectedProjectType(newValue)}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Project Type ID"
      variant="outlined"
      fullWidth
      size="small"
    />
  )}
/>
