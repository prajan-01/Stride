import { NormalizedLandmark } from '@mediapipe/tasks-vision';

// Standard MediaPipe Pose 33-landmark connection pairs
export const POSE_CONNECTIONS: [number, number][] = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  // Shoulders
  [11, 12],
  // Left arm
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  // Right arm
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // Torso
  [11, 23], [12, 24], [23, 24],
  // Left leg
  [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
  // Right leg
  [24, 26], [26, 28], [28, 30], [28, 32], [30, 32],
];

export interface RenderDimensions {
  videoWidth: number;
  videoHeight: number;
  displayWidth: number;
  displayHeight: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Calculates letterbox / pillarbox aspect ratio fitting for video inside a container
 */
export function calculateVideoRenderDimensions(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): RenderDimensions {
  const vWidth = video.videoWidth || 640;
  const vHeight = video.videoHeight || 480;
  const cWidth = canvas.width;
  const cHeight = canvas.height;

  const videoAspect = vWidth / vHeight;
  const canvasAspect = cWidth / cHeight;

  let displayWidth = cWidth;
  let displayHeight = cHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasAspect > videoAspect) {
    // Canvas is wider than video (pillarbox)
    displayHeight = cHeight;
    displayWidth = cHeight * videoAspect;
    offsetX = (cWidth - displayWidth) / 2;
  } else {
    // Canvas is taller than video (letterbox)
    displayWidth = cWidth;
    displayHeight = cWidth / videoAspect;
    offsetY = (cHeight - displayHeight) / 2;
  }

  return {
    videoWidth: vWidth,
    videoHeight: vHeight,
    displayWidth,
    displayHeight,
    offsetX,
    offsetY,
  };
}

/**
 * Clears the canvas
 */
export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Draws real MediaPipe pose landmarks and connections onto canvas
 */
export function drawPoseLandmarks(
  canvas: HTMLCanvasElement,
  landmarks: NormalizedLandmark[],
  dims: RenderDimensions,
  options?: {
    lineColor?: string;
    jointColor?: string;
    minConfidence?: number;
    highlightAngle?: {
      p1: number;
      p2: number;
      p3: number;
      angleDegrees: number;
      label: string;
    };
  }
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { displayWidth, displayHeight, offsetX, offsetY } = dims;
  const minConfidence = options?.minConfidence ?? 0.45;
  const lineColor = options?.lineColor ?? '#a3e635';
  const jointColor = options?.jointColor ?? '#ffffff';

  // Helper to convert normalized coordinate to canvas pixel
  const toPixel = (lm: NormalizedLandmark) => ({
    x: offsetX + lm.x * displayWidth,
    y: offsetY + lm.y * displayHeight,
  });

  // 1. Draw connections
  ctx.save();
  ctx.lineWidth = 3;
  ctx.strokeStyle = lineColor;
  ctx.shadowColor = 'rgba(163, 230, 53, 0.6)';
  ctx.shadowBlur = 8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  POSE_CONNECTIONS.forEach(([startIndex, endIndex]) => {
    const start = landmarks[startIndex];
    const end = landmarks[endIndex];

    if (!start || !end) return;

    // Filter unreliable landmarks
    const startConf = start.visibility ?? start.presence ?? 1;
    const endConf = end.visibility ?? end.presence ?? 1;

    if (startConf < minConfidence || endConf < minConfidence) {
      return;
    }

    const p1 = toPixel(start);
    const p2 = toPixel(end);

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  });
  ctx.restore();

  // 2. Draw landmark joint dots
  landmarks.forEach((lm, index) => {
    const conf = lm.visibility ?? lm.presence ?? 1;
    if (conf < minConfidence) return;

    const { x, y } = toPixel(lm);
    const radius = index === 0 ? 5 : 4; // Nose slightly larger

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = jointColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    ctx.restore();
  });

  // 3. Highlight joint angle if provided (e.g. hip angle for sit-ups)
  if (options?.highlightAngle) {
    const { p1: i1, p2: i2, p3: i3, angleDegrees, label } = options.highlightAngle;
    const lm1 = landmarks[i1];
    const lm2 = landmarks[i2];
    const lm3 = landmarks[i3];

    if (lm1 && lm2 && lm3) {
      const pt2 = toPixel(lm2);
      ctx.save();
      ctx.fillStyle = '#a3e635';
      ctx.font = 'bold 12px monospace';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${Math.round(angleDegrees)}° ${label}`, pt2.x + 10, pt2.y - 10);
      ctx.restore();
    }
  }
}
