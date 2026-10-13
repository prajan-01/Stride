import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Activity, Zap, Compass, User, BookmarkCheck, Search } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, savedAthleteIds } = useApp();
  const location = useLocation();

  const athleteTabs = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Tests', path: '/assessments', icon: Zap },
    { name: 'Opportunities', path: '/opportunities', icon: Compass },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const scoutTabs = [
    { name: 'Scout HQ', path: '/scout/dashboard', icon: Activity },
    { name: 'Athletes', path: '/scout/athletes', icon: Search },
    { name: `Saved (${savedAthleteIds.length})`, path: '/scout/saved', icon: BookmarkCheck },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const tabs = role === 'athlete' ? athleteTabs : scoutTabs;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070a0e]/95 backdrop-blur-xl border-t border-[#1f2d3d] px-3 py-2 flex items-center justify-around safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
              active ? 'text-[#a3e635]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
