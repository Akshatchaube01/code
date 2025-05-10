<DatePicker
  selected={actual_end_date ? new Date(actual_end_date) : null}
  onChange={(date: Date | null) => {
    if (date) {
      const formatDate = date.toISOString().split('T')[0];
      setActualEndDate(formatDate);
    } else {
      setActualEndDate('');
    }
  }}
  dateFormat="yyyy-MM-dd"
  placeholderText="Actual end date"
  className={`w-full border px-3 py-2 rounded text-sm ${
    !actual_end_date ? 'border-red-500' : 'border-gray-300'
  }`}
/>
{!actual_end_date && (
  <p className="text-red-500 text-sm mt-1">Actual End Date is required</p>
)}
