const fetchHolidayData = () => {
  axios.get('http://127.0.0.1:8000/propel/register_holidays/')
    .then(res => {
      console.log("Fetched holidays:", res.data);

      if (!Array.isArray(res.data)) {
        console.error("API response is not an array:", res.data);
        return;
      }

      const mapped = res.data.map((item: any) => ({
        ...item,
        half_day: item.holiday_halfday ? "Half Day" : "Full Day",
        disable: true
      }));

      setHolidayData(mapped);
    })
    .catch(err => {
      if (err.response) {
        console.error("Backend responded with error:", err.response.data);
      } else if (err.request) {
        console.error("No response from backend:", err.request);
      } else {
        console.error("Error in setting up request:", err.message);
      }
    });
};
