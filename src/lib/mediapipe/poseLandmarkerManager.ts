import { FilesetResolver, PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision';

export type ModelStatus = 'uninitialized' | 'loading' | 'ready' | 'error';

class PoseLandmarkerManager {
  private static instance: PoseLandmarkerManager | null = null;
  private landmarker: PoseLandmarker | null = null;
  private status: ModelStatus = 'uninitialized';
  private errorMessage: string | null = null;
  private loadPromise: Promise<PoseLandmarker> | null = null;

  private constructor() {}

  public static getInstance(): PoseLandmarkerManager {
    if (!PoseLandmarkerManager.instance) {
      PoseLandmarkerManager.instance = new PoseLandmarkerManager();
    }
    return PoseLandmarkerManager.instance;
  }

  public getStatus(): ModelStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public isReady(): boolean {
    return this.status === 'ready' && this.landmarker !== null;
  }

  /**
   * Initializes the PoseLandmarker model asynchronously.
   * Tries local WASM and local model first, then falls back to CDN/storage if needed.
   * Reuses the existing model instance if already created.
   */
  public async initialize(): Promise<PoseLandmarker> {
    if (this.landmarker && this.status === 'ready') {
      return this.landmarker;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.status = 'loading';
    this.errorMessage = null;

    this.loadPromise = (async () => {
      try {
        // 1. Resolve WASM assets: try local /wasm first, fallback to CDN
        let vision: any;
        try {
          vision = await FilesetResolver.forVisionTasks('/wasm');
        } catch (localWasmErr) {
          console.warn('Local WASM fileset failed, falling back to CDN...', localWasmErr);
          vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm'
          );
        }

        // 2. Load PoseLandmarker model: try local model first, fallback to Cloud Storage
        let model: PoseLandmarker;
        try {
          model = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/pose_landmarker_lite.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1,
            minPoseDetectionConfidence: 0.35,
            minPosePresenceConfidence: 0.35,
            minTrackingConfidence: 0.35,
          });
        } catch (gpuOrLocalErr) {
          console.warn('Local/GPU model initialization error, attempting CPU fallback...', gpuOrLocalErr);
          try {
            model = await PoseLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: '/models/pose_landmarker_lite.task',
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              numPoses: 1,
              minPoseDetectionConfidence: 0.5,
              minPosePresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });
          } catch (cpuLocalErr) {
            console.warn('Local CPU model failed, falling back to Google Cloud Storage model...', cpuLocalErr);
            model = await PoseLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath:
                  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                delegate: 'CPU',
              },
              runningMode: 'VIDEO',
              numPoses: 1,
              minPoseDetectionConfidence: 0.5,
              minPosePresenceConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });
          }
        }

        this.landmarker = model;
        this.status = 'ready';
        this.errorMessage = null;
        return model;
      } catch (err: any) {
        this.status = 'error';
        const msg = err?.message || 'Failed to initialize MediaPipe Pose Landmarker model.';
        this.errorMessage = msg;
        this.loadPromise = null;
        throw new Error(msg);
      }
    })();

    return this.loadPromise;
  }

  private lastTimestampMs = 0;

  /**
   * Processes a video frame using detectForVideo.
   * Ensures timestamp is strictly monotonically increasing to satisfy MediaPipe requirements.
   */
  public detectVideoFrame(
    video: HTMLVideoElement,
    timestampMs?: number
  ): PoseLandmarkerResult | null {
    if (!this.landmarker || this.status !== 'ready') {
      return null;
    }

    const proposed = typeof timestampMs === 'number' && !isNaN(timestampMs) ? timestampMs : performance.now();
    const safeTimestamp = Math.max(Math.round(proposed), this.lastTimestampMs + 1);
    this.lastTimestampMs = safeTimestamp;

    try {
      return this.landmarker.detectForVideo(video, safeTimestamp);
    } catch (err) {
      console.warn('MediaPipe detectForVideo error on frame:', err);
      return null;
    }
  }

  /**
   * Clean up and close landmarker resources
   */
  public close(): void {
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch (e) {
        console.warn('Error closing PoseLandmarker:', e);
      }
      this.landmarker = null;
    }
    this.status = 'uninitialized';
    this.loadPromise = null;
  }
}

export const poseLandmarkerManager = PoseLandmarkerManager.getInstance();
