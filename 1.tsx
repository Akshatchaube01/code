const RenderAutocomplete = (
  label: string,
  options: Option[],
  selected: Option[],
  key: keyof typeof filters,
  disabled?: boolean
) => {
  const [inputValue, setInputValue] = React.useState("");

  const isAllSelected = selected.length === options.length || selected.length === 8;

  const singleSelectFields = ["region", "projectLabel", "portfolio", "projectType", "projectTypeL2"];
  const isSingleSelectOnly = singleSelectFields.includes(key);

  const showAllSelected = isSingleSelectOnly && isAllSelected;

  const SELECT_ALL_OPTION = { id: "__select_all__", name: "SELECT ALL" };

  // Filter options based on inputValue but always include SELECT_ALL_OPTION on top
  const filteredOptions = options.filter(opt =>
    opt.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  const finalOptions = [SELECT_ALL_OPTION, ...filteredOptions];

  return (
    <Autocomplete
      multiple={!isSingleSelectOnly}
      disableCloseOnSelect
      options={finalOptions}
      value={
        isSingleSelectOnly
          ? selected.length > 0
            ? selected[0]
            : null
          : isAllSelected
          ? [...options]
          : selected
      }
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(
        event,
        newValue,
        reason,
        details
      ) => {
        let valueArray = [];
        if (Array.isArray(newValue)) {
          valueArray = newValue;
        } else if (newValue) {
          valueArray = [newValue];
        }

        const isSelectAll = valueArray.some(opt => opt.id === SELECT_ALL_OPTION.id);

        let finalSelection = [];

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
          if (key === "selectedTeam") {
            const resetFilters = Object.keys(prev).reduce((acc, k) => {
              acc[k] = k === "selectedTeam" ? finalSelection : [];
              return acc;
            }, {});
            return resetFilters;
          } else {
            return { ...prev, [key]: finalSelection };
          }
        });

        setInputValue("");
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        if (option && typeof option === "object" && "name" in option) return option.name;
        return "Selected All";
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          value={undefined}
          error={selected.length === 0 && !disabled && isAllSelected}
          helperText={selected.length === 0 && !disabled && isAllSelected ? "Please make a selection" : ""}
          InputProps={{
            ...params.InputProps,
            value: showAllSelected ? "All Selected" : params.inputProps.value,
          }}
        />
      )}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      className="bg-white rounded"
      disabled={disabled}
      disablePortal={false}
    />
  );
};
