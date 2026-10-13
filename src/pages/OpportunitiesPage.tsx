import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Award,
  Bookmark,
  BookmarkCheck,
  Send,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';
import { Opportunity } from '../types';

export const OpportunitiesPage: React.FC = () => {
  const {
    opportunities,
    savedOpportunityIds,
    toggleSaveOpportunity,
    applyToOpportunity,
    currentAthlete,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingOpportunity, setApplyingOpportunity] = useState<Opportunity | null>(null);
  const [statement, setStatement] = useState(
    'I am applying with my verified STRIDE performance passport. Dedicated to winning medals for India at international junior meets.'
  );

  const categories = [
    'All',
    'Saved Schemes',
    'National Scheme',
    'Residential Academy',
    'Direct Trial',
    'CSR Sponsorship',
    'State Camp',
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    let matchesCategory = true;
    if (selectedCategory === 'Saved Schemes') {
      matchesCategory = savedOpportunityIds.includes(opp.id);
    } else if (selectedCategory !== 'All') {
      matchesCategory = opp.category === selectedCategory;
    }

    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.eligibleSports.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyingOpportunity) {
      applyToOpportunity(applyingOpportunity.id, statement);
      setApplyingOpportunity(null);
    }
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f2d3d] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
                GOVERNMENT & ELITE SCHEMES
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                SAMPLE DEMO DATA
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Sports Opportunities</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Access government financial stipends, residential sports academies, and high-performance trials across India directly through your STRIDE verified passport.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0e141d] border border-[#273548] text-xs">
            <span className="text-slate-400 block">Your Current STRIDE Index:</span>
            <span className="text-xl font-black text-[#a3e635] font-mono">
              {currentAthlete.strideScore} / 100
            </span>
            <span className="text-[11px] text-cyan-400 block">
              Eligible for {opportunities.filter((o) => o.minStrideScore <= currentAthlete.strideScore).length} Schemes
            </span>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const label =
                cat === 'Saved Schemes'
                  ? `Saved Schemes (${savedOpportunityIds.length})`
                  : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#a3e635] text-slate-950 font-bold shadow-sm'
                      : 'bg-[#0e141d] text-slate-400 hover:text-white border border-[#1f2d3d]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by sport, scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e141d] border border-[#1f2d3d] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#a3e635]"
            />
          </div>
        </div>

        {/* Opportunities List */}
        {filteredOpportunities.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 rounded-2xl bg-[#0e141d] border border-dashed border-[#1f2d3d]">
            No sports schemes found matching your selected category or search filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map((opp) => {
              const isEligible = currentAthlete.strideScore >= opp.minStrideScore;
              const isSaved = savedOpportunityIds.includes(opp.id);

              return (
                <Card key={opp.id} hoverGlow className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="lime" size="sm">
                          {opp.badge}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {opp.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          Min Score: {opp.minStrideScore}+
                        </span>
                        <button
                          onClick={() => toggleSaveOpportunity(opp.id)}
                          className="text-slate-400 hover:text-[#a3e635] p-1 rounded cursor-pointer"
                          title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-[#a3e635]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 leading-snug">{opp.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{opp.organization}</p>

                    <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] mb-4 space-y-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Stipend & Benefits</span>
                      <p className="text-xs font-semibold text-[#a3e635] leading-snug">
                        💰 {opp.stipendOrBenefits}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                      {opp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {opp.eligibleSports.map((sp, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-[#141c27] text-slate-300 px-2 py-0.5 rounded-md border border-[#273548]"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1f2d3d] flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {opp.location}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Deadline: {opp.deadline}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/opportunities/${opp.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </Link>

                      {opp.applicationStatus === 'applied' ? (
                        <Badge variant="lime" icon={<CheckCircle className="w-3 h-3" />}>
                          Applied
                        </Badge>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!isEligible}
                          onClick={() => setApplyingOpportunity(opp)}
                        >
                          {isEligible ? 'Apply Now' : 'Score Too Low'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <AiDisclaimerNotice />
      </div>

      {/* Direct Application Modal on Opportunities Page */}
      {applyingOpportunity && (
        <Modal
          isOpen={applyingOpportunity !== null}
          onClose={() => setApplyingOpportunity(null)}
          title="Submit Application (Demo Mode)"
          subtitle={applyingOpportunity.title}
        >
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="p-4 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-2 text-xs">
              <span className="font-bold text-white block">Attached Demo Athlete Passport:</span>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                <div>Name: {currentAthlete.name}</div>
                <div>STRIDE Score: {currentAthlete.strideScore} / 100</div>
                <div>State: {currentAthlete.state}</div>
                <div>Sport: {currentAthlete.primarySport}</div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Statement / Pitch to Selection Committee
              </label>
              <textarea
                rows={4}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div className="pt-3 border-t border-[#1f2d3d] flex justify-end gap-3">
              <Button variant="secondary" size="md" onClick={() => setApplyingOpportunity(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" rightIcon={<Send className="w-4 h-4" />}>
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
