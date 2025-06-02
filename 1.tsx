const RenderAutocomplete = (
  label: string,
  options: Option[],
  selected: Option[],
  key: keyof typeof filters,
  disabled?: boolean
) => {
  const isAllSelected = selected.length === options.length;
  const singleSelectFields = ["region", "projectLabel", "portfolio", "projectType", "projectTypeL2"];
  const isSingleSelectOnly = singleSelectFields.includes(key);
  const showAllSelected = isSingleSelectOnly && isAllSelected;

  const filteredOptions =
    key === "projectType"
      ? removeByName(options, "Generic Activities")
      : options;

  return (
    <Autocomplete
      multiple={!isSingleSelectOnly}
      disableCloseOnSelect
      options={[SELECT_ALL_OPTION, ...filteredOptions]}
      value={
        isSingleSelectOnly
          ? selected.length > 0
            ? selected[0]
            : null
          : isAllSelected
          ? [...options]
          : selected
      }
      onChange={(
        event: SyntheticEvent,
        newValue: Option[] | Option | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<Option>
      ) => {
        let valueArray: Option[] = [];

        if (Array.isArray(newValue)) {
          valueArray = newValue;
        } else if (newValue) {
          valueArray = [newValue];
        }

        const isSelectAll = valueArray.some(opt => opt.id === SELECT_ALL_OPTION.id);

        let finalSelection: Option[] = [];

        if (isSingleSelectOnly) {
          if (isSelectAll) {
            finalSelection = options;
          } else if (valueArray.length > 0) {
            finalSelection = [valueArray[valueArray.length - 1]];
          }
        } else {
          finalSelection = isSelectAll && isAllSelected
            ? options
            : valueArray.filter(o => o.id !== SELECT_ALL_OPTION.id);
        }

        setFilters(prev => {
          if (key === 'selectedTeam') {
            const resetFilters: typeof filters = Object.keys(prev).reduce((acc, k) => {
              acc[k as keyof typeof filters] = k === 'selectedTeam' ? finalSelection : [];
              return acc;
            }, {} as typeof filters);
            return resetFilters;
          } else {
            return { ...prev, [key]: finalSelection };
          }
        });
      }}
      getOptionLabel={(option) => option.name || ''}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={selected.length === 0 && !disabled && !isAllSelected}
          helperText={
            selected.length === 0 && !disabled && !isAllSelected
              ? "Please make a selection"
              : ""
          }
          InputProps={{
            ...params.InputProps,
            value:
              showAllSelected && !params.inputProps.value
                ? "All Selected"
                : params.inputProps.value,
          }}
          inputProps={{
            ...params.inputProps,
            value:
              showAllSelected && !params.inputProps.value
                ? "All Selected"
                : params.inputProps.value,
          }}
        />
      )}
      className="bg-white rounded"
      disabled={disabled}
      disablePortal={false}
    />
  );
};
