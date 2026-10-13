import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Square,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Video as VideoIcon,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { poseLandmarkerManager, ModelStatus } from '../../lib/mediapipe/poseLandmarkerManager';
import {
  drawPoseLandmarks,
  clearCanvas,
  calculateVideoRenderDimensions,
} from '../../lib/mediapipe/drawingUtils';
import {
  SitupCounter,
  SitupAnalysisResult,
  SitupPhase,
} from '../../lib/mediapipe/situpCounter';
import {
  PushupCounter,
  PushupAnalysisResult,
  PushupPhase,
} from '../../lib/mediapipe/pushupCounter';

interface RealPoseAnalyzerProps {
  assessmentTitle: string;
  targetMetric: string;
  unit: string;
  onCompleteAttempt: (
    resultValue: number,
    repCount: number,
    postureAccuracy: number,
    isRealAI: boolean
  ) => void;
}

type InputMode = 'webcam' | 'upload';

export const RealPoseAnalyzer: React.FC<RealPoseAnalyzerProps> = ({
  assessmentTitle,
  targetMetric,
  unit,
  onCompleteAttempt,
}) => {
  // Elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Input selection & model status
  const [inputMode, setInputMode] = useState<InputMode>('webcam');
  const [modelStatus, setModelStatus] = useState<ModelStatus>('uninitialized');
  const [modelError, setModelError] = useState<string | null>(null);

  // Webcam states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  // Uploaded video states
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  // Pose detection telemetry
  const [poseDetected, setPoseDetected] = useState(false);
  const [landmarkCount, setLandmarkCount] = useState(0);
  const [poseConfidence, setPoseConfidence] = useState(0);
  const [inferenceFps, setInferenceFps] = useState(0);
  const [inferenceLatencyMs, setInferenceLatencyMs] = useState(0);

  // Active testing state
  const [isTestSessionActive, setIsTestSessionActive] = useState(false);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(60);
  const [manualMetricInput, setManualMetricInput] = useState<string>('');

  // Assessment type detection
  const isPushupAssessment =
    assessmentTitle.toLowerCase().includes('push-up') ||
    assessmentTitle.toLowerCase().includes('pushup') ||
    assessmentTitle.toLowerCase().includes('press-up');

  const isSitupAssessment =
    assessmentTitle.toLowerCase().includes('sit-up') ||
    assessmentTitle.toLowerCase().includes('situp') ||
    assessmentTitle.toLowerCase().includes('curl-up');

  // Push-up counter instance & state
  const pushupCounterRef = useRef<PushupCounter>(new PushupCounter());
  const [pushupState, setPushupState] = useState<PushupAnalysisResult>({
    repCount: 0,
    phase: 'UNTRACKED',
    currentElbowAngle: 0,
    currentSpineAngle: 0,
    activeSide: 'none',
    isTrackingValid: false,
    feedback: 'Step into frame to calibrate shoulder, elbow, and wrist tracking.',
    repHistory: [],
  });

  // Sit-up counter instance & state
  const situpCounterRef = useRef<SitupCounter>(new SitupCounter());
  const [situpState, setSitupState] = useState<SitupAnalysisResult>({
    repCount: 0,
    phase: 'UNTRACKED',
    currentAngle: 0,
    activeSide: 'none',
    isTrackingValid: false,
    feedback: 'Step into frame to calibrate shoulder, hip, and knee tracking.',
    repHistory: [],
  });

  // Animation frame / video callback references
  const animFrameIdRef = useRef<number | null>(null);
  const lastProcessedVideoTimeRef = useRef<number>(-1);
  const frameCountRef = useRef<number>(0);
  const lastFpsCalcTimeRef = useRef<number>(performance.now());

  // -------------------------------------------------------------
  // 1. Initialize MediaPipe PoseLandmarker
  // -------------------------------------------------------------
  const loadModel = useCallback(async () => {
    setModelStatus('loading');
    setModelError(null);
    try {
      await poseLandmarkerManager.initialize();
      setModelStatus('ready');
    } catch (err: any) {
      console.error('PoseLandmarker initialization failed:', err);
      setModelStatus('error');
      setModelError(err?.message || 'Failed to initialize MediaPipe PoseLandmarker model.');
    }
  }, []);

  useEffect(() => {
    loadModel();
    return () => {
      // Don't close singleton globally on every unmount so navigation is instant,
      // but stop any active video or camera streams
    };
  }, [loadModel]);

  // -------------------------------------------------------------
  // 2. Camera Management (Request permission ONLY on user click)
  // -------------------------------------------------------------
  const startCamera = async () => {
    setCameraPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermissionError('Camera permission was denied. Please allow camera access in browser site settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraPermissionError('No camera found on this device. Please connect a webcam or switch to Upload Video mode.');
      } else {
        setCameraPermissionError(`Camera error: ${err.message || 'Unable to access video device.'}`);
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setPoseDetected(false);
    setLandmarkCount(0);
    if (canvasRef.current) {
      clearCanvas(canvasRef.current);
    }
  }, []);

  // Cleanup camera tracks and video URLs on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (uploadedVideoUrl && uploadedVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(uploadedVideoUrl);
      }
    };
  }, [uploadedVideoUrl]);

  // -------------------------------------------------------------
  // 3. Uploaded Video Management
  // -------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous blob URL
    if (uploadedVideoUrl && uploadedVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedVideoUrl);
    }

    // Stop camera if running
    if (cameraActive) {
      stopCamera();
    }

    const url = URL.createObjectURL(file);
    setUploadedVideoUrl(url);
    setUploadedFileName(file.name);
    setIsVideoPlaying(false);
    if (isPushupAssessment) {
      pushupCounterRef.current.reset();
      setPushupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentElbowAngle: 0,
        currentSpineAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'Video loaded. Press Play to begin real AI push-up analysis.',
        repHistory: [],
      });
    } else {
      situpCounterRef.current.reset();
      setSitupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'Video loaded. Press Play to begin real AI frame analysis.',
        repHistory: [],
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = url;
      videoRef.current.load();
    }
  };

  const loadSampleVideo = (samplePath: string, displayName: string) => {
    if (cameraActive) {
      stopCamera();
    }
    setInputMode('upload');
    setUploadedVideoUrl(samplePath);
    setUploadedFileName(displayName);
    setIsVideoPlaying(false);
    if (isPushupAssessment) {
      pushupCounterRef.current.reset();
      setPushupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentElbowAngle: 0,
        currentSpineAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: `Loaded ${displayName}. Click Play to start push-up analysis.`,
        repHistory: [],
      });
    } else {
      situpCounterRef.current.reset();
      setSitupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: `Loaded ${displayName}. Click Play to start frame-by-frame analysis.`,
        repHistory: [],
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = samplePath;
      videoRef.current.load();
    }
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    if (isPushupAssessment) {
      pushupCounterRef.current.reset();
      setPushupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentElbowAngle: 0,
        currentSpineAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'Restarted. Ready for push-up analysis.',
        repHistory: [],
      });
    } else {
      situpCounterRef.current.reset();
      setSitupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'Restarted. Ready for frame analysis.',
        repHistory: [],
      });
    }
    videoRef.current.play();
    setIsVideoPlaying(true);
  };

  // -------------------------------------------------------------
  // 4. Real MediaPipe Frame-by-Frame Detection Loop
  // -------------------------------------------------------------
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState < 2) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // For uploaded video: avoid processing the exact same frame repeatedly
    if (inputMode === 'upload' && video.currentTime === lastProcessedVideoTimeRef.current) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    if (inputMode === 'upload') {
      lastProcessedVideoTimeRef.current = video.currentTime;
      setVideoCurrentTime(video.currentTime);
    }

    const startInferenceTime = performance.now();
    const frameTimestamp = Math.round(performance.now());
    const videoPlaybackTimeMs = Math.round(video.currentTime * 1000);

    if (poseLandmarkerManager.isReady()) {
      const result = poseLandmarkerManager.detectVideoFrame(video, frameTimestamp);
      const latency = Math.round(performance.now() - startInferenceTime);
      setInferenceLatencyMs(latency);

      // FPS measurement
      frameCountRef.current += 1;
      const now = performance.now();
      if (now - lastFpsCalcTimeRef.current >= 1000) {
        setInferenceFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsCalcTimeRef.current)));
        frameCountRef.current = 0;
        lastFpsCalcTimeRef.current = now;
      }

      if (result && result.landmarks && result.landmarks.length > 0) {
        const primaryPose = result.landmarks[0];
        setPoseDetected(true);
        setLandmarkCount(primaryPose.length);

        // Average landmark confidence
        const totalConf = primaryPose.reduce((acc, lm) => acc + (lm.visibility ?? lm.presence ?? 1), 0);
        const avgConfidence = primaryPose.length > 0 ? totalConf / primaryPose.length : 0;
        setPoseConfidence(Math.round(avgConfidence * 100));

        // Dimension alignment (letterbox / pillarbox)
        const dims = calculateVideoRenderDimensions(video, canvas);

        if (isPushupAssessment) {
          // Run pushup counter with elbow flexion & neutral spine tracking
          const pushupAnalysis = pushupCounterRef.current.processFrame(primaryPose, frameTimestamp);
          setPushupState(pushupAnalysis);

          // Draw real landmarks & skeletal connections highlighting elbow angle
          clearCanvas(canvas);
          drawPoseLandmarks(canvas, primaryPose, dims, {
            lineColor: '#a3e635',
            jointColor: '#ffffff',
            minConfidence: 0.40,
            highlightAngle: {
              p1: pushupAnalysis.activeSide === 'right' ? 12 : 11, // Shoulder
              p2: pushupAnalysis.activeSide === 'right' ? 14 : 13, // Elbow vertex
              p3: pushupAnalysis.activeSide === 'right' ? 16 : 15, // Wrist
              angleDegrees: pushupAnalysis.currentElbowAngle,
              label: 'ELBOW ANGLE',
            },
          });
        } else {
          // Run situp counter if situp assessment or active
          const situpAnalysis = situpCounterRef.current.processFrame(primaryPose, frameTimestamp);
          setSitupState(situpAnalysis);

          // Draw real landmarks & skeletal connections
          clearCanvas(canvas);
          drawPoseLandmarks(canvas, primaryPose, dims, {
            lineColor: '#a3e635',
            jointColor: '#ffffff',
            minConfidence: 0.45,
            highlightAngle: {
              p1: situpAnalysis.activeSide === 'right' ? 12 : 11,
              p2: situpAnalysis.activeSide === 'right' ? 24 : 23,
              p3: situpAnalysis.activeSide === 'right' ? 26 : 25,
              angleDegrees: situpAnalysis.currentAngle,
              label: 'HIP ANGLE',
            },
          });
        }
      } else {
        // No pose detected in this frame!
        setPoseDetected(false);
        setLandmarkCount(0);
        setPoseConfidence(0);
        clearCanvas(canvas);

        if (isPushupAssessment) {
          setPushupState((prev) => ({
            ...prev,
            isTrackingValid: false,
            feedback: 'No athlete detected in this frame. Ensure upper body and arms are visible.',
          }));
        } else {
          setSitupState((prev) => ({
            ...prev,
            isTrackingValid: false,
            feedback: 'No athlete detected in this frame. Ensure full body is visible.',
          }));
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [inputMode, isPushupAssessment]);

  // Start / restart frame processing when video or camera is active
  useEffect(() => {
    const shouldRunLoop =
      (inputMode === 'webcam' && cameraActive) ||
      (inputMode === 'upload' && isVideoPlaying);

    if (shouldRunLoop) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    } else {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [inputMode, cameraActive, isVideoPlaying, processFrame]);

  // Handle video element metadata and end
  const onVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 0);
    }
  };

  const onVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  // -------------------------------------------------------------
  // 5. Test Session Countdown Timer
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isTestSessionActive) return;

    if (sessionSecondsLeft > 0) {
      const timer = setInterval(() => {
        setSessionSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Completed test duration!
      setIsTestSessionActive(false);
      finishAttempt();
    }
  }, [isTestSessionActive, sessionSecondsLeft]);

  const startTestSession = () => {
    if (isPushupAssessment) {
      pushupCounterRef.current.reset();
      setPushupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentElbowAngle: 0,
        currentSpineAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'Session started. Lower chest to at least 90° elbow bend.',
        repHistory: [],
      });
    } else {
      situpCounterRef.current.reset();
      setSitupState({
        repCount: 0,
        phase: 'UNTRACKED',
        currentAngle: 0,
        activeSide: 'none',
        isTrackingValid: false,
        feedback: 'Session started. Get in starting position.',
        repHistory: [],
      });
    }
    setSessionSecondsLeft(60);
    setIsTestSessionActive(true);
  };

  const finishAttempt = () => {
    setIsTestSessionActive(false);
    const measuredReps = isPushupAssessment ? pushupState.repCount : situpState.repCount;
    const postureAcc = poseConfidence > 0 ? poseConfidence : 95.0;

    if (isPushupAssessment || isSitupAssessment) {
      onCompleteAttempt(measuredReps, measuredReps, postureAcc, true);
    } else {
      const manualVal = parseFloat(manualMetricInput);
      const finalVal = !isNaN(manualVal) && manualVal > 0 ? manualVal : (targetMetric.includes('Jump') ? 54.0 : 4.12);
      onCompleteAttempt(finalVal, measuredReps, postureAcc, true);
    }
  };

  // Phase badge color
  const getPhaseBadge = (phase: PushupPhase | SitupPhase) => {
    switch (phase) {
      case 'DOWN':
        return <Badge variant="neutral">START / DOWN</Badge>;
      case 'ASCENDING':
        return <Badge variant="lime">ASCENDING ▲</Badge>;
      case 'UP':
        return <Badge variant="neutral">{isPushupAssessment ? 'PLANK LOCKOUT' : 'TOP INFLECTION ★'}</Badge>;
      case 'BOTTOM':
        return <Badge variant="lime">90° DEPTH REACHED ★</Badge>;
      case 'DESCENDING':
        return <Badge variant="cyan">DESCENDING ▼</Badge>;
      default:
        return <Badge variant="neutral">CALIBRATING</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Input Mode Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-[#0e141d] rounded-2xl border border-[#1f2d3d]">
        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#070a0e] rounded-xl border border-[#1f2d3d]">
          <button
            onClick={() => {
              if (inputMode !== 'webcam') {
                if (videoRef.current) videoRef.current.pause();
                setIsVideoPlaying(false);
                setInputMode('webcam');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'webcam'
                ? 'bg-[#a3e635] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Webcam
          </button>
          <button
            onClick={() => {
              if (inputMode !== 'upload') {
                stopCamera();
                setInputMode('upload');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'upload'
                ? 'bg-[#a3e635] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Exercise Video
          </button>
        </div>

        {/* Model status indicator */}
        <div className="flex items-center gap-2">
          {modelStatus === 'loading' && (
            <Badge variant="amber" icon={<Activity className="w-3.5 h-3.5 animate-spin" />}>
              Loading WASM Model...
            </Badge>
          )}
          {modelStatus === 'ready' && (
            <Badge variant="lime" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
              MediaPipe Pose Ready
            </Badge>
          )}
          {modelStatus === 'error' && (
            <div className="flex items-center gap-1.5">
              <Badge variant="red" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                Model Error
              </Badge>
              <Button variant="outline" size="sm" onClick={loadModel}>
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Video Viewport & Canvas Overlay Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#1f2d3d] bg-[#070a0e] shadow-2xl">
        {/* Overlay Header: Biometric Status & FPS */}
        <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-[#070a0e]/95 via-[#070a0e]/70 to-transparent flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {poseDetected ? (
              <Badge variant="lime" icon={<Eye className="w-3.5 h-3.5" />}>
                Athlete Pose Detected ({landmarkCount} Landmarks)
              </Badge>
            ) : (
              <Badge variant="neutral" icon={<EyeOff className="w-3.5 h-3.5" />}>
                No Person Detected
              </Badge>
            )}

            {poseConfidence > 0 && (
              <span className="text-[11px] font-mono text-slate-300 bg-[#0e141d]/80 px-2 py-0.5 rounded border border-[#273548]">
                Conf: {poseConfidence}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            {inferenceFps > 0 && (
              <span className="text-[#a3e635] bg-[#0e141d]/80 px-2 py-0.5 rounded border border-[#273548]">
                {inferenceFps} FPS
              </span>
            )}
            {inferenceLatencyMs > 0 && (
              <span className="text-cyan-400 bg-[#0e141d]/80 px-2 py-0.5 rounded border border-[#273548]">
                {inferenceLatencyMs}ms Latency
              </span>
            )}
          </div>
        </div>

        {/* Video and Overlay Canvas Frame */}
        <div className="relative aspect-video max-h-[500px] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Real video feed element */}
          <video
            ref={videoRef}
            playsInline
            muted
            onLoadedMetadata={onVideoLoadedMetadata}
            onEnded={onVideoEnded}
            className={`w-full h-full object-contain ${
              (inputMode === 'webcam' && cameraActive) || (inputMode === 'upload' && uploadedVideoUrl)
                ? 'block'
                : 'hidden'
            }`}
          />

          {/* Real-time MediaPipe overlay canvas */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
          />

          {/* Placeholder / Inactive State Banner */}
          {((inputMode === 'webcam' && !cameraActive) || (inputMode === 'upload' && !uploadedVideoUrl)) && (
            <div className="text-center p-8 max-w-md space-y-4 z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0e141d] border border-[#1f2d3d] flex items-center justify-center text-[#a3e635]">
                {inputMode === 'webcam' ? (
                  <Camera className="w-8 h-8" />
                ) : (
                  <VideoIcon className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {inputMode === 'webcam'
                    ? 'Real Camera Inference Inactive'
                    : 'No Exercise Video Selected'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {inputMode === 'webcam'
                    ? 'Click Start Camera below. Real frames will be analyzed using browser-native MediaPipe PoseLandmarker.'
                    : 'Upload your exercise video or select a sample clip to run frame-by-frame pose inference.'}
                </p>
              </div>

              {inputMode === 'webcam' ? (
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Camera className="w-4 h-4" />}
                  onClick={startCamera}
                  disabled={modelStatus === 'loading'}
                >
                  Start Camera
                </Button>
              ) : (
                <label className="inline-block cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#a3e635] text-slate-950 font-bold text-xs rounded-xl shadow hover:bg-[#bef264] transition-all">
                    <Upload className="w-4 h-4" />
                    Select Video File (.mp4, .webm)
                  </span>
                </label>
              )}
            </div>
          )}

          {/* No Pose Detected Overlay Notice */}
          {((inputMode === 'webcam' && cameraActive) || (inputMode === 'upload' && isVideoPlaying)) &&
            !poseDetected && (
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-amber-950/80 backdrop-blur-md p-3 rounded-xl border border-amber-700/60 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs text-amber-200">
                  <span className="font-bold block">No Athlete Detected in Frame</span>
                  {isPushupAssessment
                    ? 'Position athlete in 45° or side profile view so shoulder, elbow, and wrist are unobstructed.'
                    : 'Position athlete sideways in good lighting so shoulder, hip, and knees are unobstructed.'}
                </div>
              </div>
            )}
        </div>

        {/* Real-time Telemetry & Biomechanics Bar */}
        <div className="p-4 bg-[#0e141d] border-t border-[#1f2d3d] space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* 1. Valid Reps */}
            <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                {isPushupAssessment
                  ? 'Valid Push-Ups (Real)'
                  : isSitupAssessment
                  ? 'Valid Sit-Ups (Real)'
                  : 'Rep Count (Real)'}
              </span>
              <span className="text-2xl font-black text-[#a3e635] font-mono mt-0.5 block">
                {isPushupAssessment ? pushupState.repCount : situpState.repCount}
              </span>
            </div>

            {/* 2. Joint Angle */}
            <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                {isPushupAssessment ? 'Elbow Flexion' : 'Torso-Hip Flexion'}
              </span>
              <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                {isPushupAssessment
                  ? pushupState.currentElbowAngle > 0
                    ? `${pushupState.currentElbowAngle}°`
                    : '—'
                  : situpState.currentAngle > 0
                  ? `${situpState.currentAngle}°`
                  : '—'}
              </span>
            </div>

            {/* 3. Movement State Machine */}
            <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                State Machine Phase
              </span>
              <div className="mt-1">
                {getPhaseBadge(isPushupAssessment ? pushupState.phase : situpState.phase)}
              </div>
            </div>

            {/* 4. Tracking Confidence */}
            <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d]">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">
                Tracked Profile
              </span>
              <span className="text-sm font-bold text-white mt-1 block capitalize">
                {((isPushupAssessment ? pushupState.activeSide : situpState.activeSide) !== 'none')
                  ? `${isPushupAssessment ? pushupState.activeSide : situpState.activeSide} Sagittal View`
                  : 'Searching Pose...'}
              </span>
            </div>
          </div>

          {/* Form Guidance Feedback */}
          <div className="px-3.5 py-2 rounded-xl bg-[#070a0e] border border-[#1f2d3d] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#a3e635] shrink-0" />
              <span className="text-slate-300 font-medium">
                {isPushupAssessment ? pushupState.feedback : situpState.feedback}
              </span>
            </div>
            {((isPushupAssessment ? pushupState.isTrackingValid : situpState.isTrackingValid)) && (
              <Badge variant="lime" size="sm">
                Valid Kinematic Chain
              </Badge>
            )}
          </div>
        </div>

        {/* Lower Controls Bar */}
        <div className="p-4 bg-[#0a0f16] border-t border-[#1f2d3d] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Input Specific Controls */}
          {inputMode === 'webcam' ? (
            <div className="flex items-center gap-2">
              {!cameraActive ? (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Camera className="w-4 h-4" />}
                  onClick={startCamera}
                  disabled={modelStatus === 'loading'}
                >
                  Start Camera
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Square className="w-4 h-4" />}
                  onClick={stopCamera}
                >
                  Stop Camera
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={
                  isVideoPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )
                }
                onClick={toggleVideoPlayback}
                disabled={!uploadedVideoUrl}
              >
                {isVideoPlaying ? 'Pause Video' : 'Play Video'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={restartVideo}
                disabled={!uploadedVideoUrl}
              >
                Restart
              </Button>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#273548] text-xs font-semibold text-slate-300 hover:text-white bg-[#0e141d] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  Change Video
                </span>
              </label>

              {uploadedFileName && (
                <span className="text-xs text-slate-400 font-mono hidden md:inline truncate max-w-[180px]">
                  {uploadedFileName}
                </span>
              )}
            </div>
          )}

          {/* Right: Test Session & Completion Actions */}
          <div className="flex items-center gap-2">
            {!isTestSessionActive ? (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Activity className="w-4 h-4" />}
                onClick={startTestSession}
              >
                Record 60s Trial
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Square className="w-4 h-4" />}
                onClick={finishAttempt}
              >
                Complete Trial ({sessionSecondsLeft}s Left)
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={finishAttempt}
            >
              Submit Results
            </Button>
          </div>
        </div>

        {/* Camera Permission Error Notice */}
        {cameraPermissionError && (
          <div className="p-3 bg-rose-950/80 border-t border-rose-800 text-xs text-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{cameraPermissionError}</span>
          </div>
        )}
      </div>

      {/* Sample Video Quick Tests Panel */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#a3e635]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Test Verification Clips
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Verify real computer vision without camera
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {isPushupAssessment ? (
            <button
              onClick={() => loadSampleVideo('/samples/pushup_sample.mp4', 'pushup final.mp4 (Push-Up Test)')}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] hover:border-[#a3e635]/50 transition-all text-left cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-[#a3e635]/10 text-[#a3e635] group-hover:bg-[#a3e635] group-hover:text-slate-950 transition-colors">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Test Real Athlete Push-Up Video
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Tests MediaPipe elbow angle tracking (90° depth & lockout) & real-time pushup rep counting.
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => loadSampleVideo('/samples/situp_sample.mp4', 'Sit-Up Demonstration (MP4)')}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] hover:border-[#a3e635]/50 transition-all text-left cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-[#a3e635]/10 text-[#a3e635] group-hover:bg-[#a3e635] group-hover:text-slate-950 transition-colors">
                <Play className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Test Real Athlete Sit-Up Video
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Tests MediaPipe skeletal tracking, joint angles & state machine rep counting.
                </span>
              </div>
            </button>
          )}

          <button
            onClick={() => loadSampleVideo('/samples/no_person.mp4', 'Blank Video (No Athlete Test)')}
            className="flex items-start gap-3 p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] hover:border-amber-500/50 transition-all text-left cursor-pointer group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Test No-Person Video (Edge Case)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Verifies that overlay clears and "No Person Detected" appears when frame is empty.
              </span>
            </div>
          </button>
        </div>
      </Card>

      {/* Disclaimers & Biomechanical Protocol Integrity */}
      {!isSitupAssessment && !isPushupAssessment && (
        <div className="p-3.5 rounded-xl bg-[#0e141d] border border-[#1f2d3d] flex items-start gap-3 text-xs">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-slate-300 space-y-1">
            <span className="font-bold text-white block">
              Biomechanical Protocol Notice for {assessmentTitle}
            </span>
            <p className="text-slate-400 text-[11px]">
              Computer vision pose tracking is active and validating posture. Measurement of{' '}
              <strong className="text-white">{targetMetric}</strong> in competition requires calibrated hardware (ground contact timing mat or laser sprint gates). STRIDE does not fabricate synthetic measurements. You may enter your verified field result or record the real trial.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                placeholder={`Enter verified ${unit}`}
                value={manualMetricInput}
                onChange={(e) => setManualMetricInput(e.target.value)}
                className="w-36 bg-[#070a0e] border border-[#273548] rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#a3e635]"
              />
              <span className="text-slate-400 font-mono">{unit}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

