useEffect(() => {
    const fetchData = async () => {
        if (!selectedOptions) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("http://127.0.0.1:8000/backtesting", selectedOptions, {
                headers: { "Content-Type": "application/json" }
            });
            console.log("API Response:", response.data); // Log the response
            setChartData(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [selectedOptions]);
