import { FC } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface DynamicPieChartProps {
  data: DataItem[];
  colors: string[];
}

const DynamicPieChart: FC<DynamicPieChartProps> = ({ data, colors }) => {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14}>
        {data[index].value}
      </text>
    );
  };

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
            label={renderCustomizedLabel}
            labelLine={false}
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
