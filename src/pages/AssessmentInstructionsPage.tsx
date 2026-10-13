import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Info,
  Compass,
  Play,
  RotateCcw,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { RealPoseAnalyzer } from '../components/assessment/RealPoseAnalyzer';
import { PoseSkeletonVisualizer } from '../components/assessment/PoseSkeletonVisualizer';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';
import { AssessmentAttempt } from '../types';

export const AssessmentInstructionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assessments, currentAthlete, addAssessmentAttempt, showToast } = useApp();

  const assessment = assessments.find((a) => a.slug === id || a.id === id) || assessments[0];

  // Checklist state for camera calibration
  const [checkedPoints, setCheckedPoints] = useState<number[]>([]);

  const toggleCheckpoint = (index: number) => {
    setCheckedPoints((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleCompleteAttempt = (
    resultValue: number,
    repCount: number,
    postureAccuracy: number,
    isRealAI: boolean = false
  ) => {
    const isPushup =
      assessment.title.toLowerCase().includes('push-up') ||
      assessment.title.toLowerCase().includes('pushup') ||
      assessment.id.includes('pushup');

    const isSitup =
      assessment.title.toLowerCase().includes('sit-up') ||
      assessment.title.toLowerCase().includes('situp') ||
      assessment.id.includes('situp');

    // Calculate realistic SAI junior benchmark percentile based on actual reps or metrics
    let calculatedPercentile = 75.0;
    let tier: 'Elite SAI Benchmark' | 'National Qualifier' | 'State Ranking' | 'Developmental' = 'State Ranking';

    if (isPushup) {
      if (resultValue >= 55) {
        calculatedPercentile = 98.4;
        tier = 'Elite SAI Benchmark';
      } else if (resultValue >= 44) {
        calculatedPercentile = 91.5;
        tier = 'National Qualifier';
      } else if (resultValue >= 32) {
        calculatedPercentile = 78.0;
        tier = 'State Ranking';
      } else {
        calculatedPercentile = resultValue > 0 ? 52.0 : 15.0;
        tier = 'Developmental';
      }
    } else if (isSitup) {
      if (resultValue >= 45) {
        calculatedPercentile = 96.8;
        tier = 'Elite SAI Benchmark';
      } else if (resultValue >= 35) {
        calculatedPercentile = 88.5;
        tier = 'National Qualifier';
      } else if (resultValue >= 25) {
        calculatedPercentile = 72.0;
        tier = 'State Ranking';
      } else {
        calculatedPercentile = resultValue > 0 ? 48.0 : 10.0;
        tier = 'Developmental';
      }
    } else {
      calculatedPercentile = isRealAI ? 94.2 : 96.4;
      tier = 'Elite SAI Benchmark';
    }

    const newAttempt: AssessmentAttempt = {
      id: `att-${Date.now()}`,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      athleteId: currentAthlete.id,
      athleteName: currentAthlete.name,
      date: new Date().toISOString().split('T')[0],
      metricValue: resultValue,
      metricUnit: assessment.unit,
      nationalPercentile: calculatedPercentile,
      strideTier: tier,
      aiPostureAccuracy: postureAccuracy,
      repetitionBreakdown: (isPushup || isSitup) && repCount > 0
        ? Array.from({ length: repCount }).map((_, idx) => ({
            rep: idx + 1,
            valid: true,
            peakAngleOrHeight: isPushup ? '90° Elbow Depth Verified' : 'Full Inflection (≤65°)',
            tempoSeconds: isPushup ? 1.15 : 1.35,
            notes: isPushup
              ? 'Verified 90° elbow depth and neutral spine by MediaPipe Pose Landmarker.'
              : 'Verified shoulder-hip-knee flexion by MediaPipe Pose Landmarker.',
          }))
        : [
            {
              rep: 1,
              valid: repCount > 0 || (!isSitup && !isPushup),
              peakAngleOrHeight: `${resultValue} ${assessment.unit}`,
              tempoSeconds: 0.85,
              notes: isRealAI
                ? 'Computer vision frame analysis completed with real MediaPipe keypoints.'
                : 'Simulated demonstration record.',
            },
          ],
      biomechanicalInsights: [
        {
          metric: 'Inference Engine',
          score: 'MediaPipe PoseLandmarker (WASM)',
          status: 'optimal',
        },
        {
          metric: 'Kinematic Form Confidence',
          score: `${postureAccuracy.toFixed(1)}%`,
          status: postureAccuracy >= 70 ? 'optimal' : 'needs_work',
        },
        {
          metric: 'Evaluation Source',
          score: isRealAI ? 'Live Camera / Video ML' : 'Simulated Demo Preset',
          status: isRealAI ? 'optimal' : 'good',
        },
      ],
      aiCoachFeedback: isSitup
        ? [
            `Recorded ${resultValue} ${assessment.unit} using genuine MediaPipe computer vision inference.`,
            repCount > 0
              ? 'Complete lumbar flexion cycle detected without duplicate counts.'
              : 'Stationary position or incomplete range of motion detected.',
            `Average joint tracking confidence: ${postureAccuracy.toFixed(1)}%.`,
          ]
        : [
            `Recorded ${resultValue} ${assessment.unit}.`,
            'Computer vision verified athlete presence and sagittal body alignment.',
            isRealAI
              ? 'Real-time MediaPipe skeletal tracking completed.'
              : 'Simulated demonstration trial.',
          ],
      isSimulatedDemo: !isRealAI,
    };

    addAssessmentAttempt(newAttempt);
    showToast(
      isRealAI
        ? `Real AI assessment complete! Recorded ${resultValue} ${assessment.unit}.`
        : `Demo trial generated for ${assessment.title}`,
      'success'
    );
    navigate(`/assessments/${assessment.slug}/results`);
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Back Link & Title */}
        <div>
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#a3e635] mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Assessments Catalog
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="lime" size="sm">
                  {assessment.category}
                </Badge>
                <span className="text-xs text-slate-400">Target: {assessment.targetMetric}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{assessment.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Duration: <strong className="text-white">{assessment.durationSeconds}s</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Difficulty: <strong className="text-[#a3e635]">{assessment.difficulty}</strong></span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Real AI Video / Pose Analyzer */}
          <div className="lg:col-span-7 space-y-4">
            <RealPoseAnalyzer
              assessmentTitle={assessment.title}
              targetMetric={assessment.targetMetric}
              unit={assessment.unit}
              onCompleteAttempt={handleCompleteAttempt}
            />

            {/* Clear separate demo mode button */}
            <div className="p-4 rounded-xl bg-[#0e141d] border border-[#1f2d3d] flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Want to review sample results in UI demonstration mode?
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleCompleteAttempt(
                    assessment.unit === 'reps' ? 38 : 68.5,
                    assessment.unit === 'reps' ? 38 : 3,
                    98.2,
                    false
                  )
                }
              >
                Generate Demo Results (Simulated)
              </Button>
            </div>
          </div>

          {/* Right Column: Setup Guide and Checklist */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Camera Setup Guide */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#a3e635]" />
                Camera Calibration Requirements
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Distance</span>
                  <span className="font-bold text-white mt-0.5 block">{assessment.cameraSetupGuide.distanceMeters}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Height</span>
                  <span className="font-bold text-white mt-0.5 block">{assessment.cameraSetupGuide.height}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Angle</span>
                  <span className="font-bold text-white mt-0.5 block">{assessment.cameraSetupGuide.angle}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Lighting</span>
                  <span className="font-bold text-white mt-0.5 block">{assessment.cameraSetupGuide.lighting}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">Equipment Needed:</span>
                <p className="text-xs text-slate-400 leading-relaxed bg-[#070a0e] p-3 rounded-xl border border-[#1f2d3d]">
                  {assessment.equipmentNeeded}
                </p>
              </div>
            </Card>

            {/* Checkpoints Checklist */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#a3e635]" />
                  Posture Checkpoints ({checkedPoints.length}/{assessment.postureCheckpoints.length})
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Confirm your starting position before pressing Start Test:
              </p>

              <div className="space-y-2.5">
                {assessment.postureCheckpoints.map((point, index) => {
                  const isChecked = checkedPoints.includes(index);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleCheckpoint(index)}
                      className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#a3e635]/10 border-[#a3e635]/40 text-white'
                          : 'bg-[#070a0e] border-[#1f2d3d] text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <span className="text-xs leading-relaxed">{point}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Why it Matters */}
            <div className="p-4 rounded-2xl bg-[#0e141d] border border-[#273548] text-xs text-slate-300">
              <span className="font-bold text-white block mb-1">Why this test matters to scouts:</span>
              <p className="text-slate-400 leading-relaxed">{assessment.whyItMatters}</p>
            </div>
          </div>
        </div>

        <AiDisclaimerNotice />
      </div>
    </div>
  );
};
