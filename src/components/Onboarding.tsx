import { useState } from 'react';
import { Calendar } from 'lucide-react';

const ADDICTION_CATEGORIES = [
  "Nicotine (Cigarettes, Vapes, Pouches)",
  "Cannabis (Weed, Hash, Edibles)",
  "Alcohol (Beer, Wine, Spirits)",
  "Stimulants (Cocaine, MDMA, Amphetamines)",
  "Opiates (Heroin, Oxycodone, Fentanyl)",
  "Behavioral (Porn, Gambling, Social Media)",
  "Custom Addiction (User-defined)"
];

interface Addiction {
  name: string;
  quitDate: Date;
}

interface OnboardingProps {
  onComplete: (addictions: Addiction[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [addictions, setAddictions] = useState<{ name: string; quitDate: string }[]>([]);
  const [customAddiction, setCustomAddiction] = useState('');

  const handleAddictionToggle = (addiction: string, checked: boolean) => {
    if (checked) {
      setAddictions([...addictions, { name: addiction, quitDate: '' }]);
    } else {
      setAddictions(addictions.filter(a => a.name !== addiction));
    }
  };

  const handleQuitDateChange = (addiction: string, date: string) => {
    setAddictions(addictions.map(a => 
      a.name === addiction ? { ...a, quitDate: date } : a
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addictions.length === 0) return;

    const formattedAddictions = addictions.map(a => ({
      name: a.name === "Custom Addiction (User-defined)" ? customAddiction : a.name,
      quitDate: new Date(a.quitDate)
    })).filter(a => a.name && a.quitDate);

    onComplete(formattedAddictions);
  };

  const isValid = addictions.length > 0 && 
    addictions.every(a => a.quitDate) &&
    (!addictions.find(a => a.name === "Custom Addiction (User-defined)") || customAddiction);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Begin Your Recovery Journey</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              What are you recovering from?
            </label>
            <div className="space-y-4">
              {ADDICTION_CATEGORIES.map((addiction) => (
                <div key={addiction} className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={addictions.some(a => a.name === addiction)}
                      onChange={(e) => handleAddictionToggle(addiction, e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="ml-2 text-gray-700">{addiction}</span>
                  </label>
                  
                  {addictions.some(a => a.name === addiction) && (
                    <div className="ml-8">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
                          value={addictions.find(a => a.name === addiction)?.quitDate || ''}
                          onChange={(e) => handleQuitDateChange(addiction, e.target.value)}
                          className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {addictions.some(a => a.name === "Custom Addiction (User-defined)") && (
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Specify your custom addiction
              </label>
              <input
                type="text"
                value={customAddiction}
                onChange={(e) => setCustomAddiction(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter custom addiction"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            Start Tracking My Recovery
          </button>
        </form>
      </div>
    </div>
  );
}
