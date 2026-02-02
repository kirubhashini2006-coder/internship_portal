
import React, { useState, useEffect } from 'react';
import { Home, User, ShieldCheck, LogOut, Building2, Award, Briefcase, UserPlus, FilePlus, ArrowLeft } from 'lucide-react';
import PortalCard from './components/PortalCard';
import StudentForm from './components/StudentForm';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/LoginForm';
import { InternshipApplication } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'student' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ssp_applications');
    if (saved) {
      setApplications(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ssp_applications', JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (app: InternshipApplication) => {
    // Gate Pass ID uniqueness validation
    const isIdDuplicate = applications.some(existing => 
      existing.id.trim().toUpperCase() === app.id.trim().toUpperCase()
    );

    if (isIdDuplicate) {
      alert("⚠️ Alert: Gate Pass Number already entered. Please use the next available number.");
      return;
    }

    setApplications(prev => [...prev, app]);
  };

  const handleUpdateApplication = (updatedApp: InternshipApplication) => {
    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setView('home');
  };

  return (
    <div className={`min-h-screen flex flex-col ${view === 'home' ? 'hero-bg' : 'bg-[#fcfcfc]'}`}>
      <header className={`py-6 px-6 md:px-12 flex justify-between items-center transition-all duration-500 z-50 ${view === 'home' ? 'bg-transparent' : 'bg-ssp-blue text-white shadow-2xl sticky top-0'}`}>
        <div className="flex items-center space-x-6 cursor-pointer group" onClick={() => setView('home')}>
          <div className="bg-white p-3 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform">
            <div className="w-12 h-12 bg-ssp-blue rounded-lg flex items-center justify-center font-black text-white text-3xl">S</div>
          </div>
          <div className="flex flex-col text-left">
            <h1 className={`heading-text uppercase tracking-[0.3em] leading-none text-white`}>Salem Steel Plant</h1>
            <span className={`text-[11px] font-black uppercase tracking-[0.4em] mt-1 ${view === 'home' ? 'text-blue-200' : 'text-blue-100 opacity-80'}`}>Steel Authority of India Limited</span>
          </div>
        </div>
        
        <nav className="flex items-center space-x-10">
          {view !== 'home' && (
            <button onClick={() => setView('home')} className="flex items-center space-x-3 hover:text-blue-300 transition-all font-black uppercase text-sm tracking-widest border-b-2 border-transparent hover:border-blue-300 pb-1">
              <Home size={22} />
              <span className="hidden lg:inline">Back to Home</span>
            </button>
          )}
          {isAdminLoggedIn && (
            <button onClick={handleLogout} className="flex items-center space-x-3 bg-red-600 hover:bg-black px-8 py-3 rounded-xl transition-all shadow-2xl font-black uppercase text-xs tracking-[0.2em]">
              <LogOut size={20} />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12 max-w-7xl relative">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn space-y-24">
            <div className="text-center space-y-8 max-w-4xl">
              <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 mb-2">
                <Building2 size={16} className="text-blue-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Salem Unit • HRD Division</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight uppercase leading-[1.1]">
                Vocational Training and <br />
                <span className="text-blue-400">Training for College Students</span>
              </h2>
              <div className="w-48 h-1.5 bg-blue-500 mx-auto rounded-full mb-8 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
              <p className="normal-text text-gray-200 text-xl font-medium italic max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                Centralized professional gateway for specialized Training, Internships, and Academic Collaborations.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-16 w-full pt-6">
              <PortalCard variant="circle" title="Student Portal" description="Submit group or individual applications for training or internships." icon={<User size={64} />} onClick={() => setView('student')} />
              <PortalCard variant="plate" title="Admin Portal" description="Secure hub for management to process records and generate documentation." icon={<ShieldCheck size={64} />} onClick={() => setView('admin')} />
            </div>
          </div>
        )}

        {view === 'student' && (
          <div className="animate-fadeIn">
             <div className="mb-12 flex items-center justify-between border-b-4 border-ssp-blue pb-8 bg-white p-10 rounded-t-3xl border-2 border-b-0 border-gray-100">
               <div className="flex items-center space-x-6 text-left">
                 <div className="bg-ssp-blue text-white p-4 rounded-2xl"><User size={32} /></div>
                 <div>
                    <h2 className="heading-text text-ssp-blue text-4xl leading-none">Trainee Application Hub</h2>
                    <p className="normal-text text-gray-400 font-bold italic mt-2">New Trainee Registration Phase 2024-25</p>
                 </div>
               </div>
               <button onClick={() => setView('home')} className="flex items-center gap-2 bg-gray-100 px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-black hover:text-white transition-all shadow-md"><ArrowLeft size={16} /> Back to Home</button>
             </div>
             <StudentForm onSubmit={handleAddApplication} existingApps={applications} />
          </div>
        )}

        {view === 'admin' && (
          <div className="animate-fadeIn">
            {!isAdminLoggedIn ? (
              <LoginForm onLogin={() => setIsAdminLoggedIn(true)} />
            ) : (
              <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-gray-100">
                <AdminDashboard applications={applications} onUpdate={handleUpdateApplication} onDelete={handleDeleteApplication} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={`py-16 text-center transition-colors duration-500 ${view === 'home' ? 'bg-black/50 backdrop-blur-md text-white' : 'bg-gray-100 text-gray-800'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-white/10 pt-10">
            <p className="normal-text font-black uppercase tracking-[0.4em] text-xs opacity-60">
              &copy; {new Date().getFullYear()} Salem Steel Plant Unit • Specialized Training Management
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
