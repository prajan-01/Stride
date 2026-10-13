import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Award,
  ChevronRight,
  Activity,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ProgressLineChart } from '../components/charts/ProgressLineChart';
import { PerformanceRadarChart } from '../components/charts/PerformanceRadarChart';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';
import { AssessmentAttempt } from '../types';

export const ProgressChartsPage: React.FC = () => {
  const {
    attempts,
    currentAthlete,
    progressChartData,
    deleteAssessmentAttempt,
    exportAthleteResultsToCSV,
    personalBests,
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [deleteAttemptId, setDeleteAttemptId] = useState<string | null>(null);
  const [reviewAttempt, setReviewAttempt] = useState<AssessmentAttempt | null>(null);

  const filteredAttempts = attempts.filter((att) => {
    if (selectedFilter === 'all') return true;
    return att.assessmentId.includes(selectedFilter);
  });

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
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f2d3d] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
                LONGITUDINAL ANALYTICS
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                SAMPLE DEMO DATA
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              My Results & Progress Charts
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Continuous athletic development tracking. Review, export to CSV, or manage your sample assessment attempts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={exportAthleteResultsToCSV}
            >
              Export Results to CSV
            </Button>
            <Link to="/assessments">
              <Button variant="primary" size="md">
                Take New Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* Charts Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Chart: 6-Month Progression (Using current user's actual demo data) */}
          <Card className="p-6 lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">STRIDE Score Progression</h3>
                <p className="text-xs text-slate-400">Scoring trajectory calculated from your demo test history</p>
              </div>
              <Badge variant="lime" icon={<TrendingUp className="w-3.5 h-3.5" />}>
                Active Score: {currentAthlete.strideScore}
              </Badge>
            </div>
            <ProgressLineChart data={progressChartData} />
          </Card>

          {/* Right Chart: 6-Pillar Radar */}
          <Card className="p-6 lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">6-Pillar Biomechanical Radar</h3>
                <p className="text-xs text-slate-400">{currentAthlete.name} vs SAI National Junior Norms</p>
              </div>
            </div>
            <PerformanceRadarChart />
          </Card>
        </div>

        {/* Personal Bests & Targets */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Current Personal Bests & Targets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Vertical Jump (PB)</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white font-mono">
                  {personalBests['vertical-jump'] ? personalBests['vertical-jump'].value : currentAthlete.keyStats.verticalJumpCm} cm
                </span>
                <Badge variant="lime" size="sm">Elite Benchmark</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Target: 70.0 cm (+1.5 cm required)
              </p>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">30m Acceleration (PB)</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white font-mono">
                  {personalBests['30m-sprint'] ? personalBests['30m-sprint'].value : currentAthlete.keyStats.sprint30mSec} s
                </span>
                <Badge variant="cyan" size="sm">Top 1.9% National</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Target: 3.75 s (0.07s improvement)
              </p>
            </Card>

            <Card className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">60s Push-ups (PB)</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-white font-mono">
                  {personalBests['pushup-endurance'] ? personalBests['pushup-endurance'].value : currentAthlete.keyStats.pushups60s} reps
                </span>
                <Badge variant="amber" size="sm">Army Camp Level</Badge>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Target: 65 reps in 60 seconds
              </p>
            </Card>
          </div>
        </div>

        {/* Test History Table with Review and Delete */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Assessment Records Ledger</h3>
                <span className="text-xs text-slate-400 font-mono">({filteredAttempts.length} sample records)</span>
              </div>
              <p className="text-xs text-slate-400">Open to review granular metrics or delete sample data</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              >
                <option value="all">All Assessments</option>
                <option value="vertical-jump">Vertical Jump</option>
                <option value="30m-sprint">30m Sprint</option>
                <option value="pushup-endurance">Push-Up Test</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
                onClick={exportAthleteResultsToCSV}
              >
                CSV
              </Button>
            </div>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No assessment attempts found for this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#070a0e] text-slate-400 font-mono uppercase border-b border-[#1f2d3d]">
                  <tr>
                    <th className="p-3.5">Assessment Name</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Result</th>
                    <th className="p-3.5">National %tile</th>
                    <th className="p-3.5">SAI Standard Tier</th>
                    <th className="p-3.5">AI Confidence</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2d3d]/50">
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-[#121924]/50 transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        {attempt.assessmentTitle}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">
                        {attempt.date}
                      </td>
                      <td className="p-3.5 font-black text-[#a3e635] font-mono">
                        {attempt.metricValue} {attempt.metricUnit}
                      </td>
                      <td className="p-3.5 font-mono text-cyan-400 font-bold">
                        {attempt.nationalPercentile}th
                      </td>
                      <td className="p-3.5">
                        <Badge variant="lime" size="sm">
                          {attempt.strideTier}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">
                        {attempt.aiPostureAccuracy}%
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setReviewAttempt(attempt)}
                            className="text-[#a3e635] hover:underline font-bold cursor-pointer"
                          >
                            Review
                          </button>
                          <Link
                            to={`/assessments/${attempt.assessmentId}/results`}
                            className="text-slate-400 hover:text-white"
                            title="Open Full Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteAttemptId(attempt.id)}
                            className="text-rose-400 hover:text-rose-300 cursor-pointer"
                            title="Delete this record"
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
          )}
        </Card>

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
                <span className="text-slate-300 font-bold block">AI Coach Feedback:</span>
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
