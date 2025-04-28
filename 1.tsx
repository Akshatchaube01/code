import { FC, ReactNode } from 'react';
import { Users, Cube, Folder, Star } from 'lucide-react';

interface CardData {
  title: string;
  value: number;
  description?: string;
  highlight?: string;
  icon: ReactNode;   // Correct type here
}

const cardData: CardData[] = [
  {
    title: 'Assigned FTEs',
    value: 85,
    description: 'As on April 25, 2025',
    icon: <Users size={32} className="text-blue-500" />,
  },
  {
    title: 'Ongoing Projects',
    value: 49,
    highlight: '70.00% of all projects',
    icon: <Cube size={32} className="text-blue-500" />,
  },
  {
    title: 'Total Projects',
    value: 70,
    description: 'Includes all projects',
    icon: <Folder size={32} className="text-blue-500" />,
  },
  {
    title: "I'm Involved",
    value: 0,
    description: '(active projects)',
    icon: <Star size={32} className="text-blue-500" />,
  },
];

const DashboardCards: FC = () => {
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
            <div className="text-green-500 font-semibold text-sm mt-2">{card.highlight}</div>
          ) : (
            <div className="text-gray-400 text-sm mt-2">{card.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
