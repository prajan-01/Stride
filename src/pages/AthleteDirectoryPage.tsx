import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  BookmarkCheck,
  MapPin,
  ShieldCheck,
  LayoutGrid,
  List,
  ChevronRight,
  UserX,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';

export const AthleteDirectoryPage: React.FC = () => {
  const { athletes, savedAthleteIds, toggleSaveAthlete } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [minScore, setMinScore] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const sports = ['All', 'Athletics', 'Badminton', 'Field Hockey', 'Boxing', 'Kabaddi', 'Archery', 'Weightlifting'];
  const states = ['All', 'Haryana', 'Kerala', 'Punjab', 'Manipur', 'Tamil Nadu', 'Maharashtra', 'Odisha'];

  const filteredAthletes = athletes.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.district.toLowerCase().includes(search.toLowerCase()) ||
      a.academy.toLowerCase().includes(search.toLowerCase());
    const matchesSport = selectedSport === 'All' || a.primarySport.includes(selectedSport);
    const matchesState = selectedState === 'All' || a.state === selectedState;
    const matchesScore = a.strideScore >= minScore;
    return matchesSearch && matchesSport && matchesState && matchesScore;
  });

  const resetFilters = () => {
    setSearch('');
    setSelectedSport('All');
    setSelectedState('All');
    setMinScore(0);
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f2d3d] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
                TALENT DISCOVERY ENGINE
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">SAI Verified Feeder Pool</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">National Athlete Directory</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Directly scout verified athletes across 28 Indian States with computer vision benchmark data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#141c27] border-[#a3e635] text-[#a3e635]'
                  : 'bg-[#0e141d] border-[#1f2d3d] text-slate-400 hover:text-white'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#141c27] border-[#a3e635] text-[#a3e635]'
                  : 'bg-[#0e141d] border-[#1f2d3d] text-slate-400 hover:text-white'
              }`}
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <Card className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search athlete, district, academy..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            {/* Sport Select */}
            <div>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              >
                {sports.map((sp) => (
                  <option key={sp} value={sp}>
                    Sport: {sp}
                  </option>
                ))}
              </select>
            </div>

            {/* State Select */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    State: {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Score Select */}
            <div>
              <select
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              >
                <option value={0}>All Scores (0+)</option>
                <option value={85}>Score 85+ (State Level)</option>
                <option value={90}>Score 90+ (National Level)</option>
                <option value={94}>Score 94+ (Elite Olympic Feeder)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredAthletes.length}</strong> verified athletes
          </span>
          {(search || selectedSport !== 'All' || selectedState !== 'All' || minScore > 0) && (
            <button
              onClick={resetFilters}
              className="text-[#a3e635] hover:underline font-semibold cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredAthletes.length === 0 ? (
          <EmptyState
            icon={UserX}
            title="No Athletes Found Matching Filters"
            description="Try clearing your search query or selecting a different Indian state/sport category."
            actionText="Reset Filters"
            onAction={resetFilters}
          />
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAthletes.map((athlete) => {
              const isSaved = savedAthleteIds.includes(athlete.id);
              return (
                <Card key={athlete.id} hoverGlow className="p-6 flex flex-col justify-between">
                  <div>
                    {/* Header */}
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

                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                      {athlete.bio}
                    </p>

                    {/* Stats table snapshot */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] text-center text-xs mb-4">
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Jump</span>
                        <span className="font-bold text-white font-mono">{athlete.keyStats.verticalJumpCm}cm</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Sprint</span>
                        <span className="font-bold text-[#a3e635] font-mono">{athlete.keyStats.sprint30mSec}s</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Pushups</span>
                        <span className="font-bold text-cyan-400 font-mono">{athlete.keyStats.pushups60s}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer buttons */}
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

                    <Link to="/profile">
                      <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                        Passport
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070a0e] text-slate-400 font-mono uppercase border-b border-[#1f2d3d]">
                  <tr>
                    <th className="p-3.5">Athlete</th>
                    <th className="p-3.5">Sport & Discipline</th>
                    <th className="p-3.5">State</th>
                    <th className="p-3.5">STRIDE Score</th>
                    <th className="p-3.5">Vertical Jump</th>
                    <th className="p-3.5">30m Sprint</th>
                    <th className="p-3.5">Push-ups</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2d3d]/50">
                  {filteredAthletes.map((athlete) => {
                    const isSaved = savedAthleteIds.includes(athlete.id);
                    return (
                      <tr key={athlete.id} className="hover:bg-[#121924]/50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={athlete.avatar}
                              alt={athlete.name}
                              className="w-8 h-8 rounded-lg object-cover border border-[#a3e635]/50"
                            />
                            <div>
                              <span className="font-bold text-white block">{athlete.name}</span>
                              <span className="text-[10px] text-slate-400">Age {athlete.age}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium text-slate-200">
                          {athlete.primarySport}
                        </td>
                        <td className="p-3.5 text-slate-400">
                          {athlete.district}, {athlete.state}
                        </td>
                        <td className="p-3.5 font-black text-[#a3e635] font-mono">
                          {athlete.strideScore} / 100
                        </td>
                        <td className="p-3.5 font-mono text-white">
                          {athlete.keyStats.verticalJumpCm} cm
                        </td>
                        <td className="p-3.5 font-mono text-[#a3e635] font-bold">
                          {athlete.keyStats.sprint30mSec} s
                        </td>
                        <td className="p-3.5 font-mono text-cyan-400 font-bold">
                          {athlete.keyStats.pushups60s} reps
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => toggleSaveAthlete(athlete.id)}
                            className="text-xs text-[#a3e635] hover:underline font-bold mr-3 cursor-pointer"
                          >
                            {isSaved ? 'Unsave' : 'Save'}
                          </button>
                          <Link to="/profile" className="text-xs text-slate-400 hover:text-white">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <AiDisclaimerNotice />
      </div>
    </div>
  );
};
