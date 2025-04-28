import { FC } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

const DynamicPieChart: FC = () => {
  const data: DataItem[] = [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 200 },
    { name: 'D', value: 100 }
  ];

  const colors: string[] = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

  return (
    <div className="w-full h-[36rem] p-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={180}
            innerRadius={80}
            paddingAngle={5}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-pie-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicPieChart;
