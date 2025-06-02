const SELECT_ALL_OPTION = {
  id: "__select_all__",
  name: "SELECT ALL",
};

const RenderAutocomplete = (
  label: string,
  options: Option[],
  selected: Option[],
  key: keyof typeof filters,
  disabled?: boolean
) => {
  const isAllSelected = selected.length === options.length || selected.length === 8;

  const singleSelectFields = ["region", "projectLabel", "portfolio", "projectType", "projectTypeL2"];
  const isSingleSelectOnly = singleSelectFields.includes(key);

  const showAllSelected = isSingleSelectOnly && isAllSelected;

  return (
    <Autocomplete
      multiple={!isSingleSelectOnly}
      disableCloseOnSelect
      options={[
        SELECT_ALL_OPTION,
        ...(key === "projectType" ? removeByName(options, "Generic Activities") : options),
      ]}
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

        const isSelectAll = valueArray.some((opt) => opt.id === SELECT_ALL_OPTION.id);

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
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        if (option && typeof option === "object" && "name" in option) return option.name;
        return "Selected All";
      }}
      filterOptions={(options, state) =>
        options.filter(
          (option) =>
            option.name?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
            option.id === SELECT_ALL_OPTION.id
        )
      }
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
            inputProps: {
              ...params.inputProps,
              value: showAllSelected ? "All Selected" : params.inputProps.value,
            },
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

  const SELECT_ALL_OPTION = { id: "__select_all__", name: "SELECT ALL" };

  const isAllSelected =
    selected.length === filteredBaseOptions.length ||
    (filters.selectedTeam?.length === 0 && key !== "selectedTeam");

  const showAllSelected = isSingleSelectOnly && isAllSelected && !inputValue;

  const finalOptions =
    inputValue.trim() === ""
      ? [SELECT_ALL_OPTION, ...filteredBaseOptions]
      : filteredBaseOptions.filter(opt =>
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
          ? [...filteredBaseOptions]
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

        const isSelectAll = valueArray.some(opt => opt.id === SELECT_ALL_OPTION.id);
        let finalSelection: Option[] = [];

        if (isSingleSelectOnly) {
          if (isSelectAll) {
            finalSelection = filteredBaseOptions;
          } else if (valueArray.length > 0) {
            finalSelection = [valueArray[valueArray.length - 1]];
          }
        } else {
          finalSelection =
            isSelectAll && isAllSelected
              ? filteredBaseOptions
              : valueArray.filter(o => o.id !== SELECT_ALL_OPTION.id);
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
