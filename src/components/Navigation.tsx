import { Settings, PlusCircle, LogOut, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  onSettingsClick: () => void;
  onAddictionManagerClick: () => void;
  onDashboardClick: () => void;
  onLogout: () => void;
}

export default function Navigation({ onSettingsClick, onAddictionManagerClick, onDashboardClick, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-purple-600">Recovery Tracker</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onDashboardClick}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 hover:text-purple-900"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden sm:inline-block sm:ml-1">Dashboard</span>
            </button>
            <button
              onClick={onAddictionManagerClick}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 hover:text-purple-900"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="hidden sm:inline-block sm:ml-1">Manage Addictions</span>
            </button>
            <button
              onClick={onSettingsClick}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 hover:text-gray-900"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 hover:text-red-800"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
