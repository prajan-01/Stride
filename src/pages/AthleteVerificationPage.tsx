import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Lock,
  Info,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { DemoBanner } from '../components/common/DemoBanner';
import { VerificationDocument } from '../types';

export const AthleteVerificationPage: React.FC = () => {
  const { verificationDocs, addVerificationDoc, showToast } = useApp();

  const [docType, setDocType] = useState<VerificationDocument['type']>('school_id');
  const [docNumber, setDocNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber) {
      showToast('Please enter the document registration number', 'warning');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      addVerificationDoc(
        docType,
        docNumber,
        fileName || `${docType.toUpperCase()}_Document_${Date.now()}.pdf`
      );
      setDocNumber('');
      setFileName('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex-1 pb-16 bg-[#070a0e]">
      <DemoBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#1f2d3d] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#a3e635] uppercase tracking-wider">
              CREDENTIAL INTEGRITY
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">National Anti-Age Fraud Protocol</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Athlete Verification</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Verified athletes receive priority shortlisting from SAI scouts and Khelo India selectors. We cross-verify government identity, date of birth, and federation licenses.
          </p>
        </div>

        {/* Verification Status Overview Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e1622] to-[#0a1017] border border-[#273548] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#a3e635]/15 border border-[#a3e635]/40 flex items-center justify-center text-[#a3e635] shrink-0 shadow-[0_0_20px_-3px_rgba(163,230,53,0.3)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Tier-1 Verified Athlete Passport</h2>
                <Badge variant="lime" size="sm">Active</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Aadhaar DOB authentication and State Athletics Association Federation ID are officially verified and synced with National Sports Repository System (NSRS).
              </p>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">AUTHENTICATION STATUS</span>
            <span className="text-base font-bold text-[#a3e635] flex items-center gap-1.5 md:justify-end">
              <CheckCircle2 className="w-4 h-4" /> 100% Eligible for National Trials
            </span>
          </div>
        </div>

        {/* 2 Column Layout: Upload New Document & Existing Documents Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload New Document Form */}
          <Card className="p-6 lg:col-span-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#a3e635]" />
                Upload Supporting Verification
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload school bonafide or sports federation certificates for fast-track verification.
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                >
                  <option value="school_id">School Bonafide / Student ID Certificate</option>
                  <option value="federation_license">National / State Federation License ID</option>
                  <option value="birth_certificate">Municipal Birth Certificate</option>
                  <option value="aadhaar">Aadhaar Card (UIDAI Masked e-Aadhaar)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Document / Certificate Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AFI-HAR-2024-XXXX or Bonafide #441"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-[#070a0e] border border-[#1f2d3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#a3e635]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Attach PDF or High-Resolution Scan
                </label>
                <div className="border border-dashed border-[#273548] rounded-xl p-4 text-center bg-[#070a0e]/50 hover:border-slate-500 transition-colors">
                  <input
                    type="file"
                    id="docFile"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="docFile" className="cursor-pointer block">
                    <FileText className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                    <span className="text-xs text-[#a3e635] hover:underline block font-semibold">
                      {fileName ? fileName : 'Choose file to upload'}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      PDF, JPG or PNG up to 10MB
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Submit for OCR Verification
                </Button>
              </div>
            </form>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-2">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>256-bit encrypted storage compliant with DPDP Act 2023.</span>
            </div>
          </Card>

          {/* Right Column: Existing Documents Audit Trail */}
          <Card className="p-6 lg:col-span-7 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#a3e635]" />
                Verified Document Audit Trail ({verificationDocs.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Document ledger verified by Sports Authority of India compliance officers.
              </p>
            </div>

            <div className="space-y-3">
              {verificationDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-[#070a0e] border border-[#1f2d3d] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider block">
                        {doc.type.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-slate-300 font-mono mt-0.5">{doc.documentNumber}</p>
                    </div>
                    <Badge
                      variant={doc.status === 'verified' ? 'lime' : 'amber'}
                      size="sm"
                      icon={doc.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    >
                      {doc.status === 'verified' ? 'Verified' : 'Pending Review'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>File: {doc.documentName}</span>
                    <span>Uploaded: {doc.uploadDate}</span>
                  </div>

                  {doc.notes && (
                    <p className="text-[11px] text-slate-300 bg-[#121924] p-2 rounded-lg border border-[#1f2d3d]">
                      💡 {doc.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Anti-Fraud Protection Explainer */}
        <div className="p-6 rounded-2xl bg-[#0e141d] border border-[#273548] space-y-3 text-xs text-slate-300">
          <h4 className="font-bold text-white flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-[#a3e635]" />
            Why Biometric & Identity Verification Matters for Indian Sports
          </h4>
          <p className="leading-relaxed text-slate-400">
            Historically, grassroots athletic trials in India have suffered from forged birth certificates and age manipulation. STRIDE partners with national federations to cross-reference school records, municipal birth certificates, and Aadhaar age hashes. This guarantees that authentic young athletes receive life-changing scholarships without facing fraudulent competition.
          </p>
        </div>
      </div>
    </div>
  );
};
