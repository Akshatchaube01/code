const RenderAutocomplete = (
  label: string,
  options: Option[],
  selected: Option[],
  key: keyof typeof filters
) => {
  const isAllSelected = selected.length === options.length;

  const handleChange = (_: any, newValue: Option[]) => {
    const isSelectAll = newValue.some((opt) => opt.id === -1);
    const newSelection =
      isSelectAll && isAllSelected
        ? []
        : isSelectAll
        ? options
        : newValue.filter((o) => o.id !== -1);

    setFilters((prev) => ({
      ...prev,
      [key]: newSelection,
    }));
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={[{ id: -1, name: "Select All" }, ...options]}
      value={isAllSelected ? [...options] : selected}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        const isSelectAll = option.id === -1;
        const isChecked = isSelectAll
          ? selected.length > 0 && selected.length < options.length
            ? 'indeterminate'
            : selected.length === options.length
          : selected.some((s) => s.id === option.id);

        return (
          <li key={option.id} {...props}>
            <input
              type="checkbox"
              checked={isChecked}
              readOnly
              style={{ marginRight: 8 }}
            />
            {option.name}
          </li>
        );
      }}
      renderInput={(params) => <TextField {...params} label={label} />}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      className='bg-white rounded'
    />
  );
};
