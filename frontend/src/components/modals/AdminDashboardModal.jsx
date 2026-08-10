import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, Trash2, Search, Users, LogOut, Home, FileText } from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
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
    setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      const response = await fetch(`${apiUrl}/api/admin/registrations`);
      const data = await response.json();
      if (data.success) setRegistrations(data.registrations || []);
      const healthRes = await fetch(`${apiUrl}/api/health`);
      const healthData = await healthRes.json();
      setDbStatus(healthData.database || 'Connected');
    } catch (err) {
      const localData = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      setRegistrations(localData);
      setDbStatus('Local Storage');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://nrcm-fmc.onrender.com';
      await fetch(`${apiUrl}/api/admin/registrations/${id}`, { method: 'DELETE' });
      setRegistrations(prev => prev.filter(item => item._id !== id && item.passId !== id));
      const localData = JSON.parse(localStorage.getItem('nrcmfmc_local_registrations') || '[]');
      localStorage.setItem('nrcmfmc_local_registrations', JSON.stringify(localData.filter(item => item._id !== id && item.passId !== id)));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return alert('No data to export.');
    const headers = ['PASS ID', 'FULL NAME', 'BRANCH', 'MOBILE', 'EMAIL', 'REGISTERED AT'];
    const rows = registrations.map(r => [
      `"${r.passId || r._id}"`, `"${r.name}"`, `"${r.branch}"`,
      `"${r.mobile}"`, `"${r.email}"`,
      `"${new Date(r.createdAt || Date.now()).toLocaleString()}"`
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `NRCM_FMC_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
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

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
      className="fixed inset-0 z-[120] w-screen h-screen flex overflow-hidden bg-[#F2F2F7]">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-[185px] shrink-0 bg-white border-r border-gray-200 flex flex-col justify-between h-full overflow-y-auto">

        {/* Brand */}
        <div>
          <div className="px-4 pt-5 pb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1c1c1e] flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-black tracking-tight">FMC</span>
            </div>
            <span className="text-[13px] font-bold text-[#1c1c1e] tracking-tight leading-tight">NRCM.FMC OS</span>
          </div>

          {/* Nav Items */}
          <nav className="px-2 space-y-0.5">
            {/* Home Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1c1c1e] text-white'
                  : 'text-[#3a3a3c] hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${activeTab === 'overview' ? 'bg-white/20' : 'bg-gray-100'}`}>
                  <Home className={`w-3.5 h-3.5 ${activeTab === 'overview' ? 'text-white' : 'text-[#3a3a3c]'}`} />
                </div>
                <span>Home Overview</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeTab === 'overview' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'}`}>HQ</span>
            </button>

            {/* Event Passes */}
            <button
              onClick={() => setActiveTab('overview')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[#3a3a3c] hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-red-500" />
                </div>
                <span>Event Passes</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500 text-white font-bold min-w-[18px] text-center">{registrations.length}</span>
            </button>

            {/* Export Data */}
            <button
              onClick={exportCSV}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[#3a3a3c] hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span>Export Data</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 font-mono font-bold">CSV</span>
            </button>
          </nav>
        </div>

        {/* User + Logout */}
        <div className="px-3 pb-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-1 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#1c1c1e] text-white text-[11px] font-bold flex items-center justify-center shrink-0">GA</div>
            <div>
              <p className="text-[12px] font-semibold text-[#1c1c1e] leading-tight">Gotti Aashish</p>
              <p className="text-[10px] text-gray-400 font-mono">STUDIO HEAD</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-50 hover:bg-red-50 text-red-500 hover:text-red-600 text-[12px] font-semibold transition-all cursor-pointer border border-gray-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout OS</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
            <span>NRCM.FMC OS</span>
            <span className="text-gray-300 text-base">›</span>
            <span className="text-[#1c1c1e] font-semibold">Dashboard Overview</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-sm mx-4">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search registrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#F2F2F7] border border-gray-200 text-[13px] placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-mono bg-gray-100 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close OS</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 p-6 space-y-5">

          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-bold text-[#1c1c1e] flex items-center gap-2">
                {getGreeting()}, Aashish 🌼
              </h1>
              <p className="text-[13px] text-gray-500 mt-0.5">Welcome to NRCM.FMC Command Center. Here is your live execution overview.</p>
            </div>
            <div className="text-right shrink-0 ml-6">
              <div className="flex items-center gap-1.5 justify-end text-[15px] font-semibold text-[#1c1c1e]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span>{currentTime || '00:00:00 am'}</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">{currentDate}</p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Total Registrations</span>
              <div className="text-[30px] font-bold text-[#1c1c1e] leading-none">{registrations.length}</div>
              <span className="text-[12px] font-semibold text-emerald-600">↑ Live Event Passes</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Active Departments</span>
              <div className="text-[30px] font-bold text-[#1c1c1e] leading-none">{new Set(registrations.map(r => r.branch)).size || 1}</div>
              <span className="text-[12px] font-semibold text-blue-500">In Active Sprint</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">MongoDB Status</span>
              <div className="text-[18px] font-bold text-[#1c1c1e] leading-none truncate pt-1">{dbStatus || 'Connected'}</div>
              <span className="text-[12px] font-semibold text-amber-500">Atlas Cloud Active</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Export Ready</span>
              <div className="text-[30px] font-bold text-[#1c1c1e] leading-none">100%</div>
              <span className="text-[12px] font-semibold text-emerald-600">CSV Ready ⚡</span>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-semibold text-[#1c1c1e] flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Event Registrations List
              </h2>
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Showing {filtered.length} Entries
              </span>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[380px]">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#F9F9FB] border-b border-gray-100">
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">#</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Pass ID</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Full Name</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Branch</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Mobile</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Registered At</th>
                    <th className="py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length > 0 ? (
                    filtered.map((item, index) => (
                      <tr key={item._id || index} className="hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3.5 px-4 text-gray-400 font-medium text-[12px]">{index + 1}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-red-500 text-[12px]">{item.passId || item._id}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#1c1c1e]">{item.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-semibold">{item.branch}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600 text-[12px]">{item.mobile}</td>
                        <td className="py-3.5 px-4 text-gray-500 text-[12px] lowercase">{item.email}</td>
                        <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                          {new Date(item.createdAt || Date.now()).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(item._id || item.passId)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-16 text-center text-gray-300 text-[13px] font-medium">
                        {loading ? 'Loading registrations...' : 'No event registrations found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
