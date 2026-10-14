import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Lock, 
  ArrowRight, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldAlert,
  ChevronRight,
  Eye,
  EyeOff,
  UserCheck,
  Package,
  Layers,
  HelpCircle
} from 'lucide-react';

export const PortalSelectScreen: React.FC = () => {
  const { 
    users, 
    loginAsAdmin, 
    loginAsResident, 
    registerUser,
    theme,
    toggleTheme 
  } = useApp();

  const [selectedFlow, setSelectedFlow] = useState<'none' | 'admin' | 'resident'>('none');

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('admin.devi@greenmeadows.community');
  const [adminPassword, setAdminPassword] = useState('Admin@GreenMeadows2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [showAdminGuide, setShowAdminGuide] = useState(false);

  // Resident Login & Registration Form State
  const [residentTab, setResidentTab] = useState<'signin' | 'register'>('signin');
  const [selectedResidentId, setSelectedResidentId] = useState('user-pranav');
  const [residentEmailInput, setResidentEmailInput] = useState('');
  const [residentError, setResidentError] = useState<string | null>(null);

  // Resident Registration Form State
  const [regName, setRegName] = useState('');
  const [regBlock, setRegBlock] = useState('Tower A');
  const [regFlat, setRegFlat] = useState('');
  const [regPhone, setRegPhone] = useState('+91 ');
  const [regEmail, setRegEmail] = useState('');
  const [regType, setRegType] = useState<'Owner' | 'Tenant'>('Owner');
  const [regBio, setRegBio] = useState('');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Resident list (excluding admin)
  const residentUsers = users.filter(u => u.role !== 'admin');
  const officialAdmin = users.find(u => u.role === 'admin');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminSuccess(null);

    if (!adminEmail.trim()) {
      setAdminError('Please enter administrator email address.');
      return;
    }

    const res = loginAsAdmin(adminEmail, adminPassword);
    if (!res.success) {
      setAdminError(res.message);
    } else {
      setAdminSuccess(res.message);
    }
  };

  const handleResidentSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setResidentError(null);

    const targetId = residentEmailInput.trim() ? residentEmailInput.trim() : selectedResidentId;
    const res = loginAsResident(targetId);
    if (!res.success) {
      setResidentError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResidentError(null);
    setRegSuccess(null);

    if (!regName.trim() || !regFlat.trim() || !regEmail.trim()) {
      setResidentError('Please provide your full name, flat number, and email.');
      return;
    }

    registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: 'resident',
      communityId: 'Green Meadows Gated Community',
      block: regBlock,
      flatNumber: regFlat.trim(),
      residentType: regType,
      bio: regBio.trim(),
    });

    setRegSuccess('Registration submitted successfully! Your account has been registered with pending verification. Entering resident portal...');
    setTimeout(() => {
      // Find the freshly created user by email
      const created = users.find(u => u.email === regEmail.trim());
      if (created) {
        loginAsResident(created.id);
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden selection:bg-emerald-500/20 selection:text-emerald-300 ${theme === 'dark' ? 'dark ios-bg-dark text-neutral-100' : 'light ios-bg-light text-neutral-900'}`}>
      
      {/* Apple iOS Ambient Glow Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-48 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Welcome Header */}
      <header className="relative z-10 border-b border-neutral-200/50 dark:border-white/10 ios-glass bg-white/60 dark:bg-black/60 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                  Neighborly
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                  Green Meadows Gated Community
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Community Resource Borrowing & Rental Management System (CRBRMS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1.5"
            >
              <span>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 relative z-10 flex flex-col justify-center">
        
        {/* Welcome Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/70 border border-emerald-300/40 dark:border-emerald-800/50 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Portal Community Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Welcome to <span className="bg-gradient-to-r from-emerald-600 to-teal-400 bg-clip-text text-transparent">Neighborly</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Borrow high-utility household items, tools, and appliances from verified neighbors, or manage community assets and security handovers with gated administrative governance.
          </p>

          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Please choose the appropriate portal to continue:
          </p>
        </div>

        {/* Dual Portal Selection Cards */}
        {selectedFlow === 'none' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            
            {/* Card 1: Admin Portal */}
            <div className="ios-glass bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-800/40">
                    Staff & Authority
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  Administrator Portal
                </h2>
                
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Dedicated interface for Community Office and Estate Management. Oversee resident verification queues, catalog moderation, security gate handovers, escrow deposits, and utilization analytics.
                </p>

                <div className="mt-5 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Resident verification & identity vetting (FR-01, FR-02)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Catalog moderation, item safety inspection & delisting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Gate Desk handover verification & overdue dossier (FR-21)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Monthly utilization & IEEE SRS traceability matrix</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-white/10">
                <button
                  onClick={() => setSelectedFlow('admin')}
                  className="w-full py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-transform duration-200 active:scale-98 cursor-pointer group-hover:bg-amber-600 group-hover:text-white dark:group-hover:bg-amber-500"
                >
                  <Lock className="w-4 h-4" />
                  <span>Continue as Admin</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="mt-2 text-[11px] text-center text-neutral-500">
                  Requires verified Administrator credentials
                </div>
              </div>
            </div>

            {/* Card 2: Resident / User Portal */}
            <div className="ios-glass bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold shadow-inner">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40">
                    Community Residents
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  Resident / User Portal
                </h2>
                
                <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Tailored community experience for Green Meadows residents. Explore available household tools and kitchen appliances, book items in ₹, chat directly with lenders, track escrow deposits, and list your own items.
                </p>

                <div className="mt-5 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Explore Indian household appliances, drills, projectors & gear</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Book with date range, ₹ transparent rates & refundable escrow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Direct resident-to-resident chat with item context</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>My Listings, Wishlist, Handover PINs & Trust Reviews</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200/50 dark:border-white/10">
                <button
                  onClick={() => setSelectedFlow('resident')}
                  className="w-full py-3 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-transform duration-200 active:scale-98 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Continue as Resident</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
                <div className="mt-2 text-[11px] text-center text-neutral-500">
                  For Green Meadows owners & tenants
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Admin Login Modal / Screen */}
        {selectedFlow === 'admin' && (
          <div className="max-w-lg mx-auto w-full">
            <div className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedFlow('none')}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4 inline-flex items-center gap-1 cursor-pointer"
              >
                ← Back to Portal Selection
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Administrator Sign In
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Community Estate Office & Gate Control Authority
                  </p>
                </div>
              </div>

              {adminError && (
                <div className="p-3.5 mb-4 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold">Authorization Check:</strong> {adminError}
                  </div>
                </div>
              )}

              {adminSuccess && (
                <div className="p-3.5 mb-4 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Administrator Email / Identifier
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin.devi@greenmeadows.community"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Assigned administrative identity: {officialAdmin?.name || 'Head Administrator'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Security Password / Master Credential
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Protected Role Verification Enforced</span>
                  </div>
                  <span>
                    Administrator privileges are bound to server-controlled verified records (custom claims). Residents cannot grant themselves admin access.
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate & Open Admin Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('admin.devi@greenmeadows.community');
                      setAdminPassword('Admin@GreenMeadows2026');
                    }}
                    className="w-full py-2 px-3 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors cursor-pointer text-center"
                  >
                    Use Registered Official Administrator (Mrs. L. Devi)
                  </button>
                </div>
              </form>

              {/* Secure Admin Setup Guide Dropdown */}
              <div className="mt-6 pt-4 border-t border-neutral-200/50 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAdminGuide(!showAdminGuide)}
                  className="w-full flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer py-1"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Info className="w-3.5 h-3.5 text-amber-500" />
                    <span>How Administrator Roles & Claims Are Secured (SRS Sec 2)</span>
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAdminGuide ? 'rotate-90' : ''}`} />
                </button>

                {showAdminGuide && (
                  <div className="mt-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-white/10 text-[11px] text-neutral-600 dark:text-neutral-300 space-y-2">
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      Administrative Role Architecture:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>
                        <strong>Server Claims:</strong> Roles are controlled via Firebase Custom Claims (<code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">admin: true</code>) or protected database role records.
                      </li>
                      <li>
                        <strong>Zero Elevation:</strong> Resident registration hardcodes role as <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">resident</code> with <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">pending</code> status.
                      </li>
                      <li>
                        <strong>Initial Admin Setup:</strong> The first administrator is provisioned during community onboarding via Estate Office record initialization (Mrs. L. Devi - Flat Admin-01).
                      </li>
                      <li>
                        <strong>Route Guards:</strong> All admin views verify role claims before rendering, blocking any direct navigation.
                      </li>
                    </ol>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Resident Login & Registration Screen */}
        {selectedFlow === 'resident' && (
          <div className="max-w-lg mx-auto w-full">
            <div className="ios-glass bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <button
                onClick={() => setSelectedFlow('none')}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-4 inline-flex items-center gap-1 cursor-pointer"
              >
                ← Back to Portal Selection
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Green Meadows Residents
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Sign in to your resident account or register your flat
                  </p>
                </div>
              </div>

              {/* Tabs: Sign In vs Register */}
              <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-white/10 rounded-xl mb-6 text-xs">
                <button
                  type="button"
                  onClick={() => setResidentTab('signin')}
                  className={`flex-1 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${residentTab === 'signin' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                >
                  Resident Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setResidentTab('register')}
                  className={`flex-1 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${residentTab === 'register' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                >
                  Register New Flat
                </button>
              </div>

              {residentError && (
                <div className="p-3 mb-4 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{residentError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 mb-4 text-xs rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              {residentTab === 'signin' ? (
                <form onSubmit={handleResidentSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Choose Your Verified Resident Profile
                    </label>
                    <div className="space-y-2">
                      {residentUsers.map(u => (
                        <label
                          key={u.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${selectedResidentId === u.id ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500' : 'border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-white/5'}`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="residentChoice"
                              value={u.id}
                              checked={selectedResidentId === u.id}
                              onChange={() => setSelectedResidentId(u.id)}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white">
                                {u.name}
                              </div>
                              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                {u.block} · Flat {u.flatNumber} ({u.residentType})
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.verificationStatus === 'verified' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'}`}>
                              {u.verificationStatus === 'verified' ? 'Verified Resident' : 'Pending Verification'}
                            </span>
                            <div className="text-[10px] text-neutral-400 mt-0.5">
                              {u.rating > 0 ? `★ ${u.rating} (${u.ratingCount})` : 'New'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Or sign in by registered resident email:
                    </label>
                    <input
                      type="email"
                      value={residentEmailInput}
                      onChange={(e) => setResidentEmailInput(e.target.value)}
                      placeholder="e.g. pranav.t@greenmeadows.community"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Enter Resident Portal</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Resident Name *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      placeholder="e.g. S. Ananya"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Tower / Block *
                      </label>
                      <select
                        value={regBlock}
                        onChange={(e) => setRegBlock(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Tower A">Tower A</option>
                        <option value="Tower B">Tower B</option>
                        <option value="Tower C">Tower C</option>
                        <option value="Tower D">Tower D</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Flat Number *
                      </label>
                      <input
                        type="text"
                        value={regFlat}
                        onChange={(e) => setRegFlat(e.target.value)}
                        required
                        placeholder="e.g. A-302"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Resident Type
                      </label>
                      <select
                        value={regType}
                        onChange={(e) => setRegType(e.target.value as 'Owner' | 'Tenant')}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Tenant">Tenant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98490 00000"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      placeholder="ananya.s@greenmeadows.community"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Short Bio / Items you can share with neighbors
                    </label>
                    <textarea
                      rows={2}
                      value={regBio}
                      onChange={(e) => setRegBio(e.target.value)}
                      placeholder="e.g. Have a wet grinder, steam iron, and outdoor projector."
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-white/10 bg-white/70 dark:bg-black/50 text-neutral-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 text-[11px] text-neutral-500">
                    ℹ️ In accordance with Green Meadows CRBRMS bylaws (FR-01), new resident accounts undergo document verification by the Community Office before borrowing high-deposit tools.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Resident Registration</span>
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200/40 dark:border-white/10 py-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Neighborly · Green Meadows Gated Community Borrowing and Rental Management System
      </footer>

    </div>
  );
};
