import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DynamicBarChart = ({ data }) => {
  const bars = data && Array.isArray(data)
    ? data.map((entry, index) => (
        <Bar
          key={index}
          dataKey={entry.dataKey || 'value'}
          fill={entry.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
          name={entry.name}
          barSize={30}
        />
      ))
    : null;

  return (
    <div className="w-full h-96 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {bars}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicBarChart;
