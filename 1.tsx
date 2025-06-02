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

  const filteredOptions = key === "projectType" ? removeByName(options, "Generic Activities") : options;
  const isAllSelected = selected.length === filteredOptions.length;

  const SELECT_ALL_OPTION = { id: "__select_all__", name: "All Selected" };
  const showAllSelected = isAllSelected && isSingleSelectOnly && !inputValue;

  const finalOptions =
    inputValue.trim() === ""
      ? [SELECT_ALL_OPTION, ...filteredOptions]
      : filteredOptions.filter((opt) =>
          opt.name.toLowerCase().includes(inputValue.toLowerCase())
        );

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
          ? [...filteredOptions]
          : selected
      }
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
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

        const isSelectAll = valueArray.some((opt) => opt.id === SELECT_ALL_OPTION.id);
        let finalSelection: Option[] = [];

        if (isSingleSelectOnly) {
          if (isSelectAll) {
            finalSelection = filteredOptions;
          } else if (valueArray.length > 0) {
            finalSelection = [valueArray[valueArray.length - 1]];
          }
        } else {
          finalSelection =
            isSelectAll && isAllSelected
              ? filteredOptions
              : valueArray.filter((o) => o.id !== SELECT_ALL_OPTION.id);
        }

        setFilters((prev) => {
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
        // Show "All Selected" when appropriate for single select
        if (
          isSingleSelectOnly &&
          isAllSelected &&
          !inputValue &&
          selected.length > 0 &&
          option.id === selected[0].id
        ) {
          return "All Selected";
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
