import { FC, ReactNode } from 'react';
import { Users, Boxes, Folder, Star } from 'lucide-react';

interface DashboardValues {
  assignedFTEs: number;
  ongoingProjects: number;
  totalProjects: number;
  involvedProjects: number;
}

const DashboardCards: FC<{ values: DashboardValues }> = ({ values }) => {
  const cardData = [
    {
      title: 'Assigned FTEs',
      value: values.assignedFTEs,
      icon: <Users size={32} className="text-blue-500" />,
    },
    {
      title: 'Ongoing Projects',
      value: values.ongoingProjects,
      description: 'As on April 25, 2025',
      icon: <Boxes size={32} className="text-blue-500" />,
    },
    {
      title: 'Total Projects',
      value: values.totalProjects,
      highlight: '70.00% of all projects',
      icon: <Folder size={32} className="text-blue-500" />,
    },
    {
      title: "I'm Involved",
      value: values.involvedProjects,
      description: '(active projects)',
      icon: <Star size={32} className="text-blue-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="border rounded-2xl shadow-md p-6 flex flex-col justify-between h-44 bg-white"
        >
          <div className="flex items-center gap-4">
            {card.icon}
            <div className="text-gray-600 font-medium">{card.title}</div>
          </div>
          <div className="text-4xl font-bold text-gray-900 mt-4">{card.value}</div>
          {card.highlight ? (
            <div className="text-green-500 font-semibold text-sm mt-2">
              {card.highlight}
            </div>
          ) : (
            <div className="text-gray-400 text-sm mt-2">{card.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
