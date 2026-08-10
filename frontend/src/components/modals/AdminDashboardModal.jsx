import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, Trash2, Search, Users, Database, LogOut, Home, FileText, Layers, Clock, Shield } from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen) {
      fetchRegistrations();
      updateClock();
      const timer = setInterval(updateClock, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const updateClock = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/registrations`);
      const data = await response.json();

      if (data.success) {
        setRegistrations(data.registrations || []);
      }

      // Check DB health
      const healthRes = await fetch(`${apiUrl}/api/health`);
      const healthData = await healthRes.json();
      setDbStatus(healthData.database || 'Active');
    } catch (err) {
      console.warn('API fetch failed, reading from local fallback storage:', err.message);
      const localData = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      setRegistrations(localData);
      setDbStatus('Local Fallback Storage');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration entry?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/admin/registrations/${id}`, { method: 'DELETE' });

      setRegistrations(prev => prev.filter(item => item._id !== id && item.passId !== id));

      const localData = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      const updated = localData.filter(item => item._id !== id && item.passId !== id);
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(updated));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return alert('No registration data available to export.');

    const headers = ['PASS ID', 'FULL NAME', 'BRANCH / DEPT', 'MOBILE NUMBER', 'EMAIL ADDRESS', 'REGISTERED AT'];
    const rows = registrations.map(r => [
      `"${r.passId || r._id}"`,
      `"${r.name}"`,
      `"${r.branch}"`,
      `"${r.mobile}"`,
      `"${r.email}"`,
      `"${new Date(r.createdAt || Date.now()).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NRCM_FMC_Registrations_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const filtered = registrations.filter(r =>
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.branch?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.mobile?.includes(searchQuery) ||
    r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.passId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] w-screen h-screen bg-[#F4F0EA] text-[#17171a] flex overflow-hidden font-sans animate-in fade-in">
      
      {/* 01. Left Sidebar Navigation */}
      <aside className="w-64 bg-[#EBE7DF] border-r border-zinc-300/80 p-5 flex flex-col justify-between shrink-0 h-full overflow-y-auto">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shadow-md">
              FMC
            </div>
            <span className="font-sans font-black text-lg tracking-tight uppercase text-[#17171a]">
              NRCM.FMC OS
            </span>
          </div>

          {/* Navigation Pill Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-sans text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white/80 text-zinc-700 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" />
                <span>Home Overview</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-white font-mono">HQ</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/80 text-zinc-700 hover:bg-white font-sans text-xs font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-red-600" />
                <span>Event Passes</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-mono">{registrations.length}</span>
            </button>

            <button
              onClick={exportCSV}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/80 text-zinc-700 hover:bg-white font-sans text-xs font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">CSV</span>
            </button>
          </nav>
        </div>

        {/* User Profile & Logout OS */}
        <div className="pt-4 border-t border-zinc-300/80 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center border border-zinc-700">
              GA
            </div>
            <div>
              <p className="text-xs font-bold text-[#17171a]">Gotti Aashish</p>
              <p className="text-[10px] text-zinc-500 font-mono">STUDIO HEAD</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-2xl bg-white/80 hover:bg-red-50 text-red-600 font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-zinc-300/60 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout OS</span>
          </button>
        </div>
      </aside>

      {/* 02. Main Content View */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>KLAPP OS</span>
            <span>›</span>
            <span className="font-bold text-[#17171a]">Dashboard Overview</span>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates, campaigns, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-zinc-300/80 text-xs font-sans placeholder-zinc-400 focus:outline-none focus:border-black transition-colors shadow-sm"
              />
            </div>

            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="px-4 h-10 rounded-xl bg-white border border-zinc-300/80 text-xs font-sans font-bold hover:bg-zinc-100 transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 h-10 rounded-xl bg-white border border-zinc-300/80 text-xs font-sans font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close OS</span>
            </button>
          </div>
        </header>

        {/* Good Afternoon Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#17171a] flex items-center gap-2">
              Good Afternoon, Aashish 🌼
            </h1>
            <p className="text-xs text-zinc-500 font-sans">
              Welcome to NRCM.FMC Command Center. Here is your live execution overview.
            </p>
          </div>

          {/* Clock Widget */}
          <div className="bg-[#F8F6F0] border border-zinc-200 rounded-2xl px-5 py-3 text-center shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold font-mono text-[#17171a]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentTime || '04:12:35 pm'}</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              TOTAL REGISTRATIONS
            </span>
            <div className="text-3xl font-black text-[#17171a]">{registrations.length}</div>
            <span className="text-xs font-bold text-emerald-600 block">
              ↑ Live Event Passes
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              ACTIVE DEPARTMENTS
            </span>
            <div className="text-3xl font-black text-[#17171a]">
              {new Set(registrations.map(r => r.branch)).size || 1}
            </div>
            <span className="text-xs font-bold text-blue-600 block">
              In Active Sprint
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              MONGODB STATUS
            </span>
            <div className="text-xl font-black text-[#17171a] truncate">
              {dbStatus || 'Connected'}
            </div>
            <span className="text-xs font-bold text-amber-600 block">
              Atlas Cloud Active
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              EXPORT DATA
            </span>
            <div className="text-3xl font-black text-[#17171a]">100%</div>
            <span className="text-xs font-bold text-emerald-600 block">
              CSV Ready ⚡
            </span>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#17171a] flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <span>Event Registrations List</span>
            </h2>
            <span className="text-xs font-mono text-zinc-400 uppercase">
              SHOWING {filtered.length} ENTRIES
            </span>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto border border-zinc-200 rounded-2xl">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#F8F6F0] border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4">PASS ID</th>
                  <th className="py-3.5 px-4">FULL NAME</th>
                  <th className="py-3.5 px-4">BRANCH</th>
                  <th className="py-3.5 px-4">MOBILE</th>
                  <th className="py-3.5 px-4">EMAIL</th>
                  <th className="py-3.5 px-4">REGISTERED AT</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3.5 px-4 text-zinc-400 font-bold">{index + 1}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-red-600">{item.passId || item._id}</td>
                      <td className="py-3.5 px-4 font-bold text-[#17171a] uppercase">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 font-bold text-zinc-700 text-[11px] uppercase">
                          {item.branch}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-700">{item.mobile}</td>
                      <td className="py-3.5 px-4 text-zinc-600 lowercase">{item.email}</td>
                      <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                        {new Date(item.createdAt || Date.now()).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(item._id || item.passId)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-red-200"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-16 text-center text-zinc-400 uppercase tracking-widest font-bold font-mono">
                      {loading ? 'LOADING REGISTRATION DATA...' : 'NO EVENT REGISTRATIONS FOUND'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
