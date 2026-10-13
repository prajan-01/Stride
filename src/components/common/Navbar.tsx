import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Zap,
  Bell,
  User,
  ShieldCheck,
  Compass,
  Activity,
  BookmarkCheck,
  Menu,
  X,
  Sliders,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, isAuthenticated, logout, notifications, currentAthlete, savedAthleteIds } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 1. Athlete Navigation
  const athleteNav = [
    { name: 'Athlete Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Assessments', path: '/assessments', icon: Zap },
    { name: 'My Results', path: '/results', icon: Sliders },
    { name: 'Verification', path: '/verification', icon: ShieldCheck },
    { name: 'Opportunities', path: '/opportunities', icon: Compass },
  ];

  // 2. Coach/Scout Navigation (Opportunities removed)
  const scoutNav = [
    { name: 'Scout HQ', path: '/scout/dashboard', icon: Activity },
    { name: 'Athlete Directory', path: '/scout/athletes', icon: User },
    { name: `Saved Athletes${savedAthleteIds.length > 0 ? ` (${savedAthleteIds.length})` : ''}`, path: '/scout/saved', icon: BookmarkCheck },
  ];

  const currentNav = role === 'athlete' ? athleteNav : scoutNav;

  const isActive = (path: string) => {
    if (path === '/dashboard' || path === '/scout/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleRoleToggle = (targetRole: 'athlete' | 'scout') => {
    if (role === targetRole) return;
    setRole(targetRole);

    // Immediate navigation if current page is not accessible in target role
    if (targetRole === 'scout' && (location.pathname === '/opportunities' || location.pathname.startsWith('/opportunities/'))) {
      navigate('/scout/dashboard');
    } else if (targetRole === 'athlete' && location.pathname.startsWith('/scout')) {
      navigate('/dashboard');
    }
  };

  const brandTargetPath = !isAuthenticated
    ? '/landing'
    : role === 'athlete'
    ? '/dashboard'
    : '/scout/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f2d3d] bg-[#070a0e]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to={brandTargetPath} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#121924] to-[#1c293a] border border-[#2c3e53] group-hover:border-[#a3e635] flex items-center justify-center shadow-[0_0_15px_-3px_rgba(163,230,53,0.3)] transition-all duration-300">
                <Zap className="w-5 h-5 text-[#a3e635] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-xl tracking-tight text-white group-hover:text-[#a3e635] transition-colors">
                    STRIDE
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-[#a3e635] bg-[#a3e635]/15 px-1.5 py-0.2 rounded border border-[#a3e635]/30">
                    INDIA
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline -mt-0.5">
                  Your Potential. Measured.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Main Navigation">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      active
                        ? 'text-white bg-[#121924] border border-[#273548] shadow-inner text-[#a3e635]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e141d]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#a3e635]' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Role Switcher Pill, Notifications, Settings, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Role Toggle Pill */}
            <div className="flex items-center bg-[#0e141d] border border-[#1f2d3d] p-1 rounded-xl shadow-inner">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-1.5 hidden xl:inline">
                Demo
              </span>
              <button
                type="button"
                onClick={() => handleRoleToggle('athlete')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'athlete'
                    ? 'bg-[#a3e635] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Demo Athlete (Aarav Sharma)"
              >
                <span>Athlete</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle('scout')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === 'scout'
                    ? 'bg-[#a3e635] text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Demo Coach / Scout (Coach Vikram Singh)"
              >
                <span>Scout</span>
              </button>
            </div>

            {/* Notifications Bell */}
            <Link
              to="/notifications"
              className={`relative p-2.5 rounded-xl border transition-colors ${
                isActive('/notifications')
                  ? 'bg-[#121924] border-[#a3e635]/40 text-[#a3e635]'
                  : 'bg-[#0e141d] hover:bg-[#141c27] border-[#1f2d3d] hover:border-[#2c3e53] text-slate-300 hover:text-white'
              }`}
              aria-label={`Notifications, ${unreadCount} unread`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#a3e635] text-[10px] font-black text-slate-950 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Settings & Preferences */}
            <Link
              to="/settings"
              className={`p-2.5 rounded-xl border transition-colors hidden sm:flex items-center justify-center ${
                isActive('/settings')
                  ? 'bg-[#121924] border-[#a3e635]/40 text-[#a3e635]'
                  : 'bg-[#0e141d] hover:bg-[#141c27] border-[#1f2d3d] hover:border-[#2c3e53] text-slate-300 hover:text-white'
              }`}
              title={role === 'athlete' ? 'Profile and Settings' : 'Coach Profile and Settings'}
              aria-label={role === 'athlete' ? 'Profile and Settings' : 'Coach Profile and Settings'}
            >
              <Sliders className="w-4 h-4" />
            </Link>

            {/* Profile link */}
            <Link
              to="/profile"
              className={`flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl border transition-colors ${
                isActive('/profile')
                  ? 'bg-[#121924] border-[#a3e635]/40'
                  : 'bg-[#0e141d] hover:bg-[#141c27] border-[#1f2d3d] hover:border-[#2c3e53]'
              }`}
              title={role === 'athlete' ? 'Profile and Settings' : 'Coach Profile and Settings'}
            >
              <img
                src={currentAthlete.avatar}
                alt={role === 'athlete' ? currentAthlete.name : 'Coach Vikram Singh'}
                className="w-7 h-7 rounded-lg object-cover border border-[#a3e635]/50"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  {role === 'athlete' ? currentAthlete.name.split(' ')[0] : 'Coach Vikram'}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  {role === 'athlete' ? 'Top 3.6% SAI' : 'SAI Scout'}
                </span>
              </div>
            </Link>

            {/* Sign Out Button (when authenticated) */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2.5 rounded-xl bg-[#0e141d] hover:bg-rose-950/40 border border-[#1f2d3d] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
                title="Sign Out of STRIDE Portal"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to="/"
                className="px-3.5 py-1.5 rounded-xl bg-[#a3e635] text-slate-950 font-bold text-xs hover:bg-[#bef264] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#0e141d] border border-[#1f2d3d] text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1f2d3d] bg-[#0a0e15] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {role === 'athlete' ? 'Athlete Menu' : 'Coach & Scout Menu'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-[#121924] px-2 py-0.5 rounded border border-[#223042]">
              Demo Mode
            </span>
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? 'text-white bg-[#141c27] border border-[#273548] text-[#a3e635]'
                    : 'text-slate-300 hover:bg-[#0e141d]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#a3e635]' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#1f2d3d] flex flex-col gap-2">
            <Link
              to="/notifications"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/notifications')
                  ? 'text-white bg-[#141c27] border border-[#273548] text-[#a3e635]'
                  : 'text-slate-300 hover:bg-[#0e141d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className={`w-4 h-4 ${isActive('/notifications') ? 'text-[#a3e635]' : 'text-slate-400'}`} />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#a3e635] text-[10px] font-black text-slate-950">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/profile')
                  ? 'text-white bg-[#141c27] border border-[#273548] text-[#a3e635]'
                  : 'text-slate-300 hover:bg-[#0e141d]'
              }`}
            >
              <User className={`w-4 h-4 ${isActive('/profile') ? 'text-[#a3e635]' : 'text-slate-400'}`} />
              <span>{role === 'athlete' ? 'Profile and Settings' : 'Coach Profile and Settings'}</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/settings')
                  ? 'text-white bg-[#141c27] border border-[#273548] text-[#a3e635]'
                  : 'text-slate-300 hover:bg-[#0e141d]'
              }`}
            >
              <Sliders className={`w-4 h-4 ${isActive('/settings') ? 'text-[#a3e635]' : 'text-slate-400'}`} />
              <span>Settings</span>
            </Link>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors text-left w-full cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-semibold text-[#a3e635] bg-[#141c27] border border-[#a3e635]/30 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};


