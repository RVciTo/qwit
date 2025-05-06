import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import AddictionManager from './components/AddictionManager';
import Navigation from './components/Navigation';
import { User, Addiction, Message, UserData } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [addictions, setAddictions] = useState<Addiction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'addictionManager'>('dashboard');

  useEffect(() => {
    // Load messages
    fetch('/src/data/messages.csv')
      .then(response => response.text())
      .then(csv => {
        const result = Papa.parse(csv, {
          header: true,
          transform: (value, field) => {
            if (field === 'day') return parseInt(value);
            return value;
          }
        });
        setMessages(result.data as Message[]);
      });
  }, []);

  useEffect(() => {
    if (user) {
      const userData = localStorage.getItem(`userData_${user.id}`);
      if (userData) {
        const parsed = JSON.parse(userData) as UserData;
        setAddictions(parsed.addictions.map(a => ({
          ...a,
          quitDate: new Date(a.quitDate)
        })));
        setIsOnboarded(parsed.isOnboarded);
      }
    }
  }, [user]);

  const handleAuthComplete = (userData: User) => {
    setUser(userData);
  };

  const handleOnboardingComplete = (newAddictions: Addiction[]) => {
    if (!user) return;
    
    const userData: UserData = {
      user,
      addictions: newAddictions,
      isOnboarded: true
    };
    
    localStorage.setItem(`userData_${user.id}`, JSON.stringify(userData));
    setAddictions(newAddictions);
    setIsOnboarded(true);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    setCurrentView('dashboard');
  };

  const handleAddictionsUpdate = (updatedAddictions: Addiction[]) => {
    if (!user) return;
    
    const userData: UserData = {
      user,
      addictions: updatedAddictions,
      isOnboarded
    };
    
    localStorage.setItem(`userData_${user.id}`, JSON.stringify(userData));
    setAddictions(updatedAddictions);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAddictions([]);
    setIsOnboarded(false);
  };

  if (!user) {
    return <Auth onAuth={handleAuthComplete} />;
  }

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation
        onSettingsClick={() => setCurrentView('settings')}
        onAddictionManagerClick={() => setCurrentView('addictionManager')}
        onLogout={handleLogout}
      />
      
      <div className="max-w-4xl mx-auto p-6">
        {currentView === 'dashboard' && (
          <Dashboard addictions={addictions} messages={messages} />
        )}
        
        {currentView === 'settings' && (
          <Settings user={user} onUpdate={handleUserUpdate} />
        )}
        
        {currentView === 'addictionManager' && (
          <AddictionManager
            addictions={addictions}
            onUpdate={handleAddictionsUpdate}
          />
        )}
      </div>
    </div>
  );
}
