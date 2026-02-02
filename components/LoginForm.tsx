
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight } from 'lucide-react';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default system credentials
    if (email === 'admin@ssp.com' && password === 'admin123') {
      onLogin();
    } else {
      alert("Invalid email or password. Use admin@ssp.com / admin123");
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset link has been sent to your registered email.");
    setShowForgot(false);
  };

  if (showForgot) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="heading-text text-ssp-blue">Reset Password</h2>
            <p className="normal-text text-gray-500">Enter your official email to receive a recovery link.</p>
          </div>
          <form onSubmit={handleForgot} className="space-y-8">
            <div className="flex flex-col space-y-3">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Official Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={22} className="text-gray-400" />
                </span>
                <input 
                  type="email" 
                  className="pl-12 w-full border border-gray-300 p-4 rounded focus:ring-2 focus:ring-ssp-blue focus:outline-none bg-white normal-text"
                  placeholder="name@ssp.com"
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-ssp-blue text-white p-4 rounded font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg">
              Send Reset Link
            </button>
            <button 
              type="button" 
              onClick={() => setShowForgot(false)}
              className="w-full text-center normal-text text-gray-500 hover:text-ssp-blue font-bold"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-block p-6 bg-blue-50 rounded-full mb-6">
            <Lock size={40} className="text-ssp-blue" />
          </div>
          <h2 className="heading-text text-ssp-blue uppercase tracking-widest">Admin Access</h2>
          <p className="normal-text text-gray-500">Secure portal for Salem Steel Plant management.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Officer Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={22} className="text-gray-400" />
              </span>
              <input 
                type="email" 
                className="pl-12 w-full border border-gray-300 p-4 rounded focus:ring-2 focus:ring-ssp-blue focus:outline-none bg-white normal-text shadow-sm"
                placeholder="admin@ssp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Secret Key</label>
              <button 
                type="button" 
                onClick={() => setShowForgot(true)}
                className="text-sm font-bold text-ssp-blue hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={22} className="text-gray-400" />
              </span>
              <input 
                type="password" 
                className="pl-12 w-full border border-gray-300 p-4 rounded focus:ring-2 focus:ring-ssp-blue focus:outline-none bg-white normal-text shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center bg-ssp-blue text-white p-4 rounded font-bold uppercase tracking-widest hover:bg-black transition-all group shadow-xl">
            Login to Dashboard
            <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" size={24} />
          </button>
        </form>
        
        <div className="mt-10 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
          Authorized personnel only
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
