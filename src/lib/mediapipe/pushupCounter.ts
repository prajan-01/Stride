import { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type PushupPhase = 'UP' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING' | 'UNTRACKED';

export interface PushupRepRecord {
  repNumber: number;
  durationMs: number;
  peakAngle: number; // lowest elbow angle reached (depth)
  timestampMs: number;
  spineAngle: number;
}

export interface PushupAnalysisResult {
  repCount: number;
  phase: PushupPhase;
  currentElbowAngle: number;
  currentSpineAngle: number;
  activeSide: 'left' | 'right' | 'none';
  isTrackingValid: boolean;
  feedback: string;
  repHistory: PushupRepRecord[];
}

export class PushupCounter {
  private repCount = 0;
  private phase: PushupPhase = 'UNTRACKED';
  private lastPhaseChangeTime = 0;
  private lastRepCompleteTime = 0;
  private repStartTime = 0;
  private minAngleInCurrentRep = 180;
  private repHistory: PushupRepRecord[] = [];

  // Minimum landmark visibility to consider pose reliable
  private readonly MIN_CONFIDENCE = 0.40;

  // Angular thresholds (degrees at elbow vertex: Shoulder - Elbow - Wrist)
  // Top / Lockout position: elbow angle >= 135°
  // Descent trigger: elbow angle < 125°
  // Bottom depth position (SAI 90° norm with perspective margin): elbow angle <= 98°
  // Ascent trigger: elbow angle > 108°
  private readonly ANGLE_TOP_THRESHOLD = 135;
  private readonly ANGLE_DESCENT_TRIGGER = 125;
  private readonly ANGLE_BOTTOM_THRESHOLD = 98;
  private readonly ANGLE_ASCENT_TRIGGER = 108;

  // Minimum rep duration in ms to prevent noise / jitter double counting
  private readonly MIN_REP_DURATION_MS = 400;
  private readonly MIN_INTERVAL_BETWEEN_REPS = 350;

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
   * Processes a single frame of MediaPipe landmarks for Push-Up tracking
   */
  public processFrame(
    landmarks: NormalizedLandmark[],
    timestampMs: number
  ): PushupAnalysisResult {
    if (!landmarks || landmarks.length < 27) {
      this.phase = 'UNTRACKED';
      return {
        repCount: this.repCount,
        phase: 'UNTRACKED',
        currentElbowAngle: 0,
        currentSpineAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'No full upper body detected. Ensure shoulder, elbow, and wrist are in camera frame.',
        repHistory: this.repHistory,
      };
    }

    // MediaPipe landmark indices:
    // Shoulders: Left 11, Right 12
    // Elbows:    Left 13, Right 14
    // Wrists:    Left 15, Right 16
    // Hips:      Left 23, Right 24
    // Knees:     Left 25, Right 26
    // Ankles:    Left 27, Right 28
    const lShoulder = landmarks[11];
    const lElbow = landmarks[13];
    const lWrist = landmarks[15];
    const lHip = landmarks[23];
    const lKnee = landmarks[25];
    const lAnkle = landmarks[27];

    const rShoulder = landmarks[12];
    const rElbow = landmarks[14];
    const rWrist = landmarks[16];
    const rHip = landmarks[24];
    const rKnee = landmarks[26];
    const rAnkle = landmarks[28];

    // Compute arm visibility confidences
    const lConf = ((lShoulder.visibility ?? 1) + (lElbow.visibility ?? 1) + (lWrist.visibility ?? 1)) / 3;
    const rConf = ((rShoulder.visibility ?? 1) + (rElbow.visibility ?? 1) + (rWrist.visibility ?? 1)) / 3;

    let shoulder = lShoulder;
    let elbow = lElbow;
    let wrist = lWrist;
    let hip = lHip;
    let lowerBody = (lAnkle?.visibility ?? 0) > 0.4 ? lAnkle : lKnee;
    let activeSide: 'left' | 'right' = 'left';
    let avgConf = lConf;

    if (rConf > lConf) {
      shoulder = rShoulder;
      elbow = rElbow;
      wrist = rWrist;
      hip = rHip;
      lowerBody = (rAnkle?.visibility ?? 0) > 0.4 ? rAnkle : rKnee;
      activeSide = 'right';
      avgConf = rConf;
    }

    // Verify minimum confidence threshold
    if (avgConf < this.MIN_CONFIDENCE) {
      return {
        repCount: this.repCount,
        phase: this.phase,
        currentElbowAngle: 0,
        currentSpineAngle: 0,
        activeSide,
        isTrackingValid: false,
        feedback: 'Low joint tracking confidence. Ensure side or 45° profile view with good lighting.',
        repHistory: this.repHistory,
      };
    }

    // Calculate elbow flexion angle (Shoulder - Elbow - Wrist)
    const elbowAngle = this.calculateAngle(shoulder, elbow, wrist);

    // Calculate torso-spine alignment angle (Shoulder - Hip - LowerBody)
    const spineAngle = this.calculateAngle(shoulder, hip, lowerBody);

    let feedback = '';

    // State machine updates
    switch (this.phase) {
      case 'UNTRACKED':
        this.minAngleInCurrentRep = elbowAngle;
        if (elbowAngle >= this.ANGLE_TOP_THRESHOLD) {
          this.phase = 'UP';
          feedback = 'In starting position. Lower chest towards the floor.';
        } else if (elbowAngle <= this.ANGLE_BOTTOM_THRESHOLD) {
          this.phase = 'BOTTOM';
          feedback = 'Bottom position detected. Push back up to full extension.';
        } else {
          this.phase = 'DESCENDING';
          this.repStartTime = timestampMs;
          feedback = 'Descending: Lower chest until elbow bends to 90°.';
        }
        break;

      case 'UP':
        this.minAngleInCurrentRep = elbowAngle;
        if (elbowAngle < this.ANGLE_DESCENT_TRIGGER) {
          this.phase = 'DESCENDING';
          this.repStartTime = timestampMs;
          this.lastPhaseChangeTime = timestampMs;
          feedback = 'Descending: Lower chest towards 90° elbow depth.';
        } else {
          feedback = 'In starting position. Lower chest towards floor.';
        }
        break;

      case 'DESCENDING':
        if (elbowAngle < this.minAngleInCurrentRep) {
          this.minAngleInCurrentRep = elbowAngle;
        }

        if (elbowAngle <= this.ANGLE_BOTTOM_THRESHOLD) {
          this.phase = 'BOTTOM';
          this.lastPhaseChangeTime = timestampMs;
          feedback = 'Full depth reached (≤ 90°)! Push back up to lockout.';
        } else if (elbowAngle >= this.ANGLE_TOP_THRESHOLD) {
          // Incomplete rep, returned up without reaching bottom depth
          this.phase = 'UP';
          feedback = 'Incomplete rep: Lower chest deeper until elbows bend to 90°.';
        } else {
          feedback = `Descending: ${Math.round(elbowAngle)}° (Target: ≤ 90°)`;
        }
        break;

      case 'BOTTOM':
        if (elbowAngle < this.minAngleInCurrentRep) {
          this.minAngleInCurrentRep = elbowAngle;
        }

        if (elbowAngle > this.ANGLE_ASCENT_TRIGGER) {
          this.phase = 'ASCENDING';
          this.lastPhaseChangeTime = timestampMs;
          feedback = 'Ascending: Push through palms to full arm lockout.';
        } else {
          feedback = 'Solid depth! Push back up.';
        }
        break;

      case 'ASCENDING':
        if (elbowAngle >= this.ANGLE_TOP_THRESHOLD) {
          // Rep completed: UP -> DESCENDING -> BOTTOM -> ASCENDING -> UP
          const repDuration = timestampMs - this.repStartTime;
          const timeSinceLastRep = timestampMs - this.lastRepCompleteTime;

          if (repDuration >= this.MIN_REP_DURATION_MS && timeSinceLastRep >= this.MIN_INTERVAL_BETWEEN_REPS) {
            this.repCount += 1;
            this.lastRepCompleteTime = timestampMs;
            this.repHistory.push({
              repNumber: this.repCount,
              durationMs: repDuration,
              peakAngle: Math.round(this.minAngleInCurrentRep),
              timestampMs,
              spineAngle: Math.round(spineAngle),
            });
            feedback = `Repetition #${this.repCount} complete! Solid form.`;
          }

          this.phase = 'UP';
          this.lastPhaseChangeTime = timestampMs;
        } else if (elbowAngle <= this.ANGLE_BOTTOM_THRESHOLD) {
          // Dipped back down without reaching top lockout
          this.phase = 'BOTTOM';
          feedback = 'Must push all the way up to lockout before next rep!';
        } else {
          feedback = `Ascending: ${Math.round(elbowAngle)}° (Lockout: ≥ 135°)`;
        }
        break;
    }

    // Optional posture feedback if spine is sagging or piking significantly
    if (spineAngle > 0 && spineAngle < 135) {
      feedback = `${feedback} (Tip: Maintain neutral straight spine)`;
    }

    return {
      repCount: this.repCount,
      phase: this.phase,
      currentElbowAngle: Math.round(elbowAngle),
      currentSpineAngle: Math.round(spineAngle),
      activeSide,
      isTrackingValid: true,
      feedback,
      repHistory: this.repHistory,
    };
  }

  public getRepCount(): number {
    return this.repCount;
  }

  public getRepHistory(): PushupRepRecord[] {
    return this.repHistory;
  }
}

export const defaultPushupCounter = new PushupCounter();
