import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#1f2d3d] bg-[#070a0e] pt-12 pb-16 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#141c27] border border-[#273548] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#a3e635]" />
              </div>
              <span className="font-heading font-black text-xl text-white tracking-tight">STRIDE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Potential. Measured.
              <br />
              <span className="text-slate-500 italic">Every athlete deserves a chance.</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Democratizing sports science and talent identification across all 28 Indian States and 8 Union Territories through automated smartphone computer vision.
            </p>
          </div>

          {/* Athlete Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              For Athletes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-[#a3e635] transition-colors">
                  Athlete Dashboard
                </Link>
              </li>
              <li>
                <Link to="/assessments" className="hover:text-[#a3e635] transition-colors">
                  Fitness Assessments Catalog
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#a3e635] transition-colors">
                  My Results & Progress Charts
                </Link>
              </li>
              <li>
                <Link to="/verification" className="hover:text-[#a3e635] transition-colors">
                  Aadhaar & Federation Verification
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-[#a3e635] transition-colors">
                  Khelo India & SAI Scholarships
                </Link>
              </li>
            </ul>
          </div>

          {/* Scouts Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Coaches & Scouts
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scout/dashboard" className="hover:text-[#a3e635] transition-colors">
                  Scout Headquarters
                </Link>
              </li>
              <li>
                <Link to="/scout/athletes" className="hover:text-[#a3e635] transition-colors">
                  National Athlete Directory
                </Link>
              </li>
              <li>
                <Link to="/scout/saved" className="hover:text-[#a3e635] transition-colors">
                  Shortlisted Talent Roster
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#a3e635] transition-colors">
                  Biomechanical Passport View
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Integrity & Standards
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
                <span>SAI Battery Norms calibrated against Indian National Junior Benchmarks.</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Data Protection: Compliant with Digital Personal Data Protection Act (DPDP), 2023.
              </p>
              <div className="pt-2">
                <Link to="/settings" className="text-xs text-[#a3e635] hover:underline flex items-center gap-1">
                  Settings, Help Desk & FAQs <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1f2d3d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} STRIDE Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-300">Portal Login</Link>
            <span>•</span>
            <Link to="/landing" className="hover:text-slate-300">Platform Overview</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-slate-300">Create Account</Link>
            <span>•</span>
            <Link to="/settings" className="hover:text-slate-300">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
