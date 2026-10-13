import { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type SitupPhase = 'DOWN' | 'ASCENDING' | 'UP' | 'DESCENDING' | 'UNTRACKED';

export interface SitupRepRecord {
  repNumber: number;
  durationMs: number;
  peakAngle: number;
  timestampMs: number;
}

export interface SitupAnalysisResult {
  repCount: number;
  phase: SitupPhase;
  currentAngle: number;
  activeSide: 'left' | 'right' | 'none';
  isTrackingValid: boolean;
  feedback: string;
  repHistory: SitupRepRecord[];
}

export class SitupCounter {
  private repCount = 0;
  private phase: SitupPhase = 'UNTRACKED';
  private lastPhaseChangeTime = 0;
  private lastRepCompleteTime = 0;
  private repStartTime = 0;
  private minAngleInCurrentRep = 180;
  private repHistory: SitupRepRecord[] = [];

  // Minimum landmark visibility to consider pose reliable
  private readonly MIN_CONFIDENCE = 0.45;

  // Angular thresholds (degrees between shoulder - hip - knee)
  // Lying flat / start: angle >= 110°
  // Full situp up position: angle <= 65°
  private readonly ANGLE_DOWN_THRESHOLD = 110;
  private readonly ANGLE_ASCENT_TRIGGER = 95;
  private readonly ANGLE_UP_THRESHOLD = 65;
  private readonly ANGLE_DESCENT_TRIGGER = 80;

  // Debounce to prevent duplicate counting (at least 600ms between full reps)
  private readonly MIN_REP_DURATION_MS = 600;

  public reset(): void {
    this.repCount = 0;
    this.phase = 'UNTRACKED';
    this.lastPhaseChangeTime = 0;
    this.lastRepCompleteTime = 0;
    this.repStartTime = 0;
    this.minAngleInCurrentRep = 180;
    this.repHistory = [];
  }

  /**
   * Calculates angle at vertex B formed by line segments AB and BC
   */
  public calculateAngle(
    a: { x: number; y: number },
    b: { x: number; y: number },
    c: { x: number; y: number }
  ): number {
    const ab = { x: a.x - b.x, y: a.y - b.y };
    const cb = { x: c.x - b.x, y: c.y - b.y };

    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.hypot(ab.x, ab.y);
    const magCB = Math.hypot(cb.x, cb.y);

    if (magAB === 0 || magCB === 0) return 0;

    const cosTheta = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
    return (Math.acos(cosTheta) * 180) / Math.PI;
  }

  /**
   * Processes a single frame of MediaPipe landmarks
   */
  public processFrame(
    landmarks: NormalizedLandmark[],
    timestampMs: number
  ): SitupAnalysisResult {
    if (!landmarks || landmarks.length < 27) {
      this.phase = 'UNTRACKED';
      return {
        repCount: this.repCount,
        phase: 'UNTRACKED',
        currentAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'No full body detected. Step into frame so shoulder, hip, and knee are visible.',
        repHistory: this.repHistory,
      };
    }

    // MediaPipe landmark indices:
    // Left side: 11 (shoulder), 23 (hip), 25 (knee)
    // Right side: 12 (shoulder), 24 (hip), 26 (knee)
    const lShoulder = landmarks[11];
    const lHip = landmarks[23];
    const lKnee = landmarks[25];

    const rShoulder = landmarks[12];
    const rHip = landmarks[24];
    const rKnee = landmarks[26];

    const lConf = ((lShoulder.visibility ?? 1) + (lHip.visibility ?? 1) + (lKnee.visibility ?? 1)) / 3;
    const rConf = ((rShoulder.visibility ?? 1) + (rHip.visibility ?? 1) + (rKnee.visibility ?? 1)) / 3;

    let shoulder = lShoulder;
    let hip = lHip;
    let knee = lKnee;
    let activeSide: 'left' | 'right' = 'left';
    let avgConf = lConf;

    if (rConf > lConf) {
      shoulder = rShoulder;
      hip = rHip;
      knee = rKnee;
      activeSide = 'right';
      avgConf = rConf;
    }

    // Check confidence
    if (avgConf < this.MIN_CONFIDENCE) {
      return {
        repCount: this.repCount,
        phase: this.phase,
        currentAngle: 0,
        activeSide,
        isTrackingValid: false,
        feedback: 'Low joint tracking confidence. Ensure side-on profile view with good lighting.',
        repHistory: this.repHistory,
      };
    }

    // Calculate trunk-to-thigh angle at hip vertex
    const angle = this.calculateAngle(shoulder, hip, knee);

    let feedback = '';

    // State machine updates
    switch (this.phase) {
      case 'UNTRACKED':
        if (angle >= this.ANGLE_DOWN_THRESHOLD) {
          this.phase = 'DOWN';
          feedback = 'Ready in starting position. Begin sit-up.';
        } else {
          feedback = 'Lie back flat to begin in starting position (Hip angle > 110°).';
        }
        break;

      case 'DOWN':
        this.minAngleInCurrentRep = angle;
        if (angle < this.ANGLE_ASCENT_TRIGGER) {
          this.phase = 'ASCENDING';
          this.repStartTime = timestampMs;
          this.lastPhaseChangeTime = timestampMs;
          feedback = 'Ascending: Curl torso up towards knees.';
        } else {
          feedback = 'In starting position. Curl up.';
        }
        break;

      case 'ASCENDING':
        if (angle < this.minAngleInCurrentRep) {
          this.minAngleInCurrentRep = angle;
        }

        if (angle <= this.ANGLE_UP_THRESHOLD) {
          this.phase = 'UP';
          this.lastPhaseChangeTime = timestampMs;
          feedback = 'Full inflection reached! Now lower torso back down.';
        } else if (angle > this.ANGLE_DOWN_THRESHOLD) {
          // Incomplete rep, returned down without reaching top
          this.phase = 'DOWN';
          feedback = 'Incomplete rep: Reach chest closer to knees (angle ≤ 65°).';
        } else {
          feedback = `Ascending: ${Math.round(angle)}° (Goal: ≤ 65°)`;
        }
        break;

      case 'UP':
        if (angle < this.minAngleInCurrentRep) {
          this.minAngleInCurrentRep = angle;
        }

        if (angle > this.ANGLE_DESCENT_TRIGGER) {
          this.phase = 'DESCENDING';
          this.lastPhaseChangeTime = timestampMs;
          feedback = 'Lowering torso back down to ground.';
        } else {
          feedback = 'Hold briefly, then lower back down.';
        }
        break;

      case 'DESCENDING':
        if (angle >= this.ANGLE_DOWN_THRESHOLD) {
          // Rep cycle completed: DOWN -> ASCENDING -> UP -> DESCENDING -> DOWN
          const repDuration = timestampMs - this.repStartTime;
          const timeSinceLastRep = timestampMs - this.lastRepCompleteTime;

          if (repDuration >= this.MIN_REP_DURATION_MS && timeSinceLastRep >= this.MIN_REP_DURATION_MS) {
            this.repCount += 1;
            this.lastRepCompleteTime = timestampMs;
            this.repHistory.push({
              repNumber: this.repCount,
              durationMs: repDuration,
              peakAngle: Math.round(this.minAngleInCurrentRep),
              timestampMs,
            });
            feedback = `Repetition #${this.repCount} complete! Clean form.`;
          }

          this.phase = 'DOWN';
          this.lastPhaseChangeTime = timestampMs;
        } else if (angle <= this.ANGLE_UP_THRESHOLD) {
          // Bounced back up without touching down
          this.phase = 'UP';
          feedback = 'Must return all the way down before next rep!';
        } else {
          feedback = `Lowering: ${Math.round(angle)}° (Goal: ≥ 110°)`;
        }
        break;
    }

    return {
      repCount: this.repCount,
      phase: this.phase,
      currentAngle: Math.round(angle),
      activeSide,
      isTrackingValid: true,
      feedback,
      repHistory: this.repHistory,
    };
  }

  public getRepCount(): number {
    return this.repCount;
  }

  public getRepHistory(): SitupRepRecord[] {
    return this.repHistory;
  }
}

export const defaultSitupCounter = new SitupCounter();
