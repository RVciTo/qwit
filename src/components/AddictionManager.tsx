import { useState } from 'react';
import { Addiction } from '../types';
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

interface AddictionManagerProps {
  addictions: Addiction[];
  onUpdate: (addictions: Addiction[]) => void;
}

export default function AddictionManager({ addictions, onUpdate }: AddictionManagerProps) {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newAddiction, setNewAddiction] = useState({ name: '', quitDate: '' });
  const [customAddiction, setCustomAddiction] = useState('');

  const handleSave = (addiction: Addiction, isNew = false) => {
    let updatedAddictions: Addiction[];
    const finalAddictionName = addiction.name === "Custom Addiction (User-defined)" 
      ? customAddiction 
      : addiction.name;
    
    if (isNew) {
      updatedAddictions = [...addictions, { 
        name: finalAddictionName, 
        quitDate: new Date(addiction.quitDate) 
      }];
    } else {
      updatedAddictions = addictions.map(a => 
        a.name === editMode ? { 
          name: finalAddictionName, 
          quitDate: new Date(addiction.quitDate) 
        } : a
      );
    }

    onUpdate(updatedAddictions);
    setEditMode(null);
    setNewAddiction({ name: '', quitDate: '' });
    setCustomAddiction('');
  };

  const handleDelete = (name: string) => {
    const updatedAddictions = addictions.filter(a => a.name !== name);
    onUpdate(updatedAddictions);
  };

  const availableAddictions = ADDICTION_CATEGORIES.filter(category => 
    !addictions.some(addiction => 
      addiction.name === category || 
      (category === "Custom Addiction (User-defined)" && 
       addiction.name === customAddiction)
    )
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Addictions</h2>
      
      <div className="space-y-4">
        {addictions.map((addiction) => (
          <div key={addiction.name} className="border rounded-lg p-4">
            {editMode === addiction.name ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={addiction.name}
                  disabled
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={addiction.quitDate.toISOString().split('T')[0]}
                    onChange={(e) => addiction.quitDate = new Date(e.target.value)}
                    className="pl-10 w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(addiction)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{addiction.name}</h3>
                  <p className="text-sm text-gray-500">
                    Quit Date: {addiction.quitDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditMode(addiction.name)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addiction.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {availableAddictions.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Add New Addiction</h3>
            <div className="space-y-2">
              <select
                value={newAddiction.name}
                onChange={(e) => setNewAddiction({ ...newAddiction, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Select an addiction category</option>
                {availableAddictions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {newAddiction.name === "Custom Addiction (User-defined)" && (
                <input
                  type="text"
                  value={customAddiction}
                  onChange={(e) => setCustomAddiction(e.target.value)}
                  placeholder="Enter custom addiction"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              )}

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  value={newAddiction.quitDate}
                  onChange={(e) => setNewAddiction({ ...newAddiction, quitDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  className="pl-10 w-full p-2 border rounded-lg"
                />
              </div>
              <button
                onClick={() => handleSave(newAddiction as any, true)}
                disabled={!newAddiction.name || !newAddiction.quitDate || 
                  (newAddiction.name === "Custom Addiction (User-defined)" && !customAddiction)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Add Addiction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
