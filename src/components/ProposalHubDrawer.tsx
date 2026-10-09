import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  MapPin, 
  CreditCard, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  ExternalLink, 
  Download, 
  FileCheck, 
  ShieldCheck, 
  Zap,
  Server,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { PROPOSAL_MILESTONES } from '../data/mockData';

interface ProposalHubDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalHubDrawer: React.FC<ProposalHubDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'integrations' | 'milestones' | 'commercial'>('architecture');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopySpec = () => {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          project: "Velox Cross-Platform Mobility Dispatch Platform",
          framework: "React Native TurboModules + Node.js/FastAPI Backend",
          integrations: ["Mapbox Navigation GL", "Stripe Connect & Apple Pay", "Twilio Voice/SMS Proxy Masking"],
          sprints: 4,
          timeline: "12 Weeks to App Store & Play Store Production Launch",
        },
        null,
        2
      )
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-400/30">
                Principal Engineer Brief
              </span>
              <span className="text-xs text-slate-300">Confidential Client Proposal</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">Velox Mobility Platform Specification</h2>
            <p className="text-xs text-blue-200">Architecture, Third-Party Integrations & 12-Week Delivery Roadmap</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Architecture & Stack
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. 3P Integrations
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'milestones'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. 4-Phase Delivery
          </button>
          <button
            onClick={() => setActiveTab('commercial')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'commercial'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            4. SLA & Delivery Terms
          </button>
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          
          {/* TAB 1: ARCHITECTURE & TECH STACK */}
          {activeTab === 'architecture' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  Unified Cross-Platform Core: React Native + TurboModules
                </h3>
                <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                  Single shared TypeScript codebase targeting iOS & Android with native C++ TurboModules for background GPS geofencing, high-precision accelerometer braking telemetry, and Apple Carplay / Android Auto companion displays.
                </p>
              </div>

              {/* Stack Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                    <Server className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time Telemetry Engine</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Node.js & FastAPI microservices handling sub-100ms bidirectional driver coordinate streaming via WebSockets and Redis GeoSet geospatial hashing (<code className="text-indigo-600">GEOADD / GEORADIUS</code>).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    <span>PostGIS Spatial Persistence</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Cloud SQL / PostgreSQL cluster with PostGIS spatial indexing for polygon surge zoning, driver geofence triggers, and historical route trip replay.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Surge & Dispatch Algorithm</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Dynamic Hungarian algorithm matching rider pickup requests with closest idle drivers within an optimal 3-minute radius to minimize deadhead mileage.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Zero-Trust Auth & RBAC</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    JWT cryptographic tokens with strict claims separation for Riders, Vetted Chauffeurs, and Dispatch Administrators with mandatory biometric FaceID.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THIRD-PARTY INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Mapbox / Google Maps */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Mapbox GL & Google Maps Platform</h4>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">Routing, Geofencing & ETA Matrix</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Dynamic turn-by-turn navigation SDK with custom street styling, London Congestion Charge geofence alerts, road snapping algorithms, and live traffic congestion feeds.
                  </p>
                </div>
              </div>

              {/* Stripe Payments */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Stripe PaymentSheet & Stripe Connect</h4>
                  <span className="text-[10px] font-bold text-purple-600 uppercase">1-Click Apple Pay & Split Payouts</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    PCI-DSS Level 1 compliant tokenized checkout with native Apple Pay / Google Pay. Automated payout split allocating 85% to chauffeur Connect accounts and 15% platform commission instantly upon trip completion.
                  </p>
                </div>
              </div>

              {/* Twilio Telephony */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Twilio Programmable Voice & Proxy Masking</h4>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">GDPR-Compliant Zero PII Exposure</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Temporary virtual proxy phone numbers dynamically provisioned for active trips. Neither rider nor driver ever sees the other party's real phone number, protecting privacy and eliminating off-platform bypass.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 4-PHASE MILESTONE ROADMAP */}
          {activeTab === 'milestones' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Total Program Timeline: 12 Calendar Weeks</span>
                <span className="text-blue-600 font-semibold font-mono">Sprint 1–4 Execution</span>
              </div>

              <div className="space-y-3">
                {PROPOSAL_MILESTONES.map((m, idx) => (
                  <div key={m.sprint} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {m.duration}
                      </span>
                    </div>

                    <p className="text-[11px] text-blue-600 font-medium pl-8">{m.focus}</p>

                    <ul className="pl-8 space-y-1 text-xs text-slate-600">
                      {m.deliverables.map((d, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMMERCIAL & SLA */}
          {activeTab === 'commercial' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">Engineering Squad Composition</h4>
                    <span className="text-[11px] text-slate-400">Dedicated Senior Team (12 Weeks)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">100% In-House</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">1x Principal Tech Lead</span>
                    <span className="text-white font-semibold">Architecture & API Contracts</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">2x Senior Mobile Engineers</span>
                    <span className="text-white font-semibold">React Native / iOS & Android</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">2x Backend Cloud Engineers</span>
                    <span className="text-white font-semibold">WebSockets, Redis & Stripe</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block">1x QA / Compliance Lead</span>
                    <span className="text-white font-semibold">Apple & Google Review Prep</span>
                  </div>
                </div>
              </div>

              {/* Production SLA Guarantees */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Production SLA & Uptime Guarantees</h4>
                <div className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>Dispatch Latency SLA:</span>
                    <span className="font-mono font-bold text-slate-900">&lt; 150ms round-trip</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>GPS Telemetry Refresh:</span>
                    <span className="font-mono font-bold text-slate-900">1.0s interval WebSocket ping</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>PCI & GDPR Compliance:</span>
                    <span className="font-bold text-emerald-600">Strict Tokenization & Zero PII</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>App Store Warranty:</span>
                    <span className="font-bold text-blue-600">100% Approval Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopySpec}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Specs!' : 'Copy JSON Manifest'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Close Proposal Hub
          </button>
        </div>

      </div>
    </div>
  );
};
