export type UserRole = 'athlete' | 'scout';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization?: string;
}

export interface VerificationDocument {
  id: string;
  type: 'aadhaar' | 'school_id' | 'birth_certificate' | 'federation_license';
  documentNumber: string;
  documentName: string;
  uploadDate: string;
  status: 'verified' | 'pending' | 'action_required';
  verifiedAt?: string;
  notes?: string;
}

export interface AthleteProfile {
  id: string;
  name: string;
  avatar: string; // Profile photo URL
  age: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dateOfBirth: string;
  state: string;
  district: string;
  preferredLanguage: string; // e.g. English, Hindi, Punjabi, etc.
  primarySport: string;
  secondarySport?: string;
  sportsInterests: string[]; // List of sports interests
  trainingExperience: string; // Years or description of coaching experience
  positionOrDiscipline: string;
  heightCm: number;
  weightKg: number;
  wingspanCm: number;
  dominantSide: 'Right' | 'Left' | 'Ambidextrous';
  bio: string; // Biography
  academy: string;
  coachName: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verificationDocuments: VerificationDocument[];
  nationalPercentile: number;
  strideScore: number; // 0 - 100
  badges: string[];
  contactEmail: string;
  contactPhone: string;
  keyStats: {
    verticalJumpCm: number;
    sprint30mSec: number;
    beepTestLevel: number;
    pushups60s: number;
    sitAndReachCm: number;
    standingBroadJumpM: number;
  };
  scoutedByCount: number;
  isSaved?: boolean;
}

export interface Assessment {
  id: string;
  slug: string;
  title: string;
  category: 'Explosive Power' | 'Speed & Agility' | 'Endurance' | 'Core & Strength' | 'Flexibility';
  description: string;
  targetMetric: string;
  unit: string;
  durationSeconds: number;
  equipmentNeeded: string;
  cameraSetupGuide: {
    distanceMeters: string;
    height: string;
    angle: string;
    lighting: string;
  };
  postureCheckpoints: string[];
  saiStandardNorms: {
    elite: string;
    national: string;
    state: string;
    grassroots: string;
  };
  whyItMatters: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  athleteId: string;
  athleteName: string;
  date: string;
  metricValue: number;
  metricUnit: string;
  nationalPercentile: number;
  strideTier: 'Elite SAI Benchmark' | 'National Qualifier' | 'State Ranking' | 'Developmental';
  aiPostureAccuracy: number; // e.g. 97.4%
  repetitionBreakdown?: {
    rep: number;
    valid: boolean;
    peakAngleOrHeight: string;
    tempoSeconds: number;
    notes: string;
  }[];
  biomechanicalInsights: {
    metric: string;
    score: string;
    status: 'optimal' | 'good' | 'needs_work';
  }[];
  aiCoachFeedback: string[];
  videoThumbnailUrl?: string;
  isSimulatedDemo: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  badge: string;
  category: 'National Scheme' | 'Residential Academy' | 'Direct Trial' | 'CSR Sponsorship' | 'State Camp';
  location: string;
  state: string;
  deadline: string;
  stipendOrBenefits: string;
  eligibleSports: string[];
  ageCriteria: string;
  minStrideScore: number;
  description: string;
  eligibilityCriteria: string[];
  selectionProcess: string[];
  applicationStatus?: 'open' | 'applied' | 'shortlisted' | 'closed';
  appliedDate?: string;
  isSaved?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'opportunity' | 'scout' | 'assessment' | 'verification' | 'system';
  actionLink?: string;
}

export interface ProgressDataPoint {
  month: string;
  strideScore: number;
  verticalJump: number;
  sprint30m: number;
  pushups: number;
  percentile: number;
}
