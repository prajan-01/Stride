import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  Compass,
  Eye,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBanner } from '../components/common/DemoBanner';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Compass className="w-5 h-5 text-[#a3e635]" />;
      case 'scout':
        return <Eye className="w-5 h-5 text-cyan-400" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'assessment':
        return <Zap className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f2d3d] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
                COMMUNICATION HUB
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                {notifications.filter((n) => !n.read).length} Unread Alerts
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Notifications</h1>
            <p className="text-slate-400 text-sm mt-1">
              Live updates on Khelo India applications, SAI scout views, and verification statuses.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<CheckCheck className="w-4 h-4 text-[#a3e635]" />}
            onClick={markAllNotificationsRead}
          >
            Mark All as Read
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {['all', 'opportunity', 'scout', 'verification', 'assessment'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                filterType === tab
                  ? 'bg-[#a3e635] text-slate-950 font-bold'
                  : 'bg-[#0e141d] text-slate-400 hover:text-white border border-[#1f2d3d]'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications in this Category"
            description="You're all caught up! As scouts review your profile and new trials open, alerts will appear here."
            actionText="View Dashboard"
            onAction={() => (window.location.href = '/dashboard')}
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  !notif.read
                    ? 'bg-[#0e1724] border-[#2c3e53] hover:border-[#a3e635]/40 shadow-lg'
                    : 'bg-[#0a0e15] border-[#1a2432] hover:bg-[#0e141d]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#141c27] border border-[#273548] shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#a3e635] shrink-0 animate-pulse" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>

                    {notif.actionLink && (
                      <div className="pt-2">
                        <Link
                          to={notif.actionLink}
                          className="inline-flex items-center gap-1 text-xs text-[#a3e635] hover:underline font-bold"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
