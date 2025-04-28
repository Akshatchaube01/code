import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DynamicBarChart = ({ data }) => {
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
          {data.map((entry, index) => (
            <Bar 
              key={index} 
              dataKey="value" 
              fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`}
              barSize={30}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicBarChart;