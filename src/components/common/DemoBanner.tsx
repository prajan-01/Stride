import React, { useState } from 'react';
import { Sparkles, Info, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#121b28] border-b border-[#23354b] px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 font-semibold text-[#a3e635] bg-[#a3e635]/15 px-2 py-0.5 rounded-full shrink-0 border border-[#a3e635]/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI CALIBRATION DEMO
          </span>
          <p className="truncate text-slate-300">
            <strong className="text-white">Note:</strong> Displayed telemetry metrics and national percentiles are standardized demo benchmarks. MediaPipe Vision neural pose tracking will ingest live video feeds in Phase 2.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0 cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const AiDisclaimerNotice: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-3.5 rounded-xl bg-[#0f1724] border border-[#22354c] flex items-start gap-3 text-xs text-slate-300 ${className}`}>
      <Info className="w-4 h-4 text-[#a3e635] shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-white">Biomechanical AI Integrity Guarantee</p>
        <p className="mt-0.5 text-slate-400 leading-relaxed">
          STRIDE never fabricates real physical measurements. In this interactive demo, data represents standardized Sports Authority of India (SAI) junior norms. Hardware camera feed calibration and MediaPipe Landmark tracking active.
        </p>
      </div>
    </div>
  );
};
