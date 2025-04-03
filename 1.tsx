const renderLegend2 = () => {
  const uniqueMonths = Array.from(new Set(data.map((d) => d.month)));

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "10px auto", textAlign: "center" }}>
      {uniqueMonths.map((month, index) => (
        <li key={`${month}-${index}`} style={{ display: "inline-block", margin: "0 10px" }}>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              backgroundColor: monthColors[month] || "#000",
              marginRight: 4,
            }}
          />
          {month}
        </li>
      ))}
    </ul>
  );
};
