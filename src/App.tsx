import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';

// 16 Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { AthleteDashboardPage } from './pages/AthleteDashboardPage';
import { AthleteProfilePage } from './pages/AthleteProfilePage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AssessmentInstructionsPage } from './pages/AssessmentInstructionsPage';
import { AssessmentResultsPage } from './pages/AssessmentResultsPage';
import { ProgressChartsPage } from './pages/ProgressChartsPage';
import { AthleteVerificationPage } from './pages/AthleteVerificationPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { ScoutDashboardPage } from './pages/ScoutDashboardPage';
import { AthleteDirectoryPage } from './pages/AthleteDirectoryPage';
import { SavedAthletesPage } from './pages/SavedAthletesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsHelpPage } from './pages/SettingsHelpPage';

import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-[#070a0e] text-slate-100 selection:bg-[#a3e635] selection:text-black">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 flex flex-col">{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <MobileNav />}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* 1. Dedicated Starting Login Page for Athlete & Scout */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* 2. Public Platform Overview / Promotional Landing Page */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/overview" element={<Navigate to="/landing" replace />} />

            {/* 3. Athlete Dashboard - Athlete Only */}
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['athlete']} redirectTo="/scout/dashboard">
                  <AthleteDashboardPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/athlete/dashboard" element={<Navigate to="/dashboard" replace />} />

            {/* 4. Athlete / Scout Profile */}
            <Route
              path="/profile"
              element={
                <RoleProtectedRoute allowedRoles={['athlete', 'scout']}>
                  <AthleteProfilePage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/athlete/profile" element={<Navigate to="/profile" replace />} />

            {/* 5. Fitness Assessments Catalog - Athlete Only */}
            <Route
              path="/assessments"
              element={
                <RoleProtectedRoute allowedRoles={['athlete']} redirectTo="/scout/dashboard">
                  <AssessmentsPage />
                </RoleProtectedRoute>
              }
            />

            {/* 6. Individual Assessment Instructions - Athlete Only */}
            <Route
              path="/assessments/:id/instructions"
              element={
                <RoleProtectedRoute allowedRoles={['athlete']} redirectTo="/scout/dashboard">
                  <AssessmentInstructionsPage />
                </RoleProtectedRoute>
              }
            />

            {/* 7. Assessment Results - Athlete Only */}
            <Route
              path="/assessments/:id/results"
              element={
                <RoleProtectedRoute allowedRoles={['athlete']} redirectTo="/scout/dashboard">
                  <AssessmentResultsPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/results/latest" element={<AssessmentResultsPage />} />

            {/* 8. My Results and Progress Charts - Athlete Only */}
            <Route
              path="/results"
              element={
                <RoleProtectedRoute allowedRoles={['athlete']} redirectTo="/scout/dashboard">
                  <ProgressChartsPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/progress" element={<Navigate to="/results" replace />} />

            {/* 9. Athlete Verification - Athlete Only */}
            <Route
              path="/verification"
              element={
                <RoleProtectedRoute allowedRoles={['athlete']} redirectTo="/scout/dashboard">
                  <AthleteVerificationPage />
                </RoleProtectedRoute>
              }
            />

            {/* 10. Sports Opportunities - Athlete Only (Blocked for Coach/Scout) */}
            <Route
              path="/opportunities"
              element={
                <RoleProtectedRoute
                  allowedRoles={['athlete']}
                  redirectTo="/scout/dashboard"
                  deniedMessage="Access Denied: The Opportunities page is available only to athletes. Redirected to Scout HQ."
                >
                  <OpportunitiesPage />
                </RoleProtectedRoute>
              }
            />

            {/* 11. Opportunity Details and Applications - Athlete Only */}
            <Route
              path="/opportunities/:id"
              element={
                <RoleProtectedRoute
                  allowedRoles={['athlete']}
                  redirectTo="/scout/dashboard"
                  deniedMessage="Access Denied: Opportunity details are available only to athletes. Redirected to Scout HQ."
                >
                  <OpportunityDetailPage />
                </RoleProtectedRoute>
              }
            />

            {/* 12. Coach/Talent Scout Dashboard - Scout Only */}
            <Route
              path="/scout/dashboard"
              element={
                <RoleProtectedRoute
                  allowedRoles={['scout']}
                  redirectTo="/dashboard"
                  deniedMessage="Access Denied: Scout HQ is restricted to verified coaches and scouts. Redirected to Athlete Dashboard."
                >
                  <ScoutDashboardPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/scout" element={<Navigate to="/scout/dashboard" replace />} />

            {/* 13. Athlete Directory - Scout Only */}
            <Route
              path="/scout/athletes"
              element={
                <RoleProtectedRoute
                  allowedRoles={['scout']}
                  redirectTo="/dashboard"
                  deniedMessage="Access Denied: The Athlete Directory is restricted to coaches and scouts. Redirected to Athlete Dashboard."
                >
                  <AthleteDirectoryPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/athletes" element={<Navigate to="/scout/athletes" replace />} />

            {/* 14. Saved Athletes - Scout Only */}
            <Route
              path="/scout/saved"
              element={
                <RoleProtectedRoute
                  allowedRoles={['scout']}
                  redirectTo="/dashboard"
                  deniedMessage="Access Denied: The Shortlisted Roster is restricted to coaches and scouts. Redirected to Athlete Dashboard."
                >
                  <SavedAthletesPage />
                </RoleProtectedRoute>
              }
            />

            {/* 15. Notifications */}
            <Route
              path="/notifications"
              element={
                <RoleProtectedRoute allowedRoles={['athlete', 'scout']}>
                  <NotificationsPage />
                </RoleProtectedRoute>
              }
            />

            {/* 16. Settings and Help */}
            <Route
              path="/settings"
              element={
                <RoleProtectedRoute allowedRoles={['athlete', 'scout']}>
                  <SettingsHelpPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/help" element={<Navigate to="/settings" replace />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
