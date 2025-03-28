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
      console.log("✅ Raw API Response:", JSON.stringify(data, null, 2));

      const longRunFiltered = data["Cyclicality: Long run"]?.rows || [];
      const sdFiltered = data["Cyclicality: SD (Standard Deviation)"]?.rows || [];

      console.log("✅ Before Transformation - Long Run:", JSON.stringify(longRunFiltered, null, 2));
      console.log("✅ Before Transformation - SD:", JSON.stringify(sdFiltered, null, 2));

      // ✅ New transformation logic (correct sorting, no random values)
      const processDataForChart = (data, metric) => {
        return data
          .filter(row => row.METRIC === metric)
          .sort((a, b) => new Date(a.REPORT_DATE) - new Date(b.REPORT_DATE)) // Ensure correct sorting
          .slice(-5) // Take last 5 records
          .map(row => ({
            month: row.REPORT_DATE,
            desktop: row.VALUE, // ✅ Ensure negatives are kept
            laptop: row.VALUE * 0.8, // ✅ Maintain scaling but preserve signs
          }));
      };

      const processedLongRun = processDataForChart(longRunFiltered, "Final Cyclicality Long run");
      const processedSD = processDataForChart(sdFiltered, "Final Cyclicality SD");

      console.log("✅ Processed Chart Data - Long Run:", JSON.stringify(processedLongRun, null, 2));
      console.log("✅ Processed Chart Data - SD:", JSON.stringify(processedSD, null, 2));

      setLongRunData(processedLongRun);
      setSdData(processedSD);

      // ✅ Table transformation with negative values preserved
      const formatTableData = (data, metric) => {
        return data
          .filter(row => row.METRIC === metric)
          .sort((a, b) => new Date(a.REPORT_DATE) - new Date(b.REPORT_DATE))
          .map(row => ({
            a: row.REPORT_DATE,
            b: row.MODEL,
            c: row.VALUE, // ✅ No modification to values
          }));
      };

      const tableLongRun = formatTableData(longRunFiltered, "Final Cyclicality Long run");
      const tableSD = formatTableData(sdFiltered, "Final Cyclicality SD");

      console.log("✅ Table Data - Long Run:", JSON.stringify(tableLongRun, null, 2));
      console.log("✅ Table Data - SD:", JSON.stringify(tableSD, null, 2));

      setTableLongRunData(tableLongRun);
      setTableSDData(tableSD);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedOptions]);
