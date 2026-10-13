import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Clock,
  Video,
  Award,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DemoBanner, AiDisclaimerNotice } from '../components/common/DemoBanner';

export const AssessmentsPage: React.FC = () => {
  const { assessments } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Explosive Power', 'Speed & Agility', 'Core & Strength', 'Endurance', 'Flexibility'];

  const filteredAssessments = assessments.filter((test) => {
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f2d3d] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
                STANDARDIZED PROTOCOL
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">SAI Junior Battery 2026</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Fitness Assessments</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Smartphone camera-based biometric tests calibrated against Sports Authority of India national junior norms. Test your speed, jump explosiveness, and endurance.
            </p>
          </div>

          <Link to="/results">
            <Button variant="secondary" size="md">
              View My Test History
            </Button>
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#a3e635] text-slate-950 font-bold shadow-sm'
                    : 'bg-[#0e141d] text-slate-400 hover:text-white border border-[#1f2d3d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search assessment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0e141d] border border-[#1f2d3d] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#a3e635]"
            />
          </div>
        </div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((test) => (
            <Card key={test.id} hoverGlow className="p-6 flex flex-col justify-between">
              <div>
                {/* Header tags */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="cyan" size="sm">
                    {test.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {test.durationSeconds}s
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">{test.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{test.description}</p>

                {/* Metric pill */}
                <div className="p-3 rounded-xl bg-[#070a0e] border border-[#1f2d3d] mb-4 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Measured Metric</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-[#a3e635]">{test.targetMetric}</span>
                    <span className="text-xs font-mono text-slate-400">Unit: {test.unit}</span>
                  </div>
                </div>

                {/* Norm highlight */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                  <span className="font-semibold text-slate-300 block text-[11px]">SAI Elite Norm:</span>
                  <p className="text-[11px] text-[#a3e635] font-mono bg-[#a3e635]/10 px-2 py-1 rounded-lg inline-block">
                    {test.saiStandardNorms.elite}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#1f2d3d] flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-slate-500" />
                  {test.cameraSetupGuide.distanceMeters}
                </span>

                <Link to={`/assessments/${test.slug}/instructions`}>
                  <Button variant="primary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Start Test
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <AiDisclaimerNotice />
      </div>
    </div>
  );
};
