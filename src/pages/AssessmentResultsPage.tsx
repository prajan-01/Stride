import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  RotateCcw,
  TrendingUp,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Award,
  Zap,
  Activity,
  Compass,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { BenchmarkBarChart } from '../components/charts/BenchmarkBarChart';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';

export const AssessmentResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { attempts, assessments, currentAthlete, showToast } = useApp();

  // Find latest attempt for this test or fallback to first attempt
  const attempt =
    attempts.find((a) => a.assessmentId === id) ||
    attempts[0];

  const assessment =
    assessments.find((a) => a.id === attempt.assessmentId || a.slug === id) ||
    assessments[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Assessment result link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#a3e635] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Assessments Catalog
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="lime" size="sm">
                  {attempt.strideTier}
                </Badge>
                <span className="text-xs text-slate-400">Date: {attempt.date}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {attempt.assessmentTitle} Results
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link to={`/assessments/${assessment.slug}/instructions`}>
                <Button variant="secondary" size="sm" leftIcon={<RotateCcw className="w-4 h-4" />}>
                  Retake Test
                </Button>
              </Link>
              <Button variant="outline" size="sm" leftIcon={<Share2 className="w-4 h-4" />} onClick={handleShare}>
                Share Result
              </Button>
            </div>
          </div>
        </div>

        {/* Top Metric Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Main Measured Score */}
          <Card className="p-6 border-[#a3e635]/40 bg-gradient-to-b from-[#121a24] to-[#0e141d] shadow-[0_0_25px_-5px_rgba(163,230,53,0.15)]">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-2">
              Measured Benchmark Result
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                {attempt.metricValue}
              </span>
              <span className="text-xl font-bold text-[#a3e635] font-mono">
                {attempt.metricUnit}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#a3e635]" />
              Meets SAI National Excellence Standard
            </p>
          </Card>

          {/* National Percentile */}
          <Card className="p-6">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-2">
              National Percentile Rank
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">
                {attempt.nationalPercentile}
              </span>
              <span className="text-base text-slate-400 font-mono">th</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Better than 96.4% of junior athletes tested across India
            </p>
          </Card>

          {/* AI Landmark Tracking Accuracy */}
          <Card className="p-6">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-2">
              AI Biomechanical Pose Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                {attempt.aiPostureAccuracy}
              </span>
              <span className="text-base text-[#a3e635] font-mono">%</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              33 Landmark Keypoints • 0 invalid frame dropouts
            </p>
          </Card>
        </div>

        {/* Benchmark Bar Chart Comparison */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">SAI National Benchmarks Comparison</h3>
              <p className="text-xs text-slate-400">
                Your performance compared against junior standards established by Sports Authority of India
              </p>
            </div>
            <Badge variant="lime" size="sm">
              Current: {attempt.metricValue} {attempt.metricUnit}
            </Badge>
          </div>

          <BenchmarkBarChart
            athleteValue={attempt.metricValue}
            unit={attempt.metricUnit}
            metricName={attempt.assessmentTitle}
          />
        </Card>

        {/* Biomechanical Telemetry & AI Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Biomechanical Insights */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a3e635]" />
              Kinematic & Joint Angle Analysis
            </h3>
            <div className="space-y-3">
              {attempt.biomechanicalInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{insight.metric}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{insight.score}</span>
                  </div>
                  <Badge variant={insight.status === 'optimal' ? 'lime' : 'amber'} size="sm">
                    {insight.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Coach Feedback */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#a3e635]" />
              Automated AI Coach Recommendations
            </h3>
            <div className="space-y-3">
              {attempt.aiCoachFeedback.map((feedback, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] mt-1.5 shrink-0" />
                  <span>{feedback}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/opportunities">
                <Button variant="primary" size="md" className="w-full" rightIcon={<Compass className="w-4 h-4" />}>
                  Explore Eligible Scholarships for this Score
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <AiDisclaimerNotice />
      </div>
    </div>
  );
};
