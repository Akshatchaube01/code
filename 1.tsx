useEffect(() => {
  const fetchData = async () => {
    if (!selectedOptions) return;
    setLoading(true);

    try {
      setError(null);
      const response = await axios.post(
        "http://127.0.0.1:8000/cyclicality",
        JSON.stringify(selectedOptions),
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      console.log("Raw API Response:", JSON.stringify(data, null, 2)); // ✅ Check original values

      const longRunFiltered: any[] = data["Cyclicality: Long run"]?.rows || [];
      const sdFiltered: any[] = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

      console.log("Long Run Filtered Data Before Processing:", longRunFiltered);
      console.log("SD Filtered Data Before Processing:", sdFiltered);

      const segregateByMetric = (data: any[], metric: string) => {
        return data
          .filter((row: any) => row.METRIC === metric)
          .sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1))
          .slice(-5) // Get latest 5 records
          .map((row: any) => ({
            month: row.REPORT_DATE,
            desktop: row.VALUE, // ✅ No modification, must include negatives
            laptop: row.VALUE * 0.8, // ✅ Ensure negative values are maintained
          }));
      };

      setLongRunData(segregateByMetric(longRunFiltered, "Final Cyclicality Long run"));
      setSdData(segregateByMetric(sdFiltered, "Final Cyclicality SD"));

      console.log("Processed Long Run Data for Chart:", longRunData);
      console.log("Processed SD Data for Chart:", sdData);

      const formatTableData = (data: any[], metric: string) => {
        return data
          .filter((row: any) => row.METRIC === metric)
          .sort((a, b) => (a.REPORT_DATE > b.REPORT_DATE ? 1 : -1))
          .map((row: any) => ({
            a: row.REPORT_DATE,
            b: row.MODEL, // Model Cyclicality
            c: row.VALUE, // Final Cyclicality (✅ Must be exact API value)
          }));
      };

      setTableLongRunData(formatTableData(longRunFiltered, "Final Cyclicality Long run"));
      setTableSDData(formatTableData(sdFiltered, "Final Cyclicality SD"));

      console.log("Table Long Run Data:", tableLongRunData);
      console.log("Table SD Data:", tableSDData);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedOptions]);
