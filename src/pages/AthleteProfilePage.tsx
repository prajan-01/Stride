import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit3,
  Share2,
  Download,
  CheckCircle,
  FileText,
  Activity,
  Zap,
  Globe,
  Flame,
  User,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { PerformanceRadarChart } from '../components/charts/PerformanceRadarChart';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';

const INDIAN_STATES = [
  'Haryana', 'Punjab', 'Kerala', 'Manipur', 'Maharashtra',
  'Tamil Nadu', 'Odisha', 'Assam', 'Karnataka', 'Telangana',
  'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Gujarat', 'West Bengal', 'Delhi'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
];

export const AthleteProfilePage: React.FC = () => {
  const { currentAthlete, updateAthleteProfile, profileCompletion, exportAthleteResultsToCSV, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'radar' | 'documents'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState(currentAthlete.name);
  const [dateOfBirth, setDateOfBirth] = useState(currentAthlete.dateOfBirth);
  const [gender, setGender] = useState(currentAthlete.gender || 'Male');
  const [stateName, setStateName] = useState(currentAthlete.state);
  const [district, setDistrict] = useState(currentAthlete.district);
  const [preferredLanguage, setPreferredLanguage] = useState(currentAthlete.preferredLanguage || 'English');
  const [heightCm, setHeightCm] = useState(currentAthlete.heightCm);
  const [weightKg, setWeightKg] = useState(currentAthlete.weightKg);
  const [primarySport, setPrimarySport] = useState(currentAthlete.primarySport);
  const [sportsInterests, setSportsInterests] = useState(currentAthlete.sportsInterests ? currentAthlete.sportsInterests.join(', ') : '');
  const [trainingExperience, setTrainingExperience] = useState(currentAthlete.trainingExperience || '');
  const [bio, setBio] = useState(currentAthlete.bio);
  const [avatar, setAvatar] = useState(currentAthlete.avatar);
  const [academy, setAcademy] = useState(currentAthlete.academy);
  const [coachName, setCoachName] = useState(currentAthlete.coachName);

  const handleOpenEdit = () => {
    setName(currentAthlete.name);
    setDateOfBirth(currentAthlete.dateOfBirth);
    setGender(currentAthlete.gender || 'Male');
    setStateName(currentAthlete.state);
    setDistrict(currentAthlete.district);
    setPreferredLanguage(currentAthlete.preferredLanguage || 'English');
    setHeightCm(currentAthlete.heightCm);
    setWeightKg(currentAthlete.weightKg);
    setPrimarySport(currentAthlete.primarySport);
    setSportsInterests(currentAthlete.sportsInterests ? currentAthlete.sportsInterests.join(', ') : '');
    setTrainingExperience(currentAthlete.trainingExperience || '');
    setBio(currentAthlete.bio);
    setAvatar(currentAthlete.avatar);
    setAcademy(currentAthlete.academy);
    setCoachName(currentAthlete.coachName);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const interestsList = sportsInterests
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateAthleteProfile({
      name,
      dateOfBirth,
      gender: gender as any,
      state: stateName,
      district,
      preferredLanguage,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      primarySport,
      sportsInterests: interestsList,
      trainingExperience,
      bio,
      avatar,
      academy,
      coachName,
    });
    setIsEditModalOpen(false);
  };

  const handleSharePassport = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Athlete Biomechanical Passport URL copied to clipboard!', 'success');
    } else {
      showToast('Passport link ready to share', 'info');
    }
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="rounded-3xl bg-[#0e141d] border border-[#273548] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle neon gradient ambient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#a3e635]/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={currentAthlete.avatar}
                  alt={currentAthlete.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#a3e635] shadow-[0_0_25px_-5px_rgba(163,230,53,0.4)]"
                />
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="absolute -bottom-1.5 -right-1.5 p-1 rounded-lg bg-[#141c27] border border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635] hover:text-black transition-colors cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{currentAthlete.name}</h1>
                  <Badge variant="lime" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                    SAI Verified Athlete
                  </Badge>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                    SAMPLE DEMO DATA
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#a3e635]">
                  {currentAthlete.primarySport} ({currentAthlete.positionOrDiscipline})
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {currentAthlete.district}, {currentAthlete.state}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    DOB: {currentAthlete.dateOfBirth} ({currentAthlete.age} yrs)
                  </span>
                  {currentAthlete.gender && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Gender: {currentAthlete.gender}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    {currentAthlete.preferredLanguage}
                  </span>
                </div>
              </div>
            </div>

            {/* Score & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-[#070a0e] border border-[#273548] text-center min-w-[120px]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">STRIDE INDEX</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-[#a3e635]">
                  {currentAthlete.strideScore}
                </span>
                <span className="text-[10px] text-slate-400 block">Top 3.6% National</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={handleOpenEdit}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={exportAthleteResultsToCSV}
                >
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar Banner */}
          <div className="mt-6 pt-5 border-t border-[#1f2d3d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1 flex-1 max-w-md">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Profile Completion</span>
                <span className="text-[#a3e635] font-mono">{profileCompletion.percentage}%</span>
              </div>
              <div className="w-full bg-[#070a0e] h-2 rounded-full overflow-hidden border border-[#1f2d3d]">
                <div
                  className="bg-gradient-to-r from-[#a3e635] to-[#38bdf8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion.percentage}%` }}
                />
              </div>
            </div>

            {profileCompletion.missingFields.length > 0 ? (
              <p className="text-slate-400 text-[11px]">
                Complete <strong className="text-amber-400">{profileCompletion.missingFields.slice(0, 2).join(', ')}</strong> to reach 100% scout visibility.
              </p>
            ) : (
              <span className="text-[#a3e635] font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Profile Complete!
              </span>
            )}
          </div>
        </div>

        {/* Badges Shelf */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#a3e635]" />
            Verified Honors & National Milestones
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {currentAthlete.badges.map((badge, idx) => (
              <Badge key={idx} variant="lime" size="md">
                ⭐ {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Physical Biometrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Height</span>
            <span className="text-2xl font-black text-white font-mono">{currentAthlete.heightCm}</span>
            <span className="text-xs text-[#a3e635] font-mono ml-1">cm</span>
          </Card>
          <Card className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Weight</span>
            <span className="text-2xl font-black text-white font-mono">{currentAthlete.weightKg}</span>
            <span className="text-xs text-[#a3e635] font-mono ml-1">kg</span>
          </Card>
          <Card className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Wingspan</span>
            <span className="text-2xl font-black text-white font-mono">{currentAthlete.wingspanCm}</span>
            <span className="text-xs text-cyan-400 font-mono ml-1">cm</span>
          </Card>
          <Card className="p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Dominant Side</span>
            <span className="text-xl font-black text-white">{currentAthlete.dominantSide}</span>
          </Card>
        </div>

        {/* Tabs: Overview, Battery Records, Radar, Documents */}
        <div className="border-b border-[#1f2d3d] flex gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#a3e635] text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Biography & Training Background
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'metrics'
                ? 'border-[#a3e635] text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Physical Battery Records
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'border-[#a3e635] text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            6-Pillar Biomechanical Radar
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#a3e635] text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Verified Credentials ({currentAthlete.verificationDocuments.length})
          </button>
        </div>

        {/* Tab 1: Overview (Bio, Training Experience, Sports Interests) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 md:col-span-2 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Athletic Biography
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">{currentAthlete.bio}</p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Training Experience & Background
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#070a0e] p-3.5 rounded-xl border border-[#1f2d3d]">
                  {currentAthlete.trainingExperience || 'No specific background provided yet.'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Sports Interests & Target Events
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentAthlete.sportsInterests && currentAthlete.sportsInterests.length > 0 ? (
                    currentAthlete.sportsInterests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-[#141c27] text-white text-xs font-semibold border border-[#273548]"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">None specified.</span>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Academy & Coaching Staff
              </span>

              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Primary Academy</span>
                <p className="text-xs font-bold text-white">{currentAthlete.academy}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Head Coach</span>
                <p className="text-xs font-bold text-white">{currentAthlete.coachName}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Contact & Inquiries</span>
                <p className="text-xs text-slate-300">{currentAthlete.contactEmail}</p>
                <p className="text-xs text-slate-400">{currentAthlete.contactPhone}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: Key Metrics */}
        {activeTab === 'metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hoverGlow className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Vertical Jump (Explosive Power)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">{currentAthlete.keyStats.verticalJumpCm}</span>
                <span className="text-xs text-[#a3e635] font-mono">cm</span>
              </div>
              <p className="text-xs text-slate-400">96.4th National Percentile • SAI Elite Tier</p>
            </Card>

            <Card hoverGlow className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">30m Acceleration (Pure Speed)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">{currentAthlete.keyStats.sprint30mSec}</span>
                <span className="text-xs text-[#a3e635] font-mono">sec</span>
              </div>
              <p className="text-xs text-slate-400">Top 1.9% National • Laser track certified</p>
            </Card>

            <Card hoverGlow className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Standing Broad Jump</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">{currentAthlete.keyStats.standingBroadJumpM}</span>
                <span className="text-xs text-[#a3e635] font-mono">meters</span>
              </div>
              <p className="text-xs text-slate-400">Horizontal Force Production • 94.0th %tile</p>
            </Card>

            <Card hoverGlow className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">60-Second Push-ups (Endurance)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">{currentAthlete.keyStats.pushups60s}</span>
                <span className="text-xs text-cyan-400 font-mono">reps</span>
              </div>
              <p className="text-xs text-slate-400">Elbow Angle ≥90° validated by AI</p>
            </Card>

            <Card hoverGlow className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Sit & Reach (Hamstring Flexibility)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">+{currentAthlete.keyStats.sitAndReachCm}</span>
                <span className="text-xs text-cyan-400 font-mono">cm</span>
              </div>
              <p className="text-xs text-slate-400">High mobility, low risk of hamstring strain</p>
            </Card>

            <Card hoverGlow className="p-5">
              <span className="text-xs font-bold text-slate-400 uppercase">Multi-Stage Shuttle (VO2 Max)</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">Level {currentAthlete.keyStats.beepTestLevel}</span>
              </div>
              <p className="text-xs text-slate-400">Estimated VO2 Max: 58.4 ml/kg/min</p>
            </Card>
          </div>
        )}

        {/* Tab 3: Radar Chart */}
        {activeTab === 'radar' && (
          <Card className="p-6">
            <div className="max-w-xl mx-auto">
              <h3 className="text-center font-bold text-white text-base mb-1">
                {currentAthlete.name}'s 6-Pillar Telemetry vs SAI National Norms
              </h3>
              <p className="text-center text-xs text-slate-400 mb-4">
                Comparison against standards for 16-18 year old Indian Track & Field athletes
              </p>
              <PerformanceRadarChart />
            </div>
          </Card>
        )}

        {/* Tab 4: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentAthlete.verificationDocuments.map((doc) => (
                <Card key={doc.id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white capitalize">{doc.type.replace('_', ' ')}</span>
                    <Badge variant="lime" size="sm">
                      ✓ Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{doc.documentNumber}</p>
                  <p className="text-[11px] text-slate-500">File: {doc.documentName}</p>
                  {doc.notes && (
                    <p className="text-[11px] text-[#a3e635] bg-[#a3e635]/10 p-2 rounded-lg">
                      {doc.notes}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        <AiDisclaimerNotice />
      </div>

      {/* Comprehensive Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Athlete Profile"
        subtitle="Update demographics, physical metrics, training background, and photo"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          
          {/* Profile Photo Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Profile Photo</label>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={avatar}
                alt="Selected"
                className="w-14 h-14 rounded-xl object-cover border-2 border-[#a3e635]"
              />
              <div className="flex-1">
                <span className="text-[11px] text-slate-400 block mb-1">Select a sample photo or enter image URL:</span>
                <div className="flex gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === preset ? 'border-[#a3e635] scale-105' : 'border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Gender (Optional)</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">State / UT</label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">District</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Language</label>
              <input
                type="text"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                placeholder="e.g. Hindi, Punjabi, English"
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Sport</label>
              <input
                type="text"
                value={primarySport}
                onChange={(e) => setPrimarySport(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Sports Interests (Comma separated)</label>
              <input
                type="text"
                value={sportsInterests}
                onChange={(e) => setSportsInterests(e.target.value)}
                placeholder="100m Sprint, 200m Sprint, Long Jump"
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Training Experience & History</label>
            <input
              type="text"
              value={trainingExperience}
              onChange={(e) => setTrainingExperience(e.target.value)}
              placeholder="e.g. 5 years competitive sprint training at Haryana Academy"
              className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Training Academy</label>
              <input
                type="text"
                value={academy}
                onChange={(e) => setAcademy(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Coach Name</label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Biography</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#a3e635]"
            />
          </div>

          <div className="pt-3 border-t border-[#1f2d3d] flex justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Profile (Demo Mode)
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
