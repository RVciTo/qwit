import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Settings from './components/Settings';
import AddictionManager from './components/AddictionManager';
import Auth from './components/Auth';
import { messages } from './data/addictionTypes';
import type { Addiction } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'addictionManager'>('dashboard');
  const [addictions, setAddictions] = useState<Addiction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsAuthenticated(true);
      
      try {
        const storedAddictions = localStorage.getItem(`addictions_${storedUserId}`);
        if (storedAddictions) {
          const parsedAddictions = JSON.parse(storedAddictions).map((addiction: any) => ({
            ...addiction,
            quitDate: new Date(addiction.quitDate)
          }));
          setAddictions(parsedAddictions);
        }
      } catch (error) {
        console.error('Error parsing addictions:', error);
        localStorage.removeItem(`addictions_${storedUserId}`);
      }
    }
  }, []);

  const handleLogin = (newUserId: string) => {
    setUserId(newUserId);
    setIsAuthenticated(true);
    localStorage.setItem('userId', newUserId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('userId');
    setAddictions([]);
  };

  const handleUpdateAddictions = (newAddictions: Addiction[]) => {
    setAddictions(newAddictions);
    if (userId) {
      localStorage.setItem(`addictions_${userId}`, JSON.stringify(newAddictions));
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div>
      <Navigation 
        onSettingsClick={() => setCurrentView('settings')}
        onAddictionManagerClick={() => setCurrentView('addictionManager')}
        onDashboardClick={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
      
      {currentView === 'dashboard' && (
        <Dashboard addictions={addictions} messages={messages} />
      )}
      {currentView === 'settings' && (
        <Settings userId={userId!} />
      )}
      {currentView === 'addictionManager' && (
        <AddictionManager 
          addictions={addictions}
          onUpdate={handleUpdateAddictions}
        />
      )}
    </div>
  );
}
