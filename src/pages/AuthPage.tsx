import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  Activity,
  Compass,
  Award,
  Sparkles,
  CheckCircle2,
  LogOut,
  Building2,
  IdCard,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

const INDIAN_STATES = [
  'Haryana', 'Punjab', 'Kerala', 'Manipur', 'Maharashtra',
  'Tamil Nadu', 'Odisha', 'Assam', 'Karnataka', 'Telangana',
  'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Gujarat', 'West Bengal', 'Delhi'
];

const SPORTS_LIST = [
  'Athletics (Sprints & Jumps)', 'Badminton', 'Boxing', 'Field Hockey',
  'Kabaddi', 'Wrestling', 'Weightlifting', 'Archery', 'Football', 'Shooting'
];

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { role, isAuthenticated, currentAthlete, login, logout } = useApp();

  const roleParam = searchParams.get('role');
  const isRegisterParam = searchParams.get('mode') === 'register';
  const redirectParam = searchParams.get('redirect');

  const [selectedPortal, setSelectedPortal] = useState<'athlete' | 'scout'>(
    roleParam === 'scout' ? 'scout' : (roleParam === 'athlete' ? 'athlete' : role)
  );
  const [isRegister, setIsRegister] = useState(isRegisterParam);

  // Form State
  const [name, setName] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [stateName, setStateName] = useState('Haryana');
  const [sport, setSport] = useState('Athletics (Sprints & Jumps)');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill demo hints when switching portal
  useEffect(() => {
    if (selectedPortal === 'athlete') {
      setEmailOrId('aarav.sharma@sports.gov.in');
      setPassword('stride@athlete2024');
    } else {
      setEmailOrId('coach.vikram@sai.gov.in');
      setPassword('sai@scout2024');
    }
  }, [selectedPortal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(
        selectedPortal,
        emailOrId,
        isRegister ? name : (selectedPortal === 'athlete' ? 'Aarav Sharma' : 'Coach Vikram Singh')
      );

      if (redirectParam) {
        navigate(redirectParam);
      } else if (selectedPortal === 'athlete') {
        navigate('/dashboard');
      } else {
        navigate('/scout/dashboard');
      }
    }, 450);
  };

  const handleInstantDemoLogin = (targetRole: 'athlete' | 'scout') => {
    login(
      targetRole,
      targetRole === 'athlete' ? 'aarav.sharma@sports.gov.in' : 'coach.vikram@sai.gov.in',
      targetRole === 'athlete' ? 'Aarav Sharma' : 'Coach Vikram Singh'
    );
    navigate(targetRole === 'athlete' ? '/dashboard' : '/scout/dashboard');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between bg-[#070a0e] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#a3e635]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10 mb-6">
        <Link to="/landing" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#121924] to-[#1c293a] border border-[#2c3e53] group-hover:border-[#a3e635] flex items-center justify-center shadow-[0_0_15px_-3px_rgba(163,230,53,0.3)] transition-all">
            <Zap className="w-5 h-5 text-[#a3e635] group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-xl text-white tracking-tight">STRIDE</span>
              <span className="text-[10px] font-bold tracking-widest text-[#a3e635] bg-[#a3e635]/15 px-1.5 py-0.2 rounded border border-[#a3e635]/30">
                INDIA
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Your Potential. Measured.</span>
          </div>
        </Link>

        <Link
          to="/landing"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1f2d3d] hover:border-slate-600 bg-[#0e141d]/80 transition-colors"
        >
          <span>Explore Platform Overview</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#a3e635]" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl mx-auto relative z-10 my-auto">
        
        {/* Active Session Notice (if user is already authenticated) */}
        {isAuthenticated && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0e141d] border border-[#273548] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#141c27] border border-[#2c3e53] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#a3e635]" />
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-400 block">Active Authenticated Session</span>
                <span className="text-sm font-bold text-white">
                  Signed in as {role === 'athlete' ? currentAthlete.name : 'Coach Vikram Singh'} ({role === 'athlete' ? 'Athlete' : 'SAI Scout'})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(role === 'athlete' ? '/dashboard' : '/scout/dashboard')}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
                onClick={logout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Brand Hero Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141c27] border border-[#273548] text-[11px] font-semibold text-slate-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
            <span>Sports Authority of India (SAI) Calibrated Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Sign In to STRIDE India
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
            Select your dedicated portal to access AI-powered biometric assessments, state rankings, and national scouting pathways.
          </p>
        </div>

        {/* 1-Click Instant Demo Login Cards */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Athlete Quick Card */}
          <div
            onClick={() => handleInstantDemoLogin('athlete')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedPortal === 'athlete'
                ? 'bg-gradient-to-br from-[#121924] to-[#0a111a] border-[#a3e635] shadow-[0_0_20px_-5px_rgba(163,230,53,0.25)]'
                : 'bg-[#0e141d] border-[#1f2d3d] hover:border-[#a3e635]/60 hover:bg-[#121924]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#141c27] border border-[#a3e635]/40 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6 text-[#a3e635]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white group-hover:text-[#a3e635] transition-colors">
                      Athlete Portal
                    </span>
                    <Badge variant="lime">Grassroots</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    For junior athletes, sprinters & talent aspirants
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#1f2d3d]/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={currentAthlete.avatar}
                  alt="Aarav Sharma"
                  className="w-5 h-5 rounded-full object-cover border border-[#a3e635]/50"
                />
                <span className="text-[11px] text-slate-300 font-medium">Demo: Aarav Sharma (92 Score)</span>
              </div>
              <span className="text-[11px] font-bold text-[#a3e635] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Instant Login <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Scout Quick Card */}
          <div
            onClick={() => handleInstantDemoLogin('scout')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedPortal === 'scout'
                ? 'bg-gradient-to-br from-[#121924] to-[#0a111a] border-[#38bdf8] shadow-[0_0_20px_-5px_rgba(56,189,248,0.25)]'
                : 'bg-[#0e141d] border-[#1f2d3d] hover:border-[#38bdf8]/60 hover:bg-[#121924]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#141c27] border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                      Coach / Scout Portal
                    </span>
                    <Badge variant="cyan">SAI Official</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    For SAI NCOE scouts, academies & coaches
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#1f2d3d]/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-900/60 border border-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                  VS
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Demo: Coach Vikram (SAI NCOE)</span>
              </div>
              <span className="text-[11px] font-bold text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Instant Login <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Form Card */}
        <Card className="p-6 sm:p-8 max-w-xl mx-auto">
          {/* Top Tabs: Sign In vs Register */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1f2d3d]">
            <div className="flex bg-[#070a0e] p-1 rounded-xl border border-[#1f2d3d]">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isRegister ? 'bg-[#141c27] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isRegister ? 'bg-[#141c27] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Portal indicator pill */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Portal:</span>
              <button
                type="button"
                onClick={() => setSelectedPortal(selectedPortal === 'athlete' ? 'scout' : 'athlete')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                  selectedPortal === 'athlete'
                    ? 'bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/30'
                    : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
                }`}
              >
                {selectedPortal === 'athlete' ? '⚡ Athlete' : '🎯 Scout'} (Switch)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* If Registering: Name */}
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={selectedPortal === 'athlete' ? 'e.g. Aarav Sharma' : 'e.g. Coach Vikram Singh'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>
              </div>
            )}

            {/* Identifier (Email / ID / Aadhaar) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {selectedPortal === 'athlete'
                  ? 'Email, Sports Federation ID, or Aadhaar'
                  : 'Official Email or SAI Coach License ID'}
              </label>
              <div className="relative">
                {selectedPortal === 'athlete' ? (
                  <IdCard className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                ) : (
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                )}
                <input
                  type="text"
                  required
                  placeholder={
                    selectedPortal === 'athlete'
                      ? 'aarav.sharma@sports.gov.in / AADHAAR-1234'
                      : 'coach.vikram@sai.gov.in / SAI-COACH-772'
                  }
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                {!isRegister && (
                  <span className="text-[11px] text-[#a3e635] cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>
            </div>

            {/* If Registering: State & Sport */}
            {isRegister && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    State / UT
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Primary Sport
                  </label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                  >
                    {SPORTS_LIST.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1f2d3d] text-[#a3e635] focus:ring-0 bg-[#070a0e]"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-[11px] text-slate-500">256-bit Encrypted</span>
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              variant={selectedPortal === 'athlete' ? 'primary' : 'secondary'}
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2 font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isRegister
                ? (selectedPortal === 'athlete' ? 'Create Athlete Account & Enter' : 'Create Scout Account & Enter')
                : (selectedPortal === 'athlete' ? 'Sign In to Athlete Portal' : 'Sign In to Scout HQ')}
            </Button>
          </form>

          {/* Trust Guarantee Footnote */}
          <div className="mt-6 pt-4 border-t border-[#1f2d3d] flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a3e635]" /> SAI Calibrated
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#a3e635]" /> 60 FPS Computer Vision
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#a3e635]" /> Verified Passport
            </span>
          </div>
        </Card>
      </div>

      {/* Bottom Footer Note */}
      <div className="w-full max-w-5xl mx-auto text-center text-xs text-slate-500 z-10 mt-8">
        <p>
          STRIDE India Grassroots Talent Identification Platform • Official Physical Norms by Sports Authority of India.
        </p>
      </div>
    </div>
  );
};
