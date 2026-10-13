import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  ShieldCheck,
  Award,
  ChevronRight,
  Play,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users,
  Compass,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DemoBanner } from '../components/common/DemoBanner';

export const LandingPage: React.FC = () => {
  const { setRole } = useApp();

  const features = [
    {
      icon: Zap,
      title: 'Smartphone AI Biomechanics',
      description: 'Zero expensive sensor hardware required. Position any smartphone to measure jump height, sprint velocity, and joint angles at 60 FPS.',
      badge: 'Computer Vision',
    },
    {
      icon: Award,
      title: 'SAI Calibrated Norms',
      description: 'Instant national percentile scoring against Sports Authority of India junior benchmark standards across 6 battery tests.',
      badge: 'National Benchmarks',
    },
    {
      icon: ShieldCheck,
      title: 'Tamper-Proof Verification',
      description: 'Aadhaar and sports federation verification eliminates age fraud, generating a trusted athletic passport recognized by scouts.',
      badge: 'Verified Identity',
    },
    {
      icon: Compass,
      title: 'Direct Scouting Pathways',
      description: 'Get discovered by Khelo India, SAI National Centres of Excellence, Army Sports Institute, and corporate CSR academies.',
      badge: 'Talent Discovery',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Set Up Smartphone',
      desc: 'Prop your smartphone 3 meters away using our built-in camera distance calibration guide.',
    },
    {
      step: '02',
      title: 'Perform Standard Test',
      desc: 'Follow audio and visual prompts for Vertical Jump, 30m Sprint, or 60s Push-ups.',
    },
    {
      step: '03',
      title: 'Get AI Biomechanical Passport',
      desc: 'Review kinematic angles, hang-time telemetry, and your official national percentile rank.',
    },
    {
      step: '04',
      title: 'Get Scouted Across India',
      desc: 'Coaches, state sports bodies, and Khelo India scouts recruit directly from your verified profile.',
    },
  ];

  const stats = [
    { value: '14,200+', label: 'Athletes Assessed' },
    { value: '28 States', label: 'Grassroots Reach' },
    { value: '120+', label: 'SAI & Academy Scouts' },
    { value: '₹4.2 Cr', label: 'Scholarships Unlocked' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <DemoBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#1f2d3d] bg-gradient-to-b from-[#0e141d]/40 via-[#070a0e] to-[#070a0e]">
        {/* Ambient glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#a3e635]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141c27] border border-[#273548] text-xs font-semibold text-slate-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-pulse" />
                <span className="text-[#a3e635]">STRIDE INDIA</span>
                <span className="text-slate-500">•</span>
                <span>Grassroots Sports Talent Assessment Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Your Potential.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a3e635] via-[#c4f86d] to-[#38bdf8]">
                  Measured.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                <strong className="text-white">Every athlete deserves a chance.</strong> Empowering grassroots Indian athletes with smartphone computer vision to measure athletic power and unlock Khelo India & SAI scholarships.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/assessments">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto text-base px-7"
                  >
                    Start AI Fitness Test
                  </Button>
                </Link>

                <Link
                  to="/scout/athletes"
                  onClick={() => setRole('scout')}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Users className="w-5 h-5 text-[#a3e635]" />}
                    className="w-full sm:w-auto"
                  >
                    Explore Talent Directory
                  </Button>
                </Link>

                <Link to="/">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Lock className="w-4 h-4 text-[#a3e635]" />}
                    className="w-full sm:w-auto"
                  >
                    Portal Login
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635]" />
                  <span>SAI Battery Norms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635]" />
                  <span>Aadhaar Age Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#a3e635]" />
                  <span>100% Free for Athletes</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Athletic Telemetry Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glowing border card */}
                <div className="relative rounded-3xl bg-[#0e141d] border border-[#273548] p-5 shadow-2xl overflow-hidden group hover:border-[#a3e635]/50 transition-all duration-300">
                  
                  {/* Card Header with Athlete Status */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#1f2d3d]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Aarav Sharma"
                          className="w-11 h-11 rounded-xl object-cover border border-[#a3e635]/60"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#a3e635] text-slate-950 rounded-full flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">Aarav Sharma</h4>
                          <span className="text-[10px] font-mono text-slate-400">Age 17</span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          Sonipat, Haryana • Sprint 100m
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">STRIDE SCORE</span>
                      <span className="text-xl font-black font-mono text-[#a3e635]">92/100</span>
                    </div>
                  </div>

                  {/* Biomechanical Telemetry Screen simulation */}
                  <div className="my-4 rounded-2xl bg-[#070a0e] border border-[#1f2d3d] p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#a3e635]" />
                        Countermovement Vertical Jump
                      </span>
                      <Badge variant="lime" size="sm">
                        TOP 3.6% NATIONAL
                      </Badge>
                    </div>

                    {/* Metric Display */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-3 rounded-xl bg-[#0e141d] border border-[#1f2d3d]">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Jump Height</span>
                        <span className="text-2xl font-black text-white font-mono">68.5</span>
                        <span className="text-xs text-[#a3e635] font-mono ml-1">cm</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0e141d] border border-[#1f2d3d]">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">Flight Hang-Time</span>
                        <span className="text-2xl font-black text-cyan-400 font-mono">0.747</span>
                        <span className="text-xs text-slate-400 font-mono ml-1">s</span>
                      </div>
                    </div>

                    {/* Joint Angles telemetry bar */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Eccentric Knee Dip: 98° (Optimal)</span>
                        <span className="text-[#a3e635] font-mono font-bold">98.2% Pose Score</span>
                      </div>
                      <div className="w-full bg-[#141c27] h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#a3e635] to-[#38bdf8] h-full w-[96%] rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Scouted by <strong className="text-white">SAI NCOE & RFYS</strong>
                    </span>
                    <Link
                      to="/assessments/vertical-jump/results"
                      className="text-[#a3e635] hover:underline font-semibold flex items-center gap-1"
                    >
                      View Full Analysis <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="py-8 bg-[#0a0e15] border-b border-[#1f2d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#0e141d]/70 border border-[#1f2d3d]/60">
                <p className="text-2xl sm:text-3xl font-black font-heading text-white">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#070a0e] border-b border-[#1f2d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#a3e635] tracking-widest uppercase">
              THE STRIDE PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              From Rural Akhada to Olympic Feeder in 4 Steps
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Any athlete with a basic smartphone can participate in standardized Sports Authority of India battery tests, bypassing geographical and economic barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <Card key={index} hoverGlow className="p-6 relative group">
                <span className="text-4xl font-black font-heading text-[#1f2d3d] group-hover:text-[#a3e635]/40 transition-colors block mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-[#0a0e15] border-b border-[#1f2d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#a3e635] tracking-widest uppercase">
              TECHNOLOGY & TRUST
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Built Specifically for the Indian Sports Ecosystem
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Addressing age-fraud, lack of rural sports science equipment, and fragmented scouting networks through unified open telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} hoverGlow className="p-8 flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#141c27] border border-[#273548] flex items-center justify-center text-[#a3e635] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                      <Badge variant="lime" size="sm">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-[#070a0e] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#121924] to-[#0e141d] border border-[#273548] shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#a3e635] uppercase tracking-wider bg-[#a3e635]/10 px-3 py-1 rounded-full border border-[#a3e635]/20">
                <Sparkles className="w-3.5 h-3.5" />
                Join India's Sports Revolution
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to measure your athletic potential?
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Take the 45-second Vertical Jump or 30m Sprint test right now. Get your verified benchmark score and connect with Khelo India talent selectors.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/assessments/vertical-jump/instructions">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                    Take Vertical Jump Test Now
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Create Athlete Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
