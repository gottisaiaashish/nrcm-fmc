import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Download, Trash2, Search, Users, Database, LogOut } from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose, onLogout }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbStatus, setDbStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchRegistrations();
    }
  }, [isOpen]);

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

      // Filter locally as well
      setRegistrations(prev => prev.filter(item => item._id !== id && item.passId !== id));

      // Update localStorage fallback
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
    <div className="fixed inset-0 z-[120] w-full h-full min-h-screen bg-[#0f0f11] text-[#F0ECD9] overflow-y-auto animate-in fade-in px-4 sm:px-8 md:px-12 py-6 sm:py-10 flex flex-col justify-between">
      <div className="w-full max-w-7xl mx-auto min-h-full flex flex-col justify-between gap-8">
        
        {/* Header Bar */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                EVENT REGISTRATION DASHBOARD
              </h1>
              <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                <span>TOTAL REGISTRATIONS: <strong className="text-red-500">{registrations.length}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-zinc-500" />
                  {dbStatus || 'Connected'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRegistrations}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${loading ? 'animate-spin' : ''}`} />
              <span>REFRESH</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-mono font-bold uppercase hover:bg-red-500 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT CSV</span>
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold uppercase text-zinc-400 hover:text-red-500 hover:border-red-500 transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-red-600 transition-all flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH BY NAME, BRANCH, MOBILE, EMAIL OR PASS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 font-mono text-xs uppercase focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>

        {/* Registrations Table */}
        <div className="w-full flex-1 bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-red-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">#</th>
                  <th className="py-4 px-5">PASS ID</th>
                  <th className="py-4 px-5">FULL NAME</th>
                  <th className="py-4 px-5">BRANCH / DEPT</th>
                  <th className="py-4 px-5">MOBILE NUMBER</th>
                  <th className="py-4 px-5">EMAIL ADDRESS</th>
                  <th className="py-4 px-5">REGISTERED AT</th>
                  <th className="py-4 px-5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {filtered.length > 0 ? (
                  filtered.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-5 text-zinc-500 font-bold">{index + 1}</td>
                      <td className="py-4 px-5 text-red-400 font-bold">{item.passId || item._id}</td>
                      <td className="py-4 px-5 font-bold text-white uppercase">{item.name}</td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-bold text-zinc-200 uppercase">
                          {item.branch}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-zinc-300">{item.mobile}</td>
                      <td className="py-4 px-5 text-zinc-400 lowercase">{item.email}</td>
                      <td className="py-4 px-5 text-zinc-500 text-[11px]">
                        {new Date(item.createdAt || Date.now()).toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDelete(item._id || item.passId)}
                          className="p-2 rounded-lg bg-red-950/30 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-16 text-center text-zinc-500 uppercase tracking-widest font-bold">
                      {loading ? 'LOADING REGISTRATION DATA...' : 'NO EVENT REGISTRATIONS FOUND'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="w-full border-t border-zinc-900 pt-4 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-zinc-600 uppercase tracking-widest gap-2">
          <div>NRCM.FMC OFFICIAL MANAGEMENT PORTAL</div>
          <div>REAL-TIME MONGO DB SYNC ACTIVE</div>
        </div>
      </div>
    </div>
  );
}
