import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  BookmarkCheck,
  Award,
  Zap,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Filter,
  Eye,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';

export const ScoutDashboardPage: React.FC = () => {
  const { athletes, savedAthleteIds, toggleSaveAthlete, showToast } = useApp();

  const savedAthletes = athletes.filter((a) => savedAthleteIds.includes(a.id));
  const topTierAthletes = athletes.filter((a) => a.strideScore >= 90);

  const handleInviteToTrial = (name: string) => {
    showToast(`Official SAI Zonal Selection Trial invitation dispatched to ${name}!`, 'success');
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0e141d] via-[#121924] to-[#0a1017] border border-[#273548] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="lime" size="sm">
                  SAI High Performance Scout Portal
                </Badge>
                <span className="text-xs text-slate-400">Regional Command: North & Northeast Zone</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Scout Headquarters: Coach Vikram Singh
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Senior Talent Identification Officer, Sports Authority of India (SAI NCOE). Monitoring 14,200+ verified grassroots athletes across 28 states.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/scout/athletes">
                <Button variant="primary" size="md" leftIcon={<Search className="w-4 h-4" />}>
                  Explore Athlete Directory
                </Button>
              </Link>
              <Link to="/scout/saved">
                <Button variant="secondary" size="md" leftIcon={<BookmarkCheck className="w-4 h-4 text-[#a3e635]" />}>
                  Saved Roster ({savedAthleteIds.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverGlow className="p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">National Database</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-white font-mono">14,240</span>
            </div>
            <p className="text-[11px] text-[#a3e635] mt-1 font-semibold">
              +382 AI tests uploaded this week
            </p>
          </Card>

          <Card hoverGlow className="p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Shortlisted Prospects</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-[#a3e635] font-mono">{savedAthleteIds.length}</span>
              <span className="text-xs text-slate-400 font-mono">athletes</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Flagged for Zonal Selection Camps
            </p>
          </Card>

          <Card hoverGlow className="p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Elite Tier (&gt;90 Score)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-cyan-400 font-mono">{topTierAthletes.length}</span>
              <span className="text-xs text-slate-400 font-mono">contenders</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Meeting Olympic Feeder standard
            </p>
          </Card>

          <Card hoverGlow className="p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming Trials</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-amber-400 font-mono">4</span>
              <span className="text-xs text-slate-400 font-mono">camps</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Patiala, Pune, Imphal, Bangalore
            </p>
          </Card>
        </div>

        {/* Priority Talent Watchlist (Top Contenders) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Priority Talent Watchlist</h2>
              <p className="text-xs text-slate-400">Verified prospects in the 90th+ national percentile</p>
            </div>
            <Link to="/scout/athletes" className="text-xs font-bold text-[#a3e635] hover:underline flex items-center gap-1">
              View All 14,000+ Athletes <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTierAthletes.map((athlete) => {
              const isSaved = savedAthleteIds.includes(athlete.id);
              return (
                <Card key={athlete.id} hoverGlow className="p-6 flex flex-col justify-between">
                  <div>
                    {/* Header: Photo, Name, Score */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={athlete.avatar}
                          alt={athlete.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#a3e635]/60"
                        />
                        <div>
                          <h3 className="font-bold text-white text-sm">{athlete.name}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {athlete.district}, {athlete.state}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">STRIDE</span>
                        <span className="text-xl font-black font-mono text-[#a3e635]">
                          {athlete.strideScore}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-200 mb-2">
                      {athlete.primarySport} ({athlete.positionOrDiscipline})
                    </p>

                    {/* Biometric Stats Snapshot */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] text-center text-xs mb-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">V-Jump</span>
                        <span className="font-bold text-white font-mono">{athlete.keyStats.verticalJumpCm} cm</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">30m Dash</span>
                        <span className="font-bold text-[#a3e635] font-mono">{athlete.keyStats.sprint30mSec} s</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Pushups</span>
                        <span className="font-bold text-cyan-400 font-mono">{athlete.keyStats.pushups60s}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {athlete.badges.slice(0, 2).map((b, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-[#141c27] text-slate-300 px-2 py-0.5 rounded-md border border-[#273548]"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#1f2d3d] flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleSaveAthlete(athlete.id)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-[#a3e635]/15 border-[#a3e635]/40 text-[#a3e635]'
                          : 'bg-[#141c27] border-[#273548] text-slate-300 hover:text-white'
                      }`}
                    >
                      {isSaved ? '★ Saved' : '+ Shortlist'}
                    </button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleInviteToTrial(athlete.name)}
                    >
                      Invite to Trial
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <AiDisclaimerNotice />
      </div>
    </div>
  );
};
