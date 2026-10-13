import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  AthleteProfile,
  Assessment,
  AssessmentAttempt,
  Opportunity,
  NotificationItem,
  VerificationDocument,
  ProgressDataPoint,
} from '../types';
import {
  CURRENT_ATHLETE,
  DEMO_ATHLETES,
  ASSESSMENTS_CATALOG,
  DEMO_ATTEMPTS,
  SPORTS_OPPORTUNITIES,
  NOTIFICATIONS,
  PROGRESS_DATA,
} from '../lib/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface PersonalBestItem {
  assessmentId: string;
  title: string;
  value: number;
  unit: string;
  date: string;
  percentile: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole, userEmail?: string, userName?: string) => void;
  logout: () => void;
  currentAthlete: AthleteProfile;
  updateAthleteProfile: (updated: Partial<AthleteProfile>) => void;
  profileCompletion: {
    percentage: number;
    missingFields: string[];
  };
  athletes: AthleteProfile[];
  savedAthleteIds: string[];
  toggleSaveAthlete: (athleteId: string) => void;
  opportunities: Opportunity[];
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (opportunityId: string) => void;
  applyToOpportunity: (opportunityId: string, statement?: string) => boolean;
  assessments: Assessment[];
  attempts: AssessmentAttempt[];
  addAssessmentAttempt: (attempt: AssessmentAttempt) => void;
  deleteAssessmentAttempt: (attemptId: string) => void;
  personalBests: Record<string, PersonalBestItem>;
  progressChartData: ProgressDataPoint[];
  exportAthleteResultsToCSV: () => void;
  resetDemoData: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  verificationDocs: VerificationDocument[];
  addVerificationDoc: (type: VerificationDocument['type'], number: string, name: string) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

import { isValidRole, DEFAULT_ROLE } from '../lib/auth';

const STORAGE_KEYS = {
  ROLE: 'stride_demo_role',
  AUTH: 'stride_demo_is_authenticated',
  PROFILE: 'stride_demo_athlete_profile',
  ATTEMPTS: 'stride_demo_attempts',
  SAVED_ATHLETES: 'stride_demo_saved_athletes',
  SAVED_OPPORTUNITIES: 'stride_demo_saved_opportunities',
  OPPORTUNITIES: 'stride_demo_opportunities',
  VERIFICATION: 'stride_demo_verification_docs',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(DEFAULT_ROLE);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('stride_demo_is_authenticated');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  const [currentAthlete, setCurrentAthlete] = useState<AthleteProfile>(CURRENT_ATHLETE);
  const [athletes, setAthletes] = useState<AthleteProfile[]>(DEMO_ATHLETES);
  const [savedAthleteIds, setSavedAthleteIds] = useState<string[]>(['ath-002', 'ath-003', 'ath-007']);
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(['opp-001']);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SPORTS_OPPORTUNITIES);
  const [assessments] = useState<Assessment[]>(ASSESSMENTS_CATALOG);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(DEMO_ATTEMPTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [verificationDocs, setVerificationDocs] = useState<VerificationDocument[]>(CURRENT_ATHLETE.verificationDocuments);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initialize demo data from localStorage with strict validation against tampering
  useEffect(() => {
    try {
      const rawSavedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (rawSavedRole) {
        if (isValidRole(rawSavedRole)) {
          setRoleState(rawSavedRole);
        } else {
          console.warn(`[Security] Detected invalid demo role "${rawSavedRole}" in storage. Reverting to "${DEFAULT_ROLE}".`);
          localStorage.setItem(STORAGE_KEYS.ROLE, DEFAULT_ROLE);
          setRoleState(DEFAULT_ROLE);
        }
      }

      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setCurrentAthlete(parsed);
      }

      const storedAttempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (storedAttempts) {
        setAttempts(JSON.parse(storedAttempts));
      }

      const storedSavedAthletes = localStorage.getItem(STORAGE_KEYS.SAVED_ATHLETES);
      if (storedSavedAthletes) {
        setSavedAthleteIds(JSON.parse(storedSavedAthletes));
      }

      const storedSavedOpps = localStorage.getItem(STORAGE_KEYS.SAVED_OPPORTUNITIES);
      if (storedSavedOpps) {
        setSavedOpportunityIds(JSON.parse(storedSavedOpps));
      }

      const storedOpps = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      if (storedOpps) {
        setOpportunities(JSON.parse(storedOpps));
      }

      const storedDocs = localStorage.getItem(STORAGE_KEYS.VERIFICATION);
      if (storedDocs) {
        setVerificationDocs(JSON.parse(storedDocs));
      }
    } catch (e) {
      console.warn('Error reading demo state from localStorage', e);
    }
  }, []);

  // Sync role changes and protect against storage tampering from other tabs/devtools
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ROLE) {
        if (isValidRole(e.newValue)) {
          setRoleState(e.newValue);
        } else {
          console.warn(`[Security] Unauthorized storage manipulation on ${STORAGE_KEYS.ROLE}. Restoring valid role.`);
          try {
            localStorage.setItem(STORAGE_KEYS.ROLE, role);
          } catch {
            // ignore
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [role]);

  const setRole = (newRole: UserRole) => {
    if (!isValidRole(newRole)) {
      console.warn(`[Security] Rejected attempt to assign invalid role: "${newRole}".`);
      showToast('Unauthorized role elevation attempt rejected.', 'error');
      return;
    }
    setRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    } catch (err) {
      console.warn('Could not persist role to storage', err);
    }
    showToast(`Switched view to ${newRole === 'athlete' ? 'Athlete Mode (Aarav Sharma)' : 'Coach & Talent Scout Portal'}`, 'info');
  };

  const login = (newRole: UserRole, userEmail?: string, userName?: string) => {
    if (!isValidRole(newRole)) {
      console.warn(`[Security] Invalid role on login: "${newRole}".`);
      return;
    }
    setRoleState(newRole);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    } catch (err) {
      console.warn('Could not persist auth to storage', err);
    }
    const displayName =
      userName ||
      (newRole === 'athlete' ? currentAthlete.name : 'Coach Vikram Singh');
    showToast(
      newRole === 'athlete'
        ? `Welcome to STRIDE, ${displayName}! Athlete portal active.`
        : `Welcome to STRIDE, ${displayName}! Scout HQ active.`,
      'success'
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (err) {
      console.warn('Could not remove auth from storage', err);
    }
    showToast('Signed out of STRIDE portal.', 'info');
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile Completion Calculation
  const profileCompletion = useMemo(() => {
    const missing: string[] = [];
    let score = 0;

    if (currentAthlete.name) score += 10; else missing.push('Full Name');
    if (currentAthlete.dateOfBirth) score += 10; else missing.push('Date of Birth');
    if (currentAthlete.gender) score += 5; else missing.push('Gender');
    if (currentAthlete.state) score += 10; else missing.push('State');
    if (currentAthlete.district) score += 5; else missing.push('District');
    if (currentAthlete.preferredLanguage) score += 10; else missing.push('Preferred Language');
    if (currentAthlete.heightCm > 0) score += 10; else missing.push('Height');
    if (currentAthlete.weightKg > 0) score += 10; else missing.push('Weight');
    if (currentAthlete.primarySport) score += 10; else missing.push('Primary Sport');
    if (currentAthlete.sportsInterests && currentAthlete.sportsInterests.length > 0) score += 10; else missing.push('Sports Interests');
    if (currentAthlete.trainingExperience) score += 5; else missing.push('Training Experience');
    if (currentAthlete.bio && currentAthlete.bio.length > 20) score += 5; else missing.push('Biography');
    if (currentAthlete.avatar) score += 5; else missing.push('Profile Photo');
    if (verificationDocs.length > 0) score += 5; else missing.push('Verification Document');

    return {
      percentage: Math.min(100, score),
      missingFields: missing,
    };
  }, [currentAthlete, verificationDocs]);

  // Personal Bests Dynamic Calculation
  const personalBests = useMemo(() => {
    const pbs: Record<string, PersonalBestItem> = {};

    attempts.forEach((att) => {
      const existing = pbs[att.assessmentId];
      // For sprint (time), lower is better. For jumps, pushups, beep test, higher is better.
      const isSprint = att.assessmentId.includes('sprint');
      const isBetter = !existing
        ? true
        : isSprint
        ? att.metricValue < existing.value
        : att.metricValue > existing.value;

      if (isBetter) {
        pbs[att.assessmentId] = {
          assessmentId: att.assessmentId,
          title: att.assessmentTitle,
          value: att.metricValue,
          unit: att.metricUnit,
          date: att.date,
          percentile: att.nationalPercentile,
        };
      }
    });

    return pbs;
  }, [attempts]);

  // Dynamic Progress Chart Data
  const progressChartData = useMemo(() => {
    if (attempts.length === 0) return PROGRESS_DATA;
    // Base 6 months trend, updating the latest month with the athlete's current score
    return PROGRESS_DATA.map((p, index) => {
      if (index === PROGRESS_DATA.length - 1) {
        return {
          ...p,
          strideScore: currentAthlete.strideScore,
          verticalJump: currentAthlete.keyStats.verticalJumpCm,
          sprint30m: currentAthlete.keyStats.sprint30mSec,
          pushups: currentAthlete.keyStats.pushups60s,
          percentile: currentAthlete.nationalPercentile,
        };
      }
      return p;
    });
  }, [attempts, currentAthlete]);

  const updateAthleteProfile = (updated: Partial<AthleteProfile>) => {
    setCurrentAthlete((prev) => {
      const next = { ...prev, ...updated };
      setAthletes((list) => list.map((a) => (a.id === next.id ? next : a)));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      return next;
    });
    showToast('Athlete profile updated and saved to demo storage', 'success');
  };

  const toggleSaveAthlete = (athleteId: string) => {
    setSavedAthleteIds((prev) => {
      const isAlready = prev.includes(athleteId);
      let next: string[];
      if (isAlready) {
        next = prev.filter((id) => id !== athleteId);
        showToast('Athlete removed from your scout shortlist', 'info');
      } else {
        next = [...prev, athleteId];
        const athlete = athletes.find((a) => a.id === athleteId);
        showToast(`${athlete ? athlete.name : 'Athlete'} added to scout shortlist!`, 'success');
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_ATHLETES, JSON.stringify(next));
      return next;
    });
  };

  const toggleSaveOpportunity = (oppId: string) => {
    setSavedOpportunityIds((prev) => {
      const isAlready = prev.includes(oppId);
      let next: string[];
      if (isAlready) {
        next = prev.filter((id) => id !== oppId);
        showToast('Opportunity removed from saved list', 'info');
      } else {
        next = [...prev, oppId];
        showToast('Opportunity saved to your watchlist!', 'success');
      }
      localStorage.setItem(STORAGE_KEYS.SAVED_OPPORTUNITIES, JSON.stringify(next));
      return next;
    });
  };

  const applyToOpportunity = (opportunityId: string, statement?: string): boolean => {
    let success = false;
    setOpportunities((prev) => {
      const next = prev.map((opp) => {
        if (opp.id === opportunityId) {
          if (opp.applicationStatus === 'applied') {
            showToast('You have already submitted an application for this opportunity', 'warning');
            return opp;
          }
          success = true;
          return {
            ...opp,
            applicationStatus: 'applied' as const,
            appliedDate: new Date().toISOString().split('T')[0],
          };
        }
        return opp;
      });
      if (success) {
        localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(next));
      }
      return next;
    });

    if (success) {
      showToast('Application successfully submitted with STRIDE digital verified passport!', 'success');
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Application Dispatched',
        message: 'Your STRIDE performance profile was submitted to the selection committee.',
        timestamp: 'Just now',
        read: false,
        type: 'opportunity',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
    return success;
  };

  const addAssessmentAttempt = (attempt: AssessmentAttempt) => {
    setAttempts((prev) => {
      const next = [attempt, ...prev];
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(next));
      return next;
    });

    // Update keyStats on current athlete
    setCurrentAthlete((prev) => {
      const nextStats = { ...prev.keyStats };
      if (attempt.assessmentId === 'vertical-jump') {
        nextStats.verticalJumpCm = attempt.metricValue;
      } else if (attempt.assessmentId === '30m-sprint') {
        nextStats.sprint30mSec = attempt.metricValue;
      } else if (attempt.assessmentId === 'pushup-endurance') {
        nextStats.pushups60s = attempt.metricValue;
      }
      const nextProfile = { ...prev, keyStats: nextStats };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(nextProfile));
      return nextProfile;
    });

    showToast(`Sample Assessment saved: ${attempt.metricValue} ${attempt.metricUnit} recorded!`, 'success');
  };

  const deleteAssessmentAttempt = (attemptId: string) => {
    const targetAttempt = attempts.find((a) => a.id === attemptId);
    if (!targetAttempt) return;

    setAttempts((prev) => {
      const next = prev.filter((a) => a.id !== attemptId);
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(next));

      // Re-evaluate key stats based on latest remaining attempt for this assessment
      const remainingForAssessment = next.filter((a) => a.assessmentId === targetAttempt.assessmentId);
      if (remainingForAssessment.length > 0) {
        const latestRemaining = remainingForAssessment[0];
        setCurrentAthlete((current) => {
          const nextStats = { ...current.keyStats };
          if (targetAttempt.assessmentId === 'vertical-jump') {
            nextStats.verticalJumpCm = latestRemaining.metricValue;
          } else if (targetAttempt.assessmentId === '30m-sprint') {
            nextStats.sprint30mSec = latestRemaining.metricValue;
          } else if (targetAttempt.assessmentId === 'pushup-endurance') {
            nextStats.pushups60s = latestRemaining.metricValue;
          }
          const updated = { ...current, keyStats: nextStats };
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
          return updated;
        });
      }

      return next;
    });

    showToast(`Sample record for "${targetAttempt.assessmentTitle}" deleted.`, 'info');
  };

  const exportAthleteResultsToCSV = () => {
    if (attempts.length === 0) {
      showToast('No assessment attempts available to export.', 'warning');
      return;
    }

    const headers = [
      'Assessment ID',
      'Assessment Title',
      'Athlete Name',
      'Date',
      'Metric Value',
      'Unit',
      'National Percentile',
      'SAI Benchmark Tier',
      'AI Posture Accuracy (%)',
      'Data Classification',
    ];

    const rows = attempts.map((a) => [
      `"${a.id}"`,
      `"${a.assessmentTitle.replace(/"/g, '""')}"`,
      `"${a.athleteName.replace(/"/g, '""')}"`,
      `"${a.date}"`,
      a.metricValue,
      `"${a.metricUnit}"`,
      a.nationalPercentile,
      `"${a.strideTier}"`,
      a.aiPostureAccuracy,
      '"SAMPLE DEMO DATA"',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `STRIDE_Athlete_Results_${currentAthlete.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Sample assessment results exported to CSV successfully!', 'success');
  };

  const resetDemoData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      setCurrentAthlete(CURRENT_ATHLETE);
      setAttempts(DEMO_ATTEMPTS);
      setOpportunities(SPORTS_OPPORTUNITIES);
      setSavedAthleteIds(['ath-002', 'ath-003', 'ath-007']);
      setSavedOpportunityIds(['opp-001']);
      setVerificationDocs(CURRENT_ATHLETE.verificationDocuments);
      showToast('Demo storage reset to initial sample baseline.', 'info');
    } catch {
      showToast('Could not reset demo storage', 'error');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const addVerificationDoc = (type: VerificationDocument['type'], number: string, name: string) => {
    const newDoc: VerificationDocument = {
      id: `doc-${Date.now()}`,
      type,
      documentNumber: number,
      documentName: name,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: 'Document queued for OCR biometric verification against government database.',
    };
    setVerificationDocs((prev) => {
      const next = [newDoc, ...prev];
      localStorage.setItem(STORAGE_KEYS.VERIFICATION, JSON.stringify(next));
      return next;
    });
    showToast('Verification document uploaded! OCR verification in progress.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        login,
        logout,
        currentAthlete,
        updateAthleteProfile,
        profileCompletion,
        athletes,
        savedAthleteIds,
        toggleSaveAthlete,
        opportunities,
        savedOpportunityIds,
        toggleSaveOpportunity,
        applyToOpportunity,
        assessments,
        attempts,
        addAssessmentAttempt,
        deleteAssessmentAttempt,
        personalBests,
        progressChartData,
        exportAthleteResultsToCSV,
        resetDemoData,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        verificationDocs,
        addVerificationDoc,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
