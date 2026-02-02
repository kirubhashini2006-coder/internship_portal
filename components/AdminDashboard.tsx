
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Edit2, Trash2, Eye, Download, 
  Users, Clock, CheckCircle2, AlertCircle, 
  FileBadge, CreditCard, CalendarDays, ArrowLeft,
  Printer, Save, FileText, CheckSquare, 
  ShieldAlert, UserCheck, FileInput, MapPin, 
  ArrowRight, FileType, Shield, ListChecks,
  ChevronUp, ChevronDown, ArrowUpDown, BadgeIndianRupee,
  Award, FileSignature, PlayCircle, Upload, X,
  Check, XCircle, TrendingUp, BarChart3, PieChart,
  Layers, FileClock, Activity, Filter, Layout,
  Calendar, Briefcase, Landmark, FileDown
} from 'lucide-react';
import { InternshipApplication } from '../types';
import StudentForm from './StudentForm';

interface AdminDashboardProps {
  applications: InternshipApplication[];
  onUpdate: (app: InternshipApplication) => void;
  onDelete: (id: string) => void;
}

type AdminView = 
  | 'dashboard' 
  | 'new_data_list'
  | 'old_data_list'
  | 'application_list' 
  | 'lookup_details' 
  | 'financial_report'
  | 'doc_gate_pass_schedule' 
  | 'doc_rate_chart' 
  | 'doc_safety' 
  | 'doc_entry_pass'
  | 'doc_required_docs'
  | 'doc_certificate';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ applications, onUpdate, onDelete }) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [activeApp, setActiveApp] = useState<InternshipApplication | null>(null);
  const [editingApp, setEditingApp] = useState<InternshipApplication | null>(null);

  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');

  const [certFields, setCertFields] = useState({
    refNo: 'TR-15(4)/039228/5190',
    date: '30/12/2025',
    signatoryName: 'Lingadev S B',
    signatoryTitle: 'Deputy Manager (HR)'
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (file && activeApp) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedApp = {
          ...activeApp,
          documents: {
            ...(activeApp.documents || {}),
            [docType]: base64String
          }
        };
        onUpdate(updatedApp);
        setActiveApp(updatedApp);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (docType: string) => {
    if (activeApp && activeApp.documents) {
      const newDocs = { ...activeApp.documents };
      delete newDocs[docType];
      const updatedApp = {
        ...activeApp,
        documents: newDocs
      };
      onUpdate(updatedApp);
      setActiveApp(updatedApp);
    }
  };

  const { newData, oldData } = useMemo(() => {
    const now = Date.now();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const newItems: InternshipApplication[] = [];
    const oldItems: InternshipApplication[] = [];
    applications.forEach(app => {
      const createdAt = app.createdAt ? new Date(app.createdAt).getTime() : 0;
      if (now - createdAt <= SEVEN_DAYS_MS) {
        newItems.push(app);
      } else {
        oldItems.push(app);
      }
    });
    return { newData: newItems, oldData: oldItems };
  }, [applications]);

  const filteredNewData = useMemo(() => {
    if (!newSearchTerm) return newData;
    const term = newSearchTerm.toLowerCase();
    return newData.filter(app => 
      app.id.toLowerCase().includes(term) || 
      app.applicationNo.toLowerCase().includes(term) ||
      app.studentName.toLowerCase().includes(term)
    );
  }, [newData, newSearchTerm]);

  const filteredOldData = useMemo(() => {
    return oldData.filter(app => {
      const matchesSearch = searchTerm === '' || 
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.applicationNo.toLowerCase().includes(searchTerm.toLowerCase());
      const createdAt = app.createdAt ? new Date(app.createdAt) : null;
      let matchesDates = true;
      if (createdAt) {
        if (filterFromDate) {
          const from = new Date(filterFromDate);
          if (createdAt < from) matchesDates = false;
        }
        if (filterToDate) {
          const to = new Date(filterToDate);
          to.setHours(23, 59, 59, 999);
          if (createdAt > to) matchesDates = false;
        }
      }
      return matchesSearch && matchesDates;
    });
  }, [oldData, searchTerm, filterFromDate, filterToDate]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'Pending').length,
      approved: applications.filter(a => a.status === 'Approved').length,
      ongoing: applications.filter(a => {
        if (a.status !== 'Approved') return false;
        const start = new Date(a.fromDate);
        const end = new Date(a.toDate);
        return today >= start && today <= end;
      }).length,
    };
  }, [applications]);

  const CircularCard = ({ label, count, color, onClick }: { label: string, count: number, color: string, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110 shadow-2xl border-4 ${color}`}
    >
      <div className="text-center">
        <p className="text-6xl font-black mb-1">{count}</p>
        <p className="text-xs font-black uppercase tracking-widest opacity-80">{label}</p>
      </div>
      <div className="absolute bottom-6 bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">View Data Archive</div>
    </div>
  );

  const DashboardHome = () => (
    <div className="space-y-16 animate-fadeIn no-print py-6">
      <div className="bg-ssp-blue p-12 rounded-3xl shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10"><Shield size={200} /></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-widest leading-none">Officer Control Hub</h2>
              <p className="text-blue-200 text-lg font-bold italic">Authorized Data Management & Audit Monitoring</p>
              <div className="pt-6 flex gap-4">
                 <button onClick={() => setCurrentView('financial_report')} className="bg-white text-ssp-blue px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-blue-400 hover:text-white transition-all shadow-lg"><BarChart3 size={18}/> Financial Report</button>
                 <button onClick={() => setCurrentView('application_list')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-black transition-all shadow-lg"><ListChecks size={18}/> Full Database</button>
              </div>
           </div>
           <div className="flex flex-col sm:flex-row gap-12">
             <CircularCard 
                label="Old Data Archive" 
                count={oldData.length} 
                color="bg-slate-700 border-slate-500 text-white" 
                onClick={() => setCurrentView('old_data_list')}
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="bg-white border-2 border-gray-100 p-10 rounded-2xl shadow-xl flex items-center space-x-8">
          <div className="bg-blue-100 text-ssp-blue p-5 rounded-xl"><Layers size={40} /></div>
          <div><p className="text-xs font-black uppercase text-gray-400 tracking-widest">Total</p><p className="text-4xl font-black text-gray-800">{stats.total}</p></div>
        </div>
        <div className="bg-white border-2 border-gray-100 p-10 rounded-2xl shadow-xl flex items-center space-x-8">
          <div className="bg-orange-100 text-orange-600 p-5 rounded-xl"><FileClock size={40} /></div>
          <div><p className="text-xs font-black uppercase text-gray-400 tracking-widest">Pending</p><p className="text-4xl font-black text-orange-600">{stats.pending}</p></div>
        </div>
        <div className="bg-white border-2 border-gray-100 p-10 rounded-2xl shadow-xl flex items-center space-x-8">
          <div className="bg-green-100 text-green-600 p-5 rounded-xl"><CheckCircle2 size={40} /></div>
          <div><p className="text-xs font-black uppercase text-gray-400 tracking-widest">Approved</p><p className="text-4xl font-black text-green-600">{stats.approved}</p></div>
        </div>
        <div className="bg-white border-2 border-gray-100 p-10 rounded-2xl shadow-xl flex items-center space-x-8">
          <div className="bg-indigo-100 text-indigo-600 p-5 rounded-xl"><Activity size={40} /></div>
          <div><p className="text-xs font-black uppercase text-gray-400 tracking-widest">Ongoing</p><p className="text-4xl font-black text-indigo-600">{stats.ongoing}</p></div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-3xl p-10 shadow-xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-6 gap-6">
           <div className="flex items-center gap-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl"><Clock size={24}/></div>
              <div>
                 <h3 className="heading-text text-gray-800 text-xl">New Registrations</h3>
                 <p className="text-xs font-bold text-gray-400 uppercase italic">Submitted within the last 7 days</p>
              </div>
           </div>
           <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="ID or App No..." 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl outline-none font-bold text-sm focus:border-emerald-500 transition-all"
                  value={newSearchTerm}
                  onChange={(e) => setNewSearchTerm(e.target.value)}
                />
             </div>
             <div className="hidden sm:block bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">
                {newData.length} Entries
             </div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100 text-xs font-black uppercase text-gray-400">
                <th className="py-5 px-4">App No</th>
                <th className="py-5 px-4">Gate Pass ID</th>
                <th className="py-5 px-4">Student Name</th>
                <th className="py-5 px-4">Submission</th>
                <th className="py-5 px-4">Training Period</th>
                <th className="py-5 px-4">Status</th>
                <th className="py-5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredNewData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-gray-400 italic font-bold bg-gray-50/50 rounded-xl">
                    {newSearchTerm ? `No records matching "${newSearchTerm}" in recent registrations.` : "No new applications received in the last 7 days."}
                  </td>
                </tr>
              ) : (
                filteredNewData.map(app => (
                  <tr key={app.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-6 px-4 font-black text-gray-700">{app.applicationNo}</td>
                    <td className="py-6 px-4 font-black text-ssp-blue">{app.id}</td>
                    <td className="py-6 px-4 font-bold">{app.studentName}</td>
                    <td className="py-6 px-4 font-bold text-gray-500">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="py-6 px-4 font-bold text-gray-400 text-xs">({app.fromDate} - {app.toDate})</td>
                    <td className="py-6 px-4">
                      <span className={`px-4 py-1.5 rounded text-xs font-black uppercase ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>{app.status}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setActiveApp(app); setCurrentView('lookup_details'); }} className="p-2 text-ssp-blue border rounded hover:bg-blue-50"><Eye size={16} /></button>
                        <button onClick={() => setEditingApp(app)} className="p-2 text-gray-600 border rounded hover:bg-gray-50"><Edit2 size={16} /></button>
                        <button onClick={() => onDelete(app.id)} className="p-2 text-red-600 border rounded hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-10 pt-10 border-t border-gray-100">
        <h3 className="heading-text text-ssp-blue inline-block uppercase text-xl">Official Documentation</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { id: 'doc_certificate', label: 'Certificate', icon: <Award />, color: 'bg-emerald-800' },
            { id: 'doc_gate_pass_schedule', label: 'Gate Pass', icon: <Layout />, color: 'bg-blue-800' },
            { id: 'doc_rate_chart', label: 'Rate Chart', icon: <BadgeIndianRupee />, color: 'bg-slate-700' },
            { id: 'doc_required_docs', label: 'Required Docs', icon: <ListChecks />, color: 'bg-amber-700' },
          ].map((box) => (
            <div key={box.id} onClick={() => setCurrentView(box.id as AdminView)} className="bg-white border p-8 rounded-xl shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center border-b-4 border-gray-200">
              <div className={`${box.color} text-white p-5 rounded-xl mb-4`}>{React.cloneElement(box.icon as React.ReactElement<{size?: number}>, { size: 32 })}</div>
              <h4 className="text-xs font-black uppercase tracking-widest">{box.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const GenericListView = ({ title, data, isOld = false }: { title: string, data: InternshipApplication[], isOld?: boolean }) => (
    <div className="space-y-10 animate-fadeIn no-print py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="flex items-center gap-4">
           <button onClick={() => { setCurrentView('dashboard'); setSearchTerm(''); setFilterFromDate(''); setFilterToDate(''); }} className="flex items-center gap-2 text-ssp-blue font-black uppercase text-base hover:scale-105 transition-transform"><ArrowLeft size={24} /> Dashboard</button>
           <h2 className="text-2xl font-black uppercase text-gray-700 border-l-4 border-ssp-blue pl-4">{title}</h2>
        </div>
        {isOld && (
          <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="ID or App No..." 
                  className="pl-10 pr-4 py-2 border rounded-lg outline-none font-bold text-sm w-48 focus:border-ssp-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <input type="date" className="p-2 border rounded-lg text-xs font-bold" value={filterFromDate} onChange={(e) => setFilterFromDate(e.target.value)} />
                <span className="text-xs font-bold text-gray-400">to</span>
                <input type="date" className="p-2 border rounded-lg text-xs font-bold" value={filterToDate} onChange={(e) => setFilterToDate(e.target.value)} />
             </div>
             <button onClick={() => { setSearchTerm(''); setFilterFromDate(''); setFilterToDate(''); }} className="text-xs font-black text-red-500 uppercase hover:underline">Clear</button>
          </div>
        )}
      </div>
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b-2 border-gray-100">
            <tr className="text-xs font-black uppercase text-gray-400">
              <th className="py-6 px-6">App No</th>
              <th className="py-6 px-6">Gate Pass ID</th>
              <th className="py-6 px-6">Student Name</th>
              <th className="py-6 px-6">Submission</th>
              <th className="py-6 px-6">Training Period</th>
              <th className="py-6 px-6">Status</th>
              <th className="py-6 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-20 text-center text-gray-400 italic font-bold">No records found in this category.</td>
              </tr>
            ) : (
              data.map(app => (
                <tr key={app.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-6 px-6 font-black text-gray-700">{app.applicationNo}</td>
                  <td className="py-6 px-6 font-black text-ssp-blue">{app.id}</td>
                  <td className="py-6 px-6 font-bold">{app.studentName}</td>
                  <td className="py-6 px-6 font-bold text-gray-500">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="py-6 px-6 font-bold text-gray-400 text-xs">({app.fromDate} - {app.toDate})</td>
                  <td className="py-6 px-6">
                    <span className={`px-5 py-2 rounded text-xs font-black uppercase ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>{app.status}</span>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => { setActiveApp(app); setCurrentView('lookup_details'); }} className="p-2 text-ssp-blue border rounded hover:bg-blue-50"><Eye size={18} /></button>
                      <button onClick={() => setEditingApp(app)} className="p-2 text-gray-600 border rounded hover:bg-gray-50"><Edit2 size={18} /></button>
                      <button onClick={() => onDelete(app.id)} className="p-2 text-red-600 border rounded hover:bg-red-50"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const FinancialReportView = () => {
    const [reportFrom, setReportFrom] = useState('');
    const [reportTo, setReportTo] = useState('');
    const audit = useMemo(() => {
      const filteredApps = applications.filter(app => {
        const createdAt = app.createdAt ? new Date(app.createdAt) : null;
        if (!createdAt) return true;
        if (reportFrom) {
          const from = new Date(reportFrom);
          if (createdAt < from) return false;
        }
        if (reportTo) {
          const to = new Date(reportTo);
          to.setHours(23, 59, 59, 999);
          if (createdAt > to) return false;
        }
        return true;
      });
      const internshipApps = filteredApps.filter(a => a.trainingType === 'Internship');
      const iAmount = internshipApps.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);
      const projectApps = filteredApps.filter(a => a.trainingType === 'Project');
      const pAmount = projectApps.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0);
      const deptStats: { [key: string]: number } = {};
      const categoryStats: { [key: string]: number } = {};
      filteredApps.forEach(a => {
        const amt = parseFloat(a.amount) || 0;
        const dept = a.deptIPT || 'General';
        deptStats[dept] = (deptStats[dept] || 0) + amt;
        const cat = a.category || 'Unspecified';
        categoryStats[cat] = (categoryStats[cat] || 0) + amt;
      });
      return { 
        filteredApps,
        internshipCount: internshipApps.length, 
        projectCount: projectApps.length, 
        total: iAmount + pAmount,
        deptStats: Object.entries(deptStats).sort((a, b) => b[1] - a[1]),
        categoryStats: Object.entries(categoryStats).sort((a, b) => b[1] - a[1]),
        avgPerStudent: filteredApps.length > 0 ? (iAmount + pAmount) / filteredApps.length : 0
      };
    }, [applications, reportFrom, reportTo]);

    return (
      <div className="space-y-12 animate-fadeIn py-6">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center no-print px-4 gap-6">
            <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-3 text-ssp-blue font-black uppercase text-base hover:scale-105 transition-all"><ArrowLeft size={24} /> Dashboard</button>
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border-2 border-ssp-blue shadow-lg">
               <div className="flex items-center gap-3">
                  <Filter size={20} className="text-ssp-blue" />
                  <span className="font-black uppercase text-xs text-ssp-blue">Audit Date Range:</span>
               </div>
               <div className="flex items-center gap-3">
                  <input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} className="p-2 border rounded-lg text-xs font-bold focus:ring-2 focus:ring-ssp-blue outline-none" />
                  <span className="text-xs font-black text-gray-400">to</span>
                  <input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} className="p-2 border rounded-lg text-xs font-bold focus:ring-2 focus:ring-ssp-blue outline-none" />
               </div>
               {(reportFrom || reportTo) && (
                 <button onClick={() => { setReportFrom(''); setReportTo(''); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-red-600 hover:text-white transition-all">Reset Filter</button>
               )}
            </div>
            <button onClick={() => window.print()} className="bg-ssp-blue text-white px-10 py-4 rounded-lg font-black text-sm flex items-center gap-3 shadow-xl hover:bg-black transition-all"><Printer size={22} /> Print Audit Ledger</button>
         </div>
         <div className="bg-white border-[1px] border-black p-12 space-y-16 print-container shadow-2xl font-serif">
            <div className="text-center space-y-6 border-b-2 border-black pb-10">
               <h1 className="text-4xl font-black uppercase tracking-[0.2em]">Financial Audit & Collection Report</h1>
               <div className="space-y-1">
                  <p className="text-2xl font-bold">Steel Authority of India Limited</p>
                  <p className="text-xl font-bold">Salem Steel Plant - Human Resource Development Centre</p>
               </div>
               <div className="flex justify-between items-end pt-10 px-4">
                  <p className="text-sm font-bold border-b-2 border-black pb-1">Ref: SSP/HRD/FIN/{new Date().getFullYear()}/{(Math.floor(Math.random() * 9000) + 1000)}</p>
                  <div className="text-right">
                    <p className="text-base italic font-bold">Generated On: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="col-span-1 space-y-6">
                  <h3 className="font-black text-xl underline uppercase flex items-center gap-3"><TrendingUp size={24}/> Trainee Summary</h3>
                  <div className="space-y-4 text-lg font-bold">
                     <div className="flex justify-between border-b pb-2"><span>Internship Students</span><span>{audit.internshipCount}</span></div>
                     <div className="flex justify-between border-b pb-2"><span>Project Students</span><span>{audit.projectCount}</span></div>
                     <div className="flex justify-between border-b-2 border-black pt-4 pb-2"><span>Total Volume</span><span>{audit.filteredApps.length} Students</span></div>
                  </div>
               </div>
               <div className="col-span-2 bg-gray-50 p-10 rounded-2xl border-2 border-black text-center flex flex-col justify-center items-center shadow-inner">
                  <div className="flex items-center gap-4 text-gray-500 font-black uppercase tracking-widest text-sm mb-6">
                     <Landmark size={24} /> 
                     <span>Total Revenue Consolidated (INR)</span>
                  </div>
                  <p className="text-8xl font-black text-ssp-blue">₹{audit.total.toLocaleString()}</p>
               </div>
            </div>
            <div className="pt-10 space-y-8">
               <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <h3 className="font-black text-xl uppercase flex items-center gap-3"><ListChecks size={22}/> Consolidated Transaction Ledger</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-black text-xs">
                     <thead>
                        <tr className="bg-gray-100 font-black uppercase text-center">
                           <th className="border border-black p-2">App No</th>
                           <th className="border border-black p-2">Trainee Name</th>
                           <th className="border border-black p-2">Category</th>
                           <th className="border border-black p-2">Ref No (DD)</th>
                           <th className="border border-black p-2">Bank</th>
                           <th className="border border-black p-2">Amount (₹)</th>
                        </tr>
                     </thead>
                     <tbody>
                        {audit.filteredApps.length === 0 ? (
                           <tr><td colSpan={6} className="text-center p-10 italic">No transactions recorded for the selected period.</td></tr>
                        ) : (
                           audit.filteredApps.slice(0, 50).map(app => (
                              <tr key={app.id} className="text-center font-bold">
                                 <td className="border border-black p-2">{app.applicationNo}</td>
                                 <td className="border border-black p-2 text-left px-4">{app.studentName}</td>
                                 <td className="border border-black p-2">{app.category}</td>
                                 <td className="border border-black p-2">{app.ddNumber || 'N/A'}</td>
                                 <td className="border border-black p-2 truncate max-w-[100px]">{app.ddBank || 'Direct'}</td>
                                 <td className="border border-black p-2">₹{app.amount}</td>
                              </tr>
                           ))
                        )}
                        <tr className="bg-black text-white font-black text-base">
                           <td colSpan={5} className="border border-black p-4 text-right pr-10 uppercase tracking-widest">Grand Total Balance</td>
                           <td className="border border-black p-4 text-center">₹{audit.total.toLocaleString()}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
            <div className="mt-24 flex justify-between pt-24 px-6 border-t-2 border-black border-dashed">
               <div className="text-center">
                  <div className="w-64 border-t-2 border-black mb-3"></div>
                  <p className="font-black text-sm uppercase">Officer - Accounts<br/>Salem Steel Plant</p>
               </div>
               <div className="text-center">
                  <div className="w-64 border-t-2 border-black mb-3"></div>
                  <p className="font-black text-sm uppercase">Asst. General Manager (HRD)<br/>Salem Steel Plant</p>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const DocumentWrapper = ({ title, children, docType, showStudentPicker = true }: { title: string, children: React.ReactNode, docType?: string, showStudentPicker?: boolean }) => {
    const effectiveDocType = docType || (currentView as string);
    const isUploadable = ['doc_rate_chart', 'doc_safety', 'doc_required_docs'].includes(effectiveDocType);
    const [viewMode, setViewMode] = useState<'generate' | 'upload'>(isUploadable && activeApp?.documents?.[effectiveDocType] ? 'upload' : 'generate');

    return (
      <div className="animate-fadeIn pb-24 space-y-12 py-6">
        <div className="flex justify-between items-center no-print px-6">
          <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-3 text-ssp-blue font-black uppercase text-base hover:scale-105 transition-all"><ArrowLeft size={24} /> Dashboard</button>
          <div className="flex items-center gap-6">
            {isUploadable && (
              <div className="flex bg-gray-100 p-2 rounded-lg">
                <button onClick={() => setViewMode('generate')} className={`px-6 py-2.5 rounded font-black text-xs uppercase ${viewMode === 'generate' ? 'bg-white shadow' : 'text-gray-500'}`}>Template</button>
                <button onClick={() => setViewMode('upload')} className={`px-6 py-2.5 rounded font-black text-xs uppercase ${viewMode === 'upload' ? 'bg-white shadow' : 'text-gray-500'}`}>Upload Scanned</button>
              </div>
            )}
            {showStudentPicker && (
              <select className="border-2 border-ssp-blue p-4 rounded-lg text-sm font-black" onChange={(e) => setActiveApp(applications.find(a => a.id === e.target.value) || null)} value={activeApp?.id || ''}>
                <option value="">Select Student</option>
                {applications.map(a => <option key={a.id} value={a.id}>{a.studentName} ({a.id})</option>)}
              </select>
            )}
            {viewMode === 'generate' && activeApp && (
              <div className="flex gap-4">
                <button onClick={() => window.print()} className="bg-ssp-blue text-white px-8 py-4 rounded-lg font-black text-sm flex items-center gap-3 shadow-lg hover:bg-black transition-all"><Printer size={22} /> Print</button>
                {effectiveDocType === 'doc_certificate' && (
                  <button onClick={() => window.print()} className="bg-emerald-700 text-white px-8 py-4 rounded-lg font-black text-sm flex items-center gap-3 shadow-lg hover:bg-black transition-all"><FileDown size={22} /> Download PDF</button>
                )}
              </div>
            )}
          </div>
        </div>
        {viewMode === 'upload' && isUploadable && activeApp ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-10 min-h-[700px] shadow-inner">
            <div className="bg-blue-50 p-12 rounded-full text-ssp-blue"><Upload size={80} /></div>
            <h2 className="heading-text text-ssp-blue text-4xl">Digital Archive - {title}</h2>
            {activeApp.documents?.[effectiveDocType] ? (
              <div className="space-y-8 w-full max-w-2xl">
                 <div className="bg-green-50 border-2 border-green-200 p-10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-6"><FileType size={48} className="text-green-600" /><div><p className="font-black text-green-700 uppercase tracking-widest text-base">Archived</p></div></div>
                    <div className="flex gap-3">
                       <a href={activeApp.documents[effectiveDocType]} download={`SSP_${activeApp.id}_${title}.png`} className="bg-green-600 text-white p-4 rounded-xl hover:bg-black transition-all"><Download size={24} /></a>
                       <button onClick={() => removeFile(effectiveDocType)} className="bg-red-500 text-white p-4 rounded-xl hover:bg-black transition-all"><X size={24} /></button>
                    </div>
                 </div>
                 <img src={activeApp.documents[effectiveDocType]} alt="Doc" className="w-full h-auto max-h-[600px] object-contain border rounded shadow-2xl" />
              </div>
            ) : (
              <label className="cursor-pointer bg-ssp-blue text-white px-20 py-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center gap-6 text-base">
                <Upload size={28} /> Select File
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, effectiveDocType)} />
              </label>
            )}
          </div>
        ) : (
          <div className={`bg-white p-8 min-h-[1100px] shadow-2xl relative font-sans print-container ${['doc_certificate', 'doc_gate_pass_schedule'].includes(effectiveDocType) ? 'border-none' : 'border-black border-[1px]'}`}>
            {!activeApp ? (
              <div className="flex flex-col items-center justify-center h-[800px] space-y-8 text-center text-gray-400">
                <Users size={120} className="opacity-10" />
                <p className="text-2xl font-black uppercase tracking-widest">No Student Selected</p>
                <p className="max-w-md italic">Please select a trainee from the dropdown menu above to view and generate their documentation.</p>
              </div>
            ) : children}
          </div>
        )}
      </div>
    );
  };

  if (editingApp) {
    return (
      <div className="space-y-8 animate-fadeIn py-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="heading-text text-ssp-blue text-2xl uppercase">Modify Trainee Record</h2>
          <button onClick={() => setEditingApp(null)} className="text-gray-400 hover:text-red-600 font-black uppercase text-xs">Discard Changes</button>
        </div>
        <StudentForm mode="edit" initialData={editingApp} onSubmit={(updated) => { onUpdate(updated); setEditingApp(null); alert("Updated."); }} />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardHome />;
      case 'new_data_list': return <GenericListView title="New Registrations (Within 7 Days)" data={newData} />;
      case 'old_data_list': return <GenericListView title="Old Data Archive" data={filteredOldData} isOld={true} />;
      case 'application_list': return <GenericListView title="Master List (Full Database)" data={applications} isOld={true} />;
      case 'financial_report': return <FinancialReportView />;
      case 'lookup_details':
        return (
          <DocumentWrapper title="Student Information File" showStudentPicker={true}>
            {activeApp && (
              <div className="p-8">
                <div className="grid grid-cols-2 gap-10 border-b-2 border-black pb-10">
                  <div className="space-y-4">
                      <div><p className="text-xs uppercase font-black text-gray-400">Student Name</p><p className="font-black text-xl">{activeApp.studentName}</p></div>
                      <div><p className="text-xs uppercase font-black text-gray-400">Gate Pass ID</p><p className="font-black text-ssp-blue text-lg">{activeApp.id}</p></div>
                  </div>
                  <div className="space-y-4">
                      <div><p className="text-xs uppercase font-black text-gray-400">Application Status</p><p className="font-black uppercase text-ssp-blue">{activeApp.status}</p></div>
                      <div><p className="text-xs uppercase font-black text-gray-400">Mobile Number</p><p className="font-bold">{activeApp.mobileNo}</p></div>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                      <h4 className="font-black uppercase underline">Training Details</h4>
                      <p><b>Type:</b> {activeApp.trainingType}</p>
                      <p><b>Dates:</b> {activeApp.fromDate} to {activeApp.toDate}</p>
                      <p><b>Dept:</b> {activeApp.deptIPT}</p>
                  </div>
                </div>
              </div>
            )}
          </DocumentWrapper>
        );
      case 'doc_gate_pass_schedule':
        return (
          <DocumentWrapper title="Vocational Trainee Pass" docType="doc_gate_pass_schedule">
            {activeApp && (
              <div className="flex flex-col h-full bg-white text-black p-1 font-sans border-[1px] border-black max-w-[900px] mx-auto">
                {/* Top Prohibited Area Banner */}
                <div className="border-b-[1px] border-black text-center py-1.5 font-bold text-sm underline">
                   Steel Melting Shop(SMS) is HIGHLY PROHIBITED AREA. Do not enter
                </div>

                {/* Main Header with Logo and Pass No */}
                <div className="flex border-b-[1px] border-black">
                   <div className="flex-[3] p-2 flex items-center space-x-4 border-r-[1px] border-black">
                      <div className="w-14 h-14 relative flex items-center justify-center">
                         <div className="absolute inset-0 border-[3px] border-black rotate-45 flex items-center justify-center">
                            <div className="w-5 h-5 border-[2px] border-black -rotate-45 font-black text-[6px]">सेल SAIL</div>
                         </div>
                      </div>
                      <div className="text-[11px] leading-[1.1] font-bold uppercase">
                         <p>Steel Authority of India Ltd</p>
                         <p className="font-black">Salem Steel Plant</p>
                         <p>Human Resources Development Centre</p>
                      </div>
                   </div>
                   <div className="flex-[3] p-2 flex flex-col justify-center items-end pr-8">
                      <p className="text-2xl font-black uppercase tracking-widest">PASS NO : {activeApp.passNo || activeApp.id}</p>
                      <h2 className="text-3xl font-black uppercase mt-1 tracking-tight">VOCATIONAL TRAINEE</h2>
                   </div>
                </div>

                {/* Primary Student Details Block */}
                <div className="flex">
                   <div className="flex-[4] border-r-[1px] border-black">
                      {/* Name Section */}
                      <div className="border-b-[1px] border-black p-3 h-[55px] flex items-center">
                         <span className="font-bold text-sm uppercase mr-4">Name :</span>
                         <span className="text-xl font-bold uppercase">{activeApp.studentName}</span>
                      </div>
                      {/* Age and Sex Section */}
                      <div className="border-b-[1px] border-black flex h-[55px]">
                         <div className="flex-1 p-3 flex items-center border-r-[1px] border-black">
                            <span className="font-bold text-sm uppercase mr-4">Age :</span>
                            <span className="text-lg font-bold">{activeApp.age}</span>
                         </div>
                         <div className="flex-1 p-3 flex items-center">
                            <span className="font-bold text-sm uppercase mr-4">Sex :</span>
                            <span className="text-lg font-bold">{activeApp.gender}</span>
                         </div>
                      </div>
                      {/* Identification Mark Section */}
                      <div className="border-b-[1px] border-black p-3 min-h-[100px]">
                         <p className="font-bold text-sm uppercase mb-2">Identification mark :</p>
                         <p className="text-lg font-medium italic pl-4">{activeApp.identificationMark}</p>
                      </div>
                      {/* Course Details Section */}
                      <div className="p-3 min-h-[90px]">
                         <p className="font-bold text-sm uppercase">Course of Study, :</p>
                         <p className="text-lg font-medium pl-4">Branch and year: {activeApp.course} ({activeApp.specialization}), {activeApp.year}</p>
                      </div>
                   </div>
                   {/* Standard Photo Holder */}
                   <div className="flex-[1.5] flex flex-col items-center justify-center border-b-[1px] border-black bg-gray-50/30">
                      <div className="w-44 h-52 border-2 border-black border-dashed flex items-center justify-center text-center p-6 bg-white">
                         <p className="text-[12px] font-black text-black opacity-30 uppercase leading-relaxed tracking-tighter">PHOTO<br/>(Ensure the size to this box)</p>
                      </div>
                   </div>
                </div>

                {/* Institutional and Residential Addresses */}
                <div className="flex border-t-[1px] border-black">
                   <div className="flex-1 border-r-[1px] border-black p-3 min-h-[180px]">
                      <p className="font-bold text-sm uppercase mb-3 underline underline-offset-4">Address of Institution/ College</p>
                      <div className="text-sm font-bold leading-relaxed pl-2 uppercase">
                         <p>{activeApp.collegeName}</p>
                         <p className="mt-1 normal-case font-medium">{activeApp.collegeAddress}</p>
                      </div>
                   </div>
                   <div className="flex-1 p-3 min-h-[180px]">
                      <p className="font-bold text-sm uppercase mb-3 underline underline-offset-4">Address of residence / correspondence</p>
                      <div className="text-sm font-medium leading-relaxed pl-2">
                         {activeApp.residentialAddress}
                      </div>
                   </div>
                </div>

                {/* Training and Validity Attributes */}
                <div className="border-y-[1px] border-black">
                   <div className="flex border-b-[1px] border-black p-3 h-[45px] items-center">
                      <span className="font-bold text-sm uppercase w-60">Nature of Training</span>
                      <span className="font-bold mr-6">:</span>
                      <span className="text-lg font-bold uppercase">{activeApp.trainingType} / Project Work</span>
                   </div>
                   <div className="flex border-b-[1px] border-black p-3 h-[45px] items-center">
                      <span className="font-bold text-sm uppercase w-60">Area of Training</span>
                      <span className="font-bold mr-6">:</span>
                      <span className="text-lg font-bold uppercase">{activeApp.deptIPT || 'HRM / CRM / ADMN'}</span>
                   </div>
                   {/* Trainee Signature Placeholder */}
                   <div className="flex border-b-[1px] border-black p-4 h-[75px] items-start bg-gray-50/20">
                      <div className="flex-1">
                         <span className="font-bold text-sm uppercase block">Signature of trainee/Student :</span>
                         <span className="font-bold text-sm uppercase block mt-1">with date :</span>
                      </div>
                   </div>
                   {/* Date Validity Metrics */}
                   <div className="flex p-4 h-[55px] items-center bg-gray-100/30">
                      <span className="font-bold text-sm uppercase mr-3">Validity of pass From</span>
                      <span className="border-b-[2px] border-black px-4 font-black text-lg min-w-[120px] text-center">{activeApp.fromDate}</span>
                      <span className="font-bold text-sm uppercase mx-4">To</span>
                      <span className="border-b-[2px] border-black px-4 font-black text-lg min-w-[120px] text-center">{activeApp.toDate}</span>
                      <span className="font-bold text-sm uppercase ml-8 mr-3">Total no. of days:</span>
                      <span className="border-b-[2px] border-black px-6 font-black text-lg text-center">{activeApp.days}</span>
                   </div>
                </div>

                {/* Internal Verification Section */}
                <div className="mt-6">
                   <p className="text-center font-black italic underline tracking-[0.3em] text-[13px] mb-3">FOR OFFICE USE ONLY</p>
                   <div className="flex border-[1px] border-black h-[140px]">
                      <div className="flex-1 border-r-[1px] border-black p-4 flex flex-col justify-between">
                         <p className="font-black text-xs uppercase tracking-widest border-b border-black pb-1 inline-block w-fit">Forwarded by HRDC</p>
                         <div className="flex flex-col space-y-3 mt-4 opacity-70">
                            <p className="font-bold text-[10px] uppercase">Signature with date ___________________</p>
                            <p className="font-bold text-[10px] uppercase">Designation _________________________</p>
                         </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                         <p className="font-black text-xs uppercase tracking-widest border-b border-black pb-1 inline-block w-fit">Pass issued</p>
                         <div className="mt-6 opacity-70">
                            <p className="font-bold text-[10px] uppercase">Signature of I/c, CISF ________________</p>
                            <p className="font-bold text-[10px] uppercase mt-3">with date ___________________________</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Official Form Metadata */}
                <div className="flex justify-between items-end mt-4 px-3 pb-3">
                   <p className="text-[11px] font-black tracking-tighter opacity-60 uppercase">Form No.: PER/005/181000</p>
                   <p className="text-[11px] font-black uppercase italic tracking-wide">( PLEASE REFER INSTRUCTIONS OVERLEAF )</p>
                </div>
              </div>
            )}
          </DocumentWrapper>
        );
      case 'doc_certificate':
        return (
          <DocumentWrapper title="Certificate of Training" docType="doc_certificate">
             {activeApp && (
               <div className="flex flex-col h-full bg-white text-black p-4 font-serif">
                  {/* Official SAIL Header */}
                  <div className="flex justify-between items-start mb-12">
                     <div className="w-20 h-20 flex items-center justify-center relative ml-4 mt-2">
                        <div className="absolute inset-0 border-[4px] border-black rotate-45 flex items-center justify-center">
                           <div className="w-8 h-8 border-[3px] border-black -rotate-45"></div>
                        </div>
                     </div>
                     <div className="text-right leading-none space-y-1.5" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        <p className="text-2xl font-bold tracking-tighter">स्टील अथॉरिटी ऑफ इण्डिया लिमिटेड</p>
                        <p className="text-[14px] font-bold">STEEL AUTHORITY OF INDIA LIMITED</p>
                        <p className="text-2xl font-bold">सेलम इस्पात संयंत्र</p>
                        <p className="text-[14px] font-bold">SALEM STEEL PLANT</p>
                     </div>
                  </div>

                  <div className="flex justify-between items-center mb-16 text-xl font-medium px-4">
                     <div>Ref. No. {certFields.refNo}</div>
                     <div>{certFields.date}</div>
                  </div>

                  <div className="text-center mb-24">
                     <h2 className="text-8xl font-black tracking-tight" style={{ fontFamily: 'Crimson Pro, serif' }}>Certificate</h2>
                  </div>

                  <div className="space-y-14 text-[30px] leading-[1.8] text-justify px-12 italic font-medium">
                     <p>
                        Certified that <b>Ms. {activeApp.studentName.toUpperCase()}</b>, <b>{activeApp.year}</b> student of 
                        <b> {activeApp.course.toUpperCase()} ({activeApp.specialization.toUpperCase()})</b> Course, <b>{activeApp.collegeName.toUpperCase()}</b> has undergone <b>{activeApp.trainingType}</b> in the area of <b>{activeApp.deptIPT || 'Electrical Maintenance'}</b> at Salem Steel Plant during the period from <b>{activeApp.fromDate}</b> to <b>{activeApp.toDate}</b>.
                     </p>
                  </div>

                  <div className="mt-auto pt-40 px-8 flex justify-between items-end pb-12">
                     <div className="w-64 h-64 rounded-full border-[3px] border-blue-900 flex items-center justify-center p-4 text-center text-blue-900 opacity-60 relative">
                       <div className="border border-blue-900 rounded-full w-full h-full flex flex-col items-center justify-center p-4 text-[11px] leading-tight font-black uppercase tracking-tighter">
                         <span className="mb-2 text-center font-bold">Steel Authority of India Limited</span>
                         <div className="border-t border-b border-blue-900 py-3 my-2 w-full font-bold">
                           Govt. of India Enterprise<br/>Under the Ministry of Steel
                         </div>
                         <span className="mt-2 font-bold">Salem Steel Plant<br/>Salem-636 013</span>
                       </div>
                       <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-2 text-[10px] font-black">
                         <span>★</span>
                         <span>★</span>
                       </div>
                     </div>

                     <div className="text-right space-y-1 pb-4">
                       <p className="text-3xl font-black">{certFields.signatoryName}</p>
                       <p className="text-2xl font-bold">{certFields.signatoryTitle}</p>
                     </div>
                  </div>

                  <div className="border-t-[3px] border-black pt-4 text-[12px] space-y-2.5">
                     <div className="flex justify-between items-center text-[13px] font-bold px-4">
                       <div className="flex gap-6">
                          <span className="font-black">सेलम - 636 013 तमिलनाडु</span>
                          <span className="font-black">Salem-636 013 Tamil Nadu</span>
                       </div>
                       <div className="flex gap-10">
                          <span className="font-black">दूरभाष : 0427-238 3021</span>
                          <span className="font-black">Phone : 0427-238 3021</span>
                          <span className="font-black">फैक्स : 0427-238 2800</span>
                          <span className="font-black">Fax : 0427-238 2800</span>
                       </div>
                     </div>
                     <div className="flex justify-between items-center text-[13px] font-bold px-4">
                       <div className="flex gap-10">
                          <span className="font-black">ई-मेल : genladmn@sailp.in</span>
                          <span className="font-black">E-mail : genladmn@sailp.in</span>
                       </div>
                       <div className="flex gap-10">
                          <span className="font-black">वेबसाइट : www.sail.co.in</span>
                          <span className="font-black">Website : www.sail.co.in</span>
                       </div>
                     </div>
                     <div className="flex justify-between items-center font-black pt-3 px-4 text-[15px] border-t border-gray-100 mt-2">
                       <span className="tracking-tight uppercase">हर किसी की ज़िन्दगी से जुड़ा हुआ है सैल</span>
                       <span className="italic tracking-tight">There's a little bit of SAIL in everybody's life</span>
                     </div>
                  </div>
               </div>
             )}
          </DocumentWrapper>
        );
      default:
        return (
          <DocumentWrapper title={currentView.replace('doc_', '').replace(/_/g, ' ').toUpperCase()} docType={currentView}>
             <div className="py-40 text-center space-y-10">
                <div className="text-gray-300 flex justify-center"><FileText size={100} /></div>
                <h3 className="text-3xl font-black text-gray-400 uppercase tracking-widest">Document Template Under Review</h3>
                <div className="bg-blue-50 p-8 rounded-2xl max-w-2xl mx-auto border border-blue-100">
                   <p className="font-bold text-ssp-blue text-lg">Use Digital Upload feature to archive signed copy.</p>
                </div>
             </div>
          </DocumentWrapper>
        );
    }
  };

  return <div className="admin-portal-main bg-white min-h-screen">{renderCurrentView()}</div>;
};

export default AdminDashboard;
