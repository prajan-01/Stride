import React from 'react';
import { RealPoseAnalyzer } from './RealPoseAnalyzer';

interface PoseVisualizerProps {
  assessmentTitle: string;
  targetMetric: string;
  unit: string;
  onCompleteAttempt: (resultValue: number, repCount: number, postureAccuracy: number, isRealAI?: boolean) => void;
}

/**
 * PoseSkeletonVisualizer is now powered by REAL MediaPipe Pose Landmarker inference.
 * Replaces previous synthetic kinematic simulator with genuine computer vision.
 */
export const PoseSkeletonVisualizer: React.FC<PoseVisualizerProps> = ({
  assessmentTitle,
  targetMetric,
  unit,
  onCompleteAttempt,
}) => {
  return (
    <RealPoseAnalyzer
      assessmentTitle={assessmentTitle}
      targetMetric={targetMetric}
      unit={unit}
      onCompleteAttempt={(resultValue, repCount, postureAccuracy, isRealAI) =>
        onCompleteAttempt(resultValue, repCount, postureAccuracy, isRealAI)
      }
    />
  );
};
