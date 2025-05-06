import { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (userId: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === formData.email);

    if (isLogin) {
      if (!existingUser) {
        alert('Account not found. Please sign up.');
        setIsLogin(false);
        return;
      }
      // In a real app, we would verify the password here
      onLogin(existingUser.id);
    } else {
      if (existingUser) {
        alert('Account already exists. Please login.');
        setIsLogin(true);
        return;
      }
      
      const newUser: User = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email
      };
      
      // Save new user
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create user-specific data store
      localStorage.setItem(`userData_${newUser.id}`, JSON.stringify({
        user: newUser,
        addictions: [],
        isOnboarded: false
      }));
      
      onLogin(newUser.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-purple-600 hover:text-purple-800"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
