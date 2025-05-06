import { useEffect, useState } from 'react';
import { differenceInDays } from 'date-fns';
import { Sun, Moon, Cloud, CloudRain, CloudLightning } from 'lucide-react';

interface Message {
  day: number;
  type: string;
  message: string;
}

interface Addiction {
  name: string;
  quitDate: Date;
}

interface DashboardProps {
  addictions: Addiction[];
  messages: Message[];
}

export default function Dashboard({ addictions = [], messages = [] }: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [addictionStats, setAddictionStats] = useState<{ addiction: Addiction; daysClean: number; messages: Message[] }[]>([]);

  useEffect(() => {
    if (!addictions.length) return;

    const stats = addictions.map(addiction => {
      const days = differenceInDays(new Date(), addiction.quitDate);
      const relevantMessages = messages
        .filter(msg => msg.day <= days)
        .reduce((acc, curr) => {
          if (!acc[curr.type] || acc[curr.type].day < curr.day) {
            acc[curr.type] = curr;
          }
          return acc;
        }, {} as Record<string, Message>);

      return {
        addiction,
        daysClean: days,
        messages: Object.values(relevantMessages)
      };
    });
    setAddictionStats(stats);
  }, [addictions, messages]);

  const getWeatherIcon = (days: number) => {
    if (days <= 3) return <CloudRain className="w-6 h-6 text-gray-400" />;
    if (days <= 7) return <Cloud className="w-6 h-6 text-gray-300" />;
    if (days <= 14) return <CloudLightning className="w-6 h-6 text-yellow-400" />;
    if (days <= 30) return <Moon className="w-6 h-6 text-purple-400" />;
    return <Sun className="w-6 h-6 text-yellow-500" />;
  };

  if (!addictions.length || !messages.length) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
      <p className="text-gray-600">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Recovery Dashboard</h1>
          
          {/* Global Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {addictionStats.map((stat, index) => (
              <div key={index} className="bg-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-purple-800">{stat.addiction.name}</h3>
                  {getWeatherIcon(stat.daysClean)}
                </div>
                <p className="text-2xl font-bold text-purple-900">{stat.daysClean} Days</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-4">
              {addictions.map((addiction, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTab(index)}
                  className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${selectedTab === index
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span>{addiction.name}</span>
                  {getWeatherIcon(addictionStats[index]?.daysClean || 0)}
                </button>
              ))}
            </nav>
          </div>

          {/* Detailed View */}
          {addictionStats[selectedTab] && (
            <div className="space-y-6">
              <div className="bg-purple-100 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-purple-800 mb-2">
                  {addictionStats[selectedTab].daysClean} Days Clean
                </h2>
                <p className="text-purple-600">Keep going strong!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addictionStats[selectedTab].messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-lg ${
                      msg.type === 'health' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-orange-50 border-l-4 border-orange-500'
                    }`}
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      {msg.type === 'health' ? 'Health Recovery' : 'Habit Rewiring'}
                    </h3>
                    <p className={msg.type === 'health' ? 'text-green-700' : 'text-orange-700'}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
