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

  const filteredBaseOptions =
    key === "projectType" ? removeByName(options, "Generic Activities") : options;

  const isAllSelected = selected.length === filteredBaseOptions.length;
  const showAllSelected = isAllSelected && isSingleSelectOnly && !inputValue;

  const SELECT_ALL_DISPLAY_OPTION = {
    id: "__select_all__",
    name: "All Selected"
  };

  const finalOptions = useMemo(() => {
    const base = key === "projectType" ? removeByName(options, "Generic Activities") : options;
    return inputValue.trim() === "" ? [...base, SELECT_ALL_DISPLAY_OPTION] : base;
  }, [inputValue, options, key]);

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
          ? [...filteredBaseOptions]
          : selected
      }
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue: Option[] | Option | null) => {
        let valueArray: Option[] = [];

        if (Array.isArray(newValue)) {
          valueArray = newValue;
        } else if (newValue) {
          valueArray = [newValue];
        }

        const isSelectAll = valueArray.some(opt => opt.id === SELECT_ALL_DISPLAY_OPTION.id);
        let finalSelection: Option[] = [];

        if (isSingleSelectOnly) {
          if (isSelectAll) {
            finalSelection = filteredBaseOptions;
          } else if (valueArray.length > 0) {
            finalSelection = [valueArray[valueArray.length - 1]];
          }
        } else {
          finalSelection = isSelectAll && isAllSelected
            ? filteredBaseOptions
            : valueArray.filter(o => o.id !== SELECT_ALL_DISPLAY_OPTION.id);
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
        if (typeof option === "string") return option;
        if (option && typeof option === "object" && "name" in option) return option.name;
        return "";
      }}
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
            value: showAllSelected ? "All Selected" : params.InputProps.value,
          }}
          inputProps={{
            ...params.inputProps,
            value: showAllSelected ? "All Selected" : params.inputProps.value,
          }}
        />
      )}
      className="bg-white rounded"
      disabled={disabled}
      disablePortal={false}
    />
  );
};
