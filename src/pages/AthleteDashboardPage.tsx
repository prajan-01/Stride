import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  TrendingUp,
  Award,
  ShieldCheck,
  ChevronRight,
  Play,
  Calendar,
  Compass,
  ArrowUpRight,
  Eye,
  CheckCircle,
  Trophy,
  Download,
  Trash2,
  Bell,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  FileText,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ProgressLineChart } from '../components/charts/ProgressLineChart';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';
import { AssessmentAttempt } from '../types';

export const AthleteDashboardPage: React.FC = () => {
  const {
    currentAthlete,
    attempts,
    deleteAssessmentAttempt,
    opportunities,
    savedOpportunityIds,
    toggleSaveOpportunity,
    applyToOpportunity,
    profileCompletion,
    personalBests,
    progressChartData,
    exportAthleteResultsToCSV,
    notifications,
  } = useApp();

  // Delete modal state
  const [deleteAttemptId, setDeleteAttemptId] = useState<string | null>(null);
  const [reviewAttempt, setReviewAttempt] = useState<AssessmentAttempt | null>(null);

  const latestAttempt = attempts.length > 0 ? attempts[0] : null;
  const recentHistory = attempts.slice(0, 4);
  const eligibleOpportunities = opportunities.filter((o) => o.minStrideScore <= currentAthlete.strideScore).slice(0, 2);
  const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 2);

  // 4 Featured Assessment Cards
  const featuredAssessments = [
    {
      slug: 'vertical-jump',
      title: 'Vertical Jump',
      category: 'Explosive Power',
      metric: 'Height (cm)',
      standard: '> 65 cm (Elite)',
      time: '45s',
      color: 'border-[#a3e635]/40 text-[#a3e635]',
    },
    {
      slug: '30m-sprint',
      title: '30m Sprint',
      category: 'Speed & Agility',
      metric: 'Time (s)',
      standard: '< 3.85s (National)',
      time: '20s',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      slug: 'pushup-endurance',
      title: '60s Push-ups',
      category: 'Core & Strength',
      metric: 'Reps (60s)',
      standard: '> 55 reps (Elite)',
      time: '60s',
      color: 'border-amber-500/40 text-amber-400',
    },
    {
      slug: 'beep-test',
      title: 'Beep Test (VO2)',
      category: 'Cardio Endurance',
      metric: 'Stage Level',
      standard: 'Level 13.5+ (Elite)',
      time: '15m',
      color: 'border-emerald-500/40 text-emerald-400',
    },
  ];

  const handleConfirmDelete = () => {
    if (deleteAttemptId) {
      deleteAssessmentAttempt(deleteAttemptId);
      setDeleteAttemptId(null);
    }
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Welcome, Passport, and Profile Completion Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0e141d] via-[#121924] to-[#0a1017] border border-[#273548] p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#a3e635]/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Athlete Details */}
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={currentAthlete.avatar}
                alt={currentAthlete.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#a3e635] shadow-[0_0_20px_-5px_rgba(163,230,53,0.4)]"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentAthlete.name}
                  </h1>
                  <Badge variant="lime" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                    Verified Identity
                  </Badge>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                    SAMPLE DEMO DATA
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {currentAthlete.primarySport} • {currentAthlete.academy}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>Age {currentAthlete.age}</span>
                  <span>•</span>
                  <span>{currentAthlete.district}, {currentAthlete.state}</span>
                  <span>•</span>
                  <span>Height: {currentAthlete.heightCm} cm</span>
                  <span>•</span>
                  <span>Weight: {currentAthlete.weightKg} kg</span>
                  <span>•</span>
                  <span className="text-slate-300">
                    <strong className="text-white">{currentAthlete.scoutedByCount}</strong> Scouts Monitored
                  </span>
                </div>
              </div>
            </div>

            {/* Score & Profile Completion Widget */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Profile Completion Box */}
              <div className="bg-[#070a0e]/80 border border-[#273548] p-4 rounded-2xl min-w-[200px]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-300">Profile Completion</span>
                  <span className="font-bold text-[#a3e635] font-mono">{profileCompletion.percentage}%</span>
                </div>
                <div className="w-full bg-[#141c27] h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-gradient-to-r from-[#a3e635] to-[#38bdf8] h-full rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion.percentage}%` }}
                  />
                </div>
                <Link
                  to="/profile"
                  className="text-[11px] text-[#a3e635] hover:underline font-semibold flex items-center gap-1"
                >
                  {profileCompletion.percentage < 100 ? 'Complete Profile' : 'View Full Passport'}{' '}
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Stride Score Widget */}
              <div className="flex items-center gap-3 bg-[#070a0e]/80 border border-[#273548] p-4 rounded-2xl shrink-0 backdrop-blur-md">
                <div className="text-center px-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">STRIDE INDEX</span>
                  <span className="text-3xl font-black font-mono text-[#a3e635]">
                    {currentAthlete.strideScore}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">/ 100</span>
                </div>
                <div className="h-10 w-px bg-slate-800" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-white block">Top 3.6% National</span>
                  <span className="text-slate-400 block text-[11px]">SAI Junior Elite</span>
                  <Link to="/results" className="text-[11px] text-[#a3e635] hover:underline font-bold inline-flex items-center">
                    Analytics <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 pt-6 border-t border-[#1f2d3d] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link to="/assessments">
                <Button variant="primary" size="sm" leftIcon={<Zap className="w-4 h-4" />}>
                  Take AI Fitness Test
                </Button>
              </Link>
              <Link to="/opportunities">
                <Button variant="secondary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
                  View Scholarships
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={exportAthleteResultsToCSV}
              >
                Export CSV
              </Button>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>3 SAI scouts viewed your telemetry this week</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Four Featured Assessment Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Standardized Fitness Battery</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  4 Core Battery Tests
                </span>
              </div>
              <p className="text-xs text-slate-400">Computer vision protocols calibrated for Indian junior athletes</p>
            </div>
            <Link to="/assessments" className="text-xs font-semibold text-[#a3e635] hover:underline flex items-center gap-1">
              Browse All Assessments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredAssessments.map((test) => (
              <Card key={test.slug} hoverGlow className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-[#141c27] text-slate-300 border border-[#273548]">
                      {test.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{test.time}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{test.title}</h3>
                  <p className="text-xs text-slate-400 mb-2">Measured: {test.metric}</p>
                  
                  <div className="p-2 rounded-lg bg-[#070a0e] border border-[#1f2d3d] mb-4 text-[11px] font-mono text-slate-300">
                    SAI Standard: <span className="text-[#a3e635] font-bold">{test.standard}</span>
                  </div>
                </div>

                <Link to={`/assessments/${test.slug}/instructions`}>
                  <Button variant="primary" size="sm" className="w-full" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Start Assessment
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* SECTION 2: Latest Results & Personal Bests */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Latest Result Card (5 cols) */}
          <Card className="p-6 lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#a3e635] tracking-wider block">
                  MOST RECENT TRIAL
                </span>
                <h3 className="text-lg font-bold text-white">Latest Assessment Result</h3>
              </div>
              <Badge variant="lime" size="sm">
                Sample Result
              </Badge>
            </div>

            {latestAttempt ? (
              <div className="p-4 rounded-2xl bg-[#070a0e] border border-[#1f2d3d] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{latestAttempt.assessmentTitle}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {latestAttempt.date}
                    </p>
                  </div>
                  <Badge variant="lime" size="sm">
                    {latestAttempt.strideTier}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-[#0e141d] border border-[#1f2d3d]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Recorded Score</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {latestAttempt.metricValue}
                    </span>
                    <span className="text-xs text-[#a3e635] font-mono ml-1">{latestAttempt.metricUnit}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e141d] border border-[#1f2d3d]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Percentile</span>
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      {latestAttempt.nationalPercentile}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">th %tile</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-slate-400">
                    AI Pose Confidence: <strong className="text-white font-mono">{latestAttempt.aiPostureAccuracy}%</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewAttempt(latestAttempt)}
                      className="text-[#a3e635] hover:underline font-bold cursor-pointer"
                    >
                      Review
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      onClick={() => setDeleteAttemptId(latestAttempt.id)}
                      className="text-rose-400 hover:underline font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No assessments recorded yet.</p>
            )}

            <Link to="/results">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ChevronRight className="w-4 h-4" />}>
                View All Results & History
              </Button>
            </Link>
          </Card>

          {/* Personal Bests (7 cols) */}
          <Card className="p-6 lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#a3e635] tracking-wider block">
                  ALL-TIME RECORDS
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Personal Bests (PB)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Verified by STRIDE AI</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* PB 1: Vertical Jump */}
              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Vertical Jump</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">
                    {personalBests['vertical-jump'] ? personalBests['vertical-jump'].value : currentAthlete.keyStats.verticalJumpCm}
                  </span>
                  <span className="text-xs text-[#a3e635] font-mono">cm</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Top 2% SAI</span>
              </div>

              {/* PB 2: 30m Sprint */}
              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">30m Sprint</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">
                    {personalBests['30m-sprint'] ? personalBests['30m-sprint'].value : currentAthlete.keyStats.sprint30mSec}
                  </span>
                  <span className="text-xs text-[#a3e635] font-mono">s</span>
                </div>
                <span className="text-[10px] text-slate-500 block">National Elite</span>
              </div>

              {/* PB 3: Push-ups */}
              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">60s Push-ups</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">
                    {personalBests['pushup-endurance'] ? personalBests['pushup-endurance'].value : currentAthlete.keyStats.pushups60s}
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">reps</span>
                </div>
                <span className="text-[10px] text-slate-500 block">Army Camp Standard</span>
              </div>

              {/* PB 4: Beep Test */}
              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Beep Test</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">
                    Lvl {currentAthlete.keyStats.beepTestLevel}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">State Camp Level</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-[#121924] p-3 rounded-xl border border-[#1f2d3d]">
              💡 All personal best records automatically update when you complete a new verified AI assessment.
            </p>
          </Card>
        </div>

        {/* SECTION 3: Progress Charts (Embedded Recharts with actual demo user data) */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Longitudinal Progress Charts</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#a3e635]/15 text-[#a3e635] border border-[#a3e635]/30">
                  Actual Demo Data
                </span>
              </div>
              <p className="text-xs text-slate-400">6-Month STRIDE scoring trajectory & percentile gains</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={exportAthleteResultsToCSV}
              >
                Export CSV
              </Button>
              <Link to="/results">
                <Button variant="secondary" size="sm">
                  Full Analytics View
                </Button>
              </Link>
            </div>
          </div>

          <ProgressLineChart data={progressChartData} />
        </Card>

        {/* SECTION 4: Recent Assessment History Table (with review & delete) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Assessment History</h3>
              <p className="text-xs text-slate-400">Sample assessment records available to current demo user</p>
            </div>
            <Link to="/results" className="text-xs font-semibold text-[#a3e635] hover:underline">
              View All History ({attempts.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070a0e] text-slate-400 font-mono uppercase border-b border-[#1f2d3d]">
                <tr>
                  <th className="p-3">Test Name</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Percentile</th>
                  <th className="p-3">SAI Tier</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2d3d]/50">
                {recentHistory.map((att) => (
                  <tr key={att.id} className="hover:bg-[#121924]/50 transition-colors">
                    <td className="p-3 font-bold text-white">
                      {att.assessmentTitle}
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{att.date}</td>
                    <td className="p-3 font-mono text-[#a3e635] font-black">
                      {att.metricValue} {att.metricUnit}
                    </td>
                    <td className="p-3 font-mono text-cyan-400">{att.nationalPercentile}th</td>
                    <td className="p-3">
                      <Badge variant="lime" size="sm">
                        {att.strideTier}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setReviewAttempt(att)}
                          className="text-[#a3e635] hover:underline font-bold cursor-pointer"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => setDeleteAttemptId(att.id)}
                          className="text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                          title="Delete sample record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* SECTION 5: Sports Opportunities & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Opportunities (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Sports Opportunities & Schemes</h3>
                <p className="text-xs text-slate-400">Recommended for your STRIDE score ({currentAthlete.strideScore})</p>
              </div>
              <Link to="/opportunities" className="text-xs text-[#a3e635] hover:underline font-semibold">
                All Schemes
              </Link>
            </div>

            <div className="space-y-3">
              {eligibleOpportunities.map((opp) => {
                const isSaved = savedOpportunityIds.includes(opp.id);
                return (
                  <div
                    key={opp.id}
                    className="p-5 rounded-2xl bg-[#0e141d] border border-[#1f2d3d] hover:border-[#a3e635]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge variant="lime" size="sm">
                        {opp.badge}
                      </Badge>
                      <button
                        onClick={() => toggleSaveOpportunity(opp.id)}
                        className="text-slate-400 hover:text-[#a3e635] cursor-pointer"
                        title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#a3e635]" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                    <p className="text-xs text-slate-400 mb-2">{opp.organization}</p>
                    <p className="text-xs text-[#a3e635] font-semibold mb-3">💰 {opp.stipendOrBenefits}</p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1f2d3d]">
                      <span className="text-slate-500">Deadline: {opp.deadline}</span>
                      <div className="flex items-center gap-2">
                        <Link to={`/opportunities/${opp.id}`}>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </Link>
                        {opp.applicationStatus === 'applied' ? (
                          <Badge variant="lime" size="sm">
                            Applied
                          </Badge>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => applyToOpportunity(opp.id)}
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications & Verification Hub (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Verification Status Card */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#a3e635]" />
                  Verification Status
                </h4>
                <Badge variant="lime" size="sm">
                  Tier-1 Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aadhaar age verification and State Athletics Federation records active. 100% eligible for national trials.
              </p>
              <Link to="/verification">
                <Button variant="outline" size="sm" className="w-full">
                  Verification Portal
                </Button>
              </Link>
            </Card>

            {/* Notifications Preview Card */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  Recent Alerts
                </h4>
                <Link to="/notifications" className="text-xs text-[#a3e635] hover:underline font-semibold">
                  View All
                </Link>
              </div>

              <div className="space-y-2.5">
                {unreadNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <AiDisclaimerNotice />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteAttemptId !== null}
        onClose={() => setDeleteAttemptId(null)}
        title="Confirm Deletion of Sample Assessment Record"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Are you sure you want to delete this sample assessment record? Your personal bests and progress charts will be dynamically recalculated based on your remaining demo records.
          </p>

          <div className="pt-3 border-t border-[#1f2d3d] flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setDeleteAttemptId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleConfirmDelete}>
              Confirm Delete Record
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Result Modal */}
      {reviewAttempt && (
        <Modal
          isOpen={reviewAttempt !== null}
          onClose={() => setReviewAttempt(null)}
          title={`Review: ${reviewAttempt.assessmentTitle}`}
          subtitle={`Recorded on ${reviewAttempt.date} • ${reviewAttempt.strideTier}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Recorded Result</span>
                <span className="text-2xl font-black text-white font-mono">{reviewAttempt.metricValue}</span>
                <span className="text-xs text-[#a3e635] font-mono ml-1">{reviewAttempt.metricUnit}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">National Percentile</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{reviewAttempt.nationalPercentile}</span>
                <span className="text-xs text-slate-400 font-mono ml-1">th</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
              <span className="text-slate-400 font-semibold block">AI Pose Confidence:</span>
              <p className="text-slate-200 font-mono">{reviewAttempt.aiPostureAccuracy}% Confidence across 33 keypoints</p>
            </div>

            {reviewAttempt.aiCoachFeedback && reviewAttempt.aiCoachFeedback.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-slate-300 font-bold block">AI Feedback Notes:</span>
                {reviewAttempt.aiCoachFeedback.map((f, i) => (
                  <p key={i} className="text-slate-400 bg-[#121924] p-2 rounded-lg border border-[#1f2d3d]">
                    • {f}
                  </p>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#1f2d3d] flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setDeleteAttemptId(reviewAttempt.id);
                  setReviewAttempt(null);
                }}
                className="text-rose-400 hover:underline font-medium text-xs cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete this Record
              </button>
              <Button variant="secondary" size="md" onClick={() => setReviewAttempt(null)}>
                Close Review
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
