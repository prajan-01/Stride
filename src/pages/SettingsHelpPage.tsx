import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  HelpCircle,
  Shield,
  Bell,
  Globe,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Mail,
  Smartphone,
  Lock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DemoBanner } from '../components/common/DemoBanner';

const FAQS = [
  {
    q: 'How does STRIDE calculate vertical jump height without floor sensors?',
    a: 'STRIDE uses skeletal keypoint kinematics and flight-time equations. By tracking hip and ankle keypoints at high-speed frame intervals, the algorithm computes flight duration (hang-time in milliseconds) and derives peak vertical displacement via ballistic trajectory modeling: h = (g * t²) / 8.',
  },
  {
    q: 'How does Aadhaar verification protect athletes from age fraud?',
    a: 'STRIDE interfaces with masked UIDAI verification APIs. Date of birth data is matched directly against municipal birth records and State Sports Association registries to ensure competitors cannot manipulate biological age brackets in junior meets.',
  },
  {
    q: 'What camera setup gives the highest posture accuracy score?',
    a: 'Mount your smartphone on a stable stand or tripod exactly 3.0 to 3.5 meters away at chest height. Ensure full body framing from feet to fingertips, with bright natural front-lighting and no bright windows behind the athlete.',
  },
  {
    q: 'How do SAI and Khelo India talent scouts review my performance?',
    a: 'Scouts log into the verified Talent Directory to review video telemetry and joint angles. If your benchmarks rank in the state or national elite percentile, scouts dispatch direct invitations to Zonal Residential Assessment Camps.',
  },
];

export const SettingsHelpPage: React.FC = () => {
  const { role, setRole, showToast, resetDemoData, exportAthleteResultsToCSV } = useApp();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Preference switches
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast('Please fill out both subject and description', 'warning');
      return;
    }
    setIsSubmittingTicket(true);
    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketSubject('');
      setTicketMessage('');
      showToast('Support ticket #ST-8842 submitted! A sports science advisor will respond within 4 hours.', 'success');
    }, 600);
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#1f2d3d] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
              PREFERENCES & KNOWLEDGE BASE
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Settings & Help Center</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Configure portal preferences, role access, alerts, and access our sports science troubleshooting guide.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Portal Preferences */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Active Role Switcher Card */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#a3e635]" />
                User Mode & Role Switcher
              </h3>
              <p className="text-xs text-slate-400">
                Switch between Athlete view (Aarav Sharma) and Scout view (Coach Vikram Singh).
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('athlete')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'athlete'
                      ? 'border-[#a3e635] bg-[#a3e635]/10 text-white'
                      : 'border-[#1f2d3d] bg-[#070a0e] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">Athlete View</span>
                  <span className="text-[10px] text-slate-400">Aarav Sharma (Haryana)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('scout')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    role === 'scout'
                      ? 'border-[#a3e635] bg-[#a3e635]/10 text-white'
                      : 'border-[#1f2d3d] bg-[#070a0e] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold text-white block">Coach / Scout View</span>
                  <span className="text-[10px] text-slate-400">SAI Senior Scout</span>
                </button>
              </div>
            </Card>

            {/* Language & Regional Settings */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#a3e635]" />
                Regional Language
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {['English', 'Hindi (हिंदी)', 'Punjabi (ਪੰਜਾਬੀ)', 'Malayalam (മലയാളം)', 'Tamil (தமிழ்)'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      showToast(`Language set to ${lang}`, 'info');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-[#a3e635]/15 border-[#a3e635] text-white font-bold'
                        : 'bg-[#070a0e] border-[#1f2d3d] text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#a3e635]" />
                Communication Channels
              </h3>
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] cursor-pointer">
                  <span>WhatsApp Alerts for Selection Trials</span>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="accent-[#a3e635] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] cursor-pointer">
                  <span>SMS Alerts for Zonal Camp Calls</span>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="accent-[#a3e635] w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] cursor-pointer">
                  <span>Email Digest on Scout Profile Views</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="accent-[#a3e635] w-4 h-4"
                  />
                </label>
              </div>
            </Card>

            {/* Demo Data Management Card */}
            <Card className="p-6 space-y-4 border-amber-500/30">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Demo Mode Data Isolation
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  ISOLATED DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demo assessments, bookmarks, and profile modifications are persisted exclusively in your browser's localStorage under the <code className="text-amber-300">stride_demo_*</code> namespace. These sample records are strictly isolated from future authenticated user databases (Supabase).
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAthleteResultsToCSV}
                >
                  Export Demo CSV
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={resetDemoData}
                >
                  Reset Demo Data to Baseline
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: FAQ & Contact Helpdesk */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* FAQ Accordion */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#a3e635]" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#1f2d3d] bg-[#070a0e] overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-white hover:text-[#a3e635] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-[#1f2d3d]/50 bg-[#0e141d]/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Helpdesk Ticket Form */}
            <Card className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#a3e635]" />
                Contact Sports Science Support Desk
              </h3>
              <p className="text-xs text-slate-400">
                Having issues with phone calibration, lighting, or test submission? Message our technical team.
              </p>

              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question regarding Vertical Jump 3m distance calibration"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Issue Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your device, ambient room lighting, or error message..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a3e635]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingTicket}
                  className="w-full mt-1"
                >
                  Send Support Request
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
