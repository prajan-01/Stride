import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Award,
  ShieldCheck,
  Send,
  Building,
  User,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DemoBanner } from '../components/common/DemoBanner';

export const OpportunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { opportunities, applyToOpportunity, currentAthlete } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [statement, setStatement] = useState(
    'I am applying with my verified STRIDE performance passport (Score 92, 100m sprint 10.82s PB). Dedicated to winning medals for India at international junior meets.'
  );

  const opportunity = opportunities.find((o) => o.id === id) || opportunities[0];
  const isApplied = opportunity.applicationStatus === 'applied';
  const isEligible = currentAthlete.strideScore >= opportunity.minStrideScore;

  const handleConfirmApplication = (e: React.FormEvent) => {
    e.preventDefault();
    applyToOpportunity(opportunity.id);
    setIsApplyModalOpen(false);
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Back Link */}
        <Link
          to="/opportunities"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#a3e635] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Opportunities
        </Link>

        {/* Opportunity Header Card */}
        <div className="rounded-3xl bg-[#0e141d] border border-[#273548] p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="lime" size="sm">
                  {opportunity.badge}
                </Badge>
                <Badge variant="cyan" size="sm">
                  {opportunity.category}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{opportunity.title}</h1>
              <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#a3e635]" />
                {opportunity.organization}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              {isApplied ? (
                <div className="p-3 rounded-2xl bg-[#a3e635]/15 border border-[#a3e635]/40 text-center">
                  <span className="text-xs font-bold text-[#a3e635] flex items-center gap-1.5 justify-center">
                    <CheckCircle className="w-4 h-4" /> Application Submitted
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Under Review by SAI Zonal Committee
                  </span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!isEligible}
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  {isEligible ? 'Apply with STRIDE Passport' : 'Score Below Requirement'}
                </Button>
              )}
            </div>
          </div>

          {/* Stipend Banner */}
          <div className="p-4 rounded-2xl bg-[#070a0e] border border-[#1f2d3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Scholarship Grant & Boarding</span>
              <span className="text-base font-bold text-[#a3e635]">💰 {opportunity.stipendOrBenefits}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {opportunity.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Deadline: {opportunity.deadline}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Details (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description */}
            <Card className="p-6 space-y-3">
              <h3 className="text-base font-bold text-white">About the Scheme</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {opportunity.description}
              </p>
            </Card>

            {/* Eligibility Criteria */}
            <Card className="p-6 space-y-3">
              <h3 className="text-base font-bold text-white">Eligibility Criteria</h3>
              <div className="space-y-2">
                {opportunity.eligibilityCriteria.map((crit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{crit}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Selection Process Stages */}
            <Card className="p-6 space-y-3">
              <h3 className="text-base font-bold text-white">Multi-Phase Selection Process</h3>
              <div className="space-y-3">
                {opportunity.selectionProcess.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] flex items-center gap-3 text-xs text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-[#141c27] text-[#a3e635] border border-[#273548] flex items-center justify-center font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Athlete Readiness Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Your Candidate Status</h3>

              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">STRIDE Score Verification</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-[#a3e635] font-mono">
                    {currentAthlete.strideScore} / 100
                  </span>
                  <Badge variant="lime" size="sm">
                    Required: {opportunity.minStrideScore}+
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Aadhaar Identity:</span>
                  <span className="text-[#a3e635] font-bold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Age Category:</span>
                  <span className="text-white font-mono">{opportunity.ageCriteria}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Laser / Vision Timing:</span>
                  <span className="text-[#a3e635] font-bold">✓ 30m Track Set</span>
                </div>
              </div>

              {!isApplied && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  disabled={!isEligible}
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply Online Now
                </Button>
              )}
            </Card>

            <div className="p-4 rounded-2xl bg-[#0e141d] border border-[#273548] text-xs text-slate-400 space-y-1.5">
              <span className="font-bold text-white block">Official SAI Guarantee</span>
              <p className="leading-relaxed">
                Applications submitted through STRIDE bypass manual district physical queue backlogs and are forwarded directly to the high-performance scouting directorate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Application Confirmation Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit STRIDE Digital Application"
        subtitle={opportunity.title}
      >
        <form onSubmit={handleConfirmApplication} className="space-y-4">
          <div className="p-4 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-2 text-xs">
            <span className="font-bold text-white block">Attached Biometric Passport Data:</span>
            <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
              <div>Athlete: {currentAthlete.name}</div>
              <div>STRIDE Score: {currentAthlete.strideScore}</div>
              <div>State: {currentAthlete.state}</div>
              <div>Sport: {currentAthlete.primarySport}</div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Personal Statement to Selection Board
            </label>
            <textarea
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
            />
          </div>

          <div className="pt-3 border-t border-[#1f2d3d] flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit" rightIcon={<Send className="w-4 h-4" />}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
