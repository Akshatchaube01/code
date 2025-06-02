const RenderAutocomplete = (
  label: string,
  options: Option[],
  selected: Option[],
  key: keyof typeof filters,
  disabled?: boolean
) => {
  const [inputValue, setInputValue] = useState("");

  const singleSelectFields = ["region", "projectLabel", "portfolio", "projectType", "projectTypeL2"];
  const isSingleSelectOnly = singleSelectFields.includes(key);

  // Filter out "Generic Activities" for projectType key
  const filteredOptions = key === "projectType" ? removeByName(options, "Generic Activities") : options;

  const SELECT_ALL_OPTION = { id: "__select_all__", name: "SELECT ALL" };

  // Check if all base options are selected
  const isAllSelected = selected.length === filteredOptions.length;

  // Build the options list: always add SELECT ALL at the top
  // On input, filter options (except SELECT ALL, which always shows)
  const finalOptions = filteredOptions.filter(opt =>
    opt.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  const optionsWithSelectAll = [SELECT_ALL_OPTION, ...finalOptions];

  // Determine what to show in the input display
  // If all selected and single select, show "ALL SELECTED"
  const showAllSelectedLabel =
    isSingleSelectOnly && isAllSelected && !inputValue && selected.length > 0;

  return (
    <Autocomplete
      multiple={!isSingleSelectOnly}
      disableCloseOnSelect
      options={optionsWithSelectAll}
      value={
        isSingleSelectOnly
          ? selected.length > 0
            ? selected[0]
            : null
          : isAllSelected
          ? [...filteredOptions]
          : selected
      }
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(
        event: React.SyntheticEvent,
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
            finalSelection = filteredOptions;
          } else if (valueArray.length > 0) {
            finalSelection = [valueArray[valueArray.length - 1]];
          }
        } else {
          finalSelection = isSelectAll
            ? filteredOptions
            : valueArray.filter(opt => opt.id !== SELECT_ALL_OPTION.id);
        }

        setFilters(prev => {
          if (key === "selectedTeam") {
            const resetFilters: typeof filters = Object.keys(prev).reduce((acc, k) => {
              acc[k as keyof typeof filters] = k === "selectedTeam" ? finalSelection : [];
              return acc;
            }, {} as typeof filters);
            return resetFilters;
          } else {
            return { ...prev, [key]: finalSelection };
          }
        });

        setInputValue("");
      }}
      getOptionLabel={(option) => {
        if (showAllSelectedLabel && selected.length > 0 && option.id === selected[0].id) {
          return "ALL SELECTED";
        }
        if (typeof option === "string") return option;
        if (option && typeof option === "object" && "name" in option) return option.name;
        return "";
      }}
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
        />
      )}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      className="bg-white rounded"
      disabled={disabled}
      disablePortal={false}
    />
  );
};
