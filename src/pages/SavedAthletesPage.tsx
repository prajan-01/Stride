import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  BookmarkCheck,
  MapPin,
  Trash2,
  Send,
  Users,
  Scale,
  Download,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { DemoBanner } from '../components/common/DemoBanner';

export const SavedAthletesPage: React.FC = () => {
  const { athletes, savedAthleteIds, toggleSaveAthlete, showToast } = useApp();

  const savedAthletes = athletes.filter((a) => savedAthleteIds.includes(a.id));

  // Comparison State
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Scout Notes State
  const [scoutNotes, setScoutNotes] = useState<{ [id: string]: string }>({
    'ath-002': 'Priority invite for Kerala Badminton high-performance camp. Exceptional wrist snap.',
    'ath-003': 'High cardiovascular endurance. Potential central midfield leader for Junior National hockey team.',
  });

  const toggleComparison = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        showToast('You can compare a maximum of 2 athletes side-by-side', 'info');
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleExportRoster = () => {
    showToast('Exported SAI Zonal Shortlist Roster (PDF & Excel format)', 'success');
  };

  const athleteA = athletes.find((a) => a.id === selectedForComparison[0]);
  const athleteB = athletes.find((a) => a.id === selectedForComparison[1]);

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f2d3d] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
                COACH ROSTER
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">SAI Selection Shortlist</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Saved Athletes</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Athletes bookmarked for upcoming zonal selection trials and national camp invitations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {selectedForComparison.length === 2 && (
              <Button
                variant="primary"
                size="md"
                leftIcon={<Scale className="w-4 h-4" />}
                onClick={() => setIsCompareModalOpen(true)}
              >
                Compare Selected (2)
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportRoster}
            >
              Export Roster
            </Button>
          </div>
        </div>

        {savedAthletes.length === 0 ? (
          <EmptyState
            icon={BookmarkCheck}
            title="No Athletes Bookmarked Yet"
            description="Explore the national athlete directory and click '+ Shortlist' to add prospects to your scouting board."
            actionText="Browse Athlete Directory"
            onAction={() => (window.location.href = '/scout/athletes')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedAthletes.map((athlete) => {
              const isComparing = selectedForComparison.includes(athlete.id);
              const note = scoutNotes[athlete.id] || '';

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

                    {/* Stats table */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] text-center text-xs mb-3">
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

                    {/* Scout note */}
                    <div className="p-2.5 rounded-xl bg-[#070a0e]/60 border border-[#1f2d3d] mb-4 text-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Coach Note:
                      </span>
                      <p className="text-slate-300 italic text-[11px] leading-relaxed">
                        {note ? `"${note}"` : 'No notes added yet.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-[#1f2d3d] flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleComparison(athlete.id)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isComparing
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                          : 'bg-[#141c27] border-[#273548] text-slate-300 hover:text-white'
                      }`}
                    >
                      {isComparing ? '✓ In Compare' : '+ Compare'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveAthlete(athlete.id)}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        title="Remove from shortlisted"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => showToast(`Trial invitation dispatched to ${athlete.name}!`, 'success')}
                      >
                        Send Invite
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {athleteA && athleteB && (
        <Modal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          title="Head-to-Head Athlete Biometric Comparison"
          subtitle="Side-by-side analysis for SAI Zonal Camp Selection"
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                <img
                  src={athleteA.avatar}
                  alt={athleteA.name}
                  className="w-14 h-14 rounded-xl mx-auto object-cover mb-2 border border-[#a3e635]/60"
                />
                <h4 className="font-bold text-white text-sm">{athleteA.name}</h4>
                <p className="text-xs text-slate-400">{athleteA.district}, {athleteA.state}</p>
                <span className="text-lg font-black text-[#a3e635] font-mono mt-1 block">
                  Score: {athleteA.strideScore}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                <img
                  src={athleteB.avatar}
                  alt={athleteB.name}
                  className="w-14 h-14 rounded-xl mx-auto object-cover mb-2 border border-cyan-400/60"
                />
                <h4 className="font-bold text-white text-sm">{athleteB.name}</h4>
                <p className="text-xs text-slate-400">{athleteB.district}, {athleteB.state}</p>
                <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">
                  Score: {athleteB.strideScore}
                </span>
              </div>
            </div>

            {/* Metrics Comparison Table */}
            <div className="rounded-xl border border-[#1f2d3d] overflow-hidden text-xs">
              <div className="p-3 bg-[#070a0e] font-mono uppercase text-slate-400 grid grid-cols-3 text-center border-b border-[#1f2d3d]">
                <span>{athleteA.name.split(' ')[0]}</span>
                <span>METRIC</span>
                <span>{athleteB.name.split(' ')[0]}</span>
              </div>
              <div className="divide-y divide-[#1f2d3d]/50">
                <div className="p-3 grid grid-cols-3 text-center items-center">
                  <span className="font-black text-white font-mono">{athleteA.keyStats.verticalJumpCm} cm</span>
                  <span className="text-slate-400">Vertical Jump</span>
                  <span className="font-black text-white font-mono">{athleteB.keyStats.verticalJumpCm} cm</span>
                </div>
                <div className="p-3 grid grid-cols-3 text-center items-center">
                  <span className="font-black text-[#a3e635] font-mono">{athleteA.keyStats.sprint30mSec} s</span>
                  <span className="text-slate-400">30m Sprint</span>
                  <span className="font-black text-cyan-400 font-mono">{athleteB.keyStats.sprint30mSec} s</span>
                </div>
                <div className="p-3 grid grid-cols-3 text-center items-center">
                  <span className="font-black text-white font-mono">{athleteA.keyStats.pushups60s} reps</span>
                  <span className="text-slate-400">Push-Up Test</span>
                  <span className="font-black text-white font-mono">{athleteB.keyStats.pushups60s} reps</span>
                </div>
                <div className="p-3 grid grid-cols-3 text-center items-center">
                  <span className="font-black text-white font-mono">Level {athleteA.keyStats.beepTestLevel}</span>
                  <span className="text-slate-400">VO2 Max Beep</span>
                  <span className="font-black text-white font-mono">Level {athleteB.keyStats.beepTestLevel}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" onClick={() => setIsCompareModalOpen(false)}>
                Close Comparison
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
