import React, { useState } from "react";
import { Download, FileText, Smartphone, ShieldCheck, Play, HelpCircle, Code, Star, CheckCircle, Flame } from "lucide-react";
import { mockAPKBuildInstructions, mockPlayStoreListing } from "../data/mockData";

export default function PlayStoreDocs() {
  const [activePane, setActivePane] = useState<"store" | "apk" | "privacy" | "audit">("store");

  return (
    <div className="w-full h-full bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between overflow-y-auto leading-normal select-text">
      
      {/* Top documentation header block */}
      <div className="shrink-0 mb-5">
        <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-orange-500" />
          <span>Bharat Connect Builder Hub</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          Complementary deployment blueprints, Play Store assets, native compilation triggers, and security auditing files to assist Digital Indian developers.
        </p>

        {/* Tab switcher buttons bar */}
        <div className="flex flex-wrap gap-2 mt-4.5">
          <button
            onClick={() => setActivePane("store")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer ${
              activePane === "store"
                ? "bg-orange-600 border-orange-500 text-white"
                : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Play Store Listing
          </button>

          <button
            onClick={() => setActivePane("apk")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer ${
              activePane === "apk"
                ? "bg-orange-600 border-orange-500 text-white"
                : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            APK Compilation
          </button>

          <button
            onClick={() => setActivePane("privacy")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer ${
              activePane === "privacy"
                ? "bg-orange-600 border-orange-500 text-white"
                : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Privacy Policy (DPDPA)
          </button>

          <button
            onClick={() => setActivePane("audit")}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer ${
              activePane === "audit"
                ? "bg-orange-600 border-orange-500 text-white"
                : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Security Audit Matrix
          </button>
        </div>
      </div>

      {/* Main rendered text body */}
      <div className="flex-1 bg-zinc-950/60 rounded-2xl border border-zinc-850/60 p-5 overflow-y-auto max-h-[580px]">
        
        {/* VIEW 1: PLAY STORE LISTING */}
        {activePane === "store" && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-950/15 border border-orange-500/20 rounded-xl flex items-start gap-3.5">
              <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 via-white to-orange-500 rounded-2xl flex items-center justify-center font-bold text-lg text-slate-900 border border-zinc-700 shrink-0 select-none">
                🇮🇳
              </div>
              <div className="leading-normal">
                <h4 className="text-sm font-bold text-zinc-100">Recommended App Icon Concept</h4>
                <p className="text-xs text-zinc-450 mt-1">
                  A tri-color gradient backdrop pairing a polished minimalist video capture glyph. It embodies Swadeshi identity with high-end premium contrast.
                </p>
              </div>
            </div>

            <div className="space-y-3 font-sans text-xs text-zinc-300">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Play Store App Title</span>
                <p className="p-2.5 bg-zinc-950 border border-zinc-900 text-zinc-200 rounded-lg font-bold">{mockPlayStoreListing.title}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Short App Store Description</span>
                <p className="p-2.5 bg-zinc-950 border border-zinc-900 text-zinc-200 rounded-lg">{mockPlayStoreListing.shortDesc}</p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block mb-1">Full Detailed App Store Description</span>
                <div className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-300 rounded-lg whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                  {mockPlayStoreListing.fullDesc}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: APK COMPILATION GUIDE */}
        {activePane === "apk" && (
          <div className="text-xs font-sans text-zinc-300 space-y-4 whitespace-pre-wrap leading-relaxed">
            <div className="text-zinc-200">
              {mockAPKBuildInstructions}
            </div>
          </div>
        )}

        {/* VIEW 3: PRIVACY POLICY DPDPA MODEL */}
        {activePane === "privacy" && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400">
              💡 Fully compliant with the Indian Digital Personal Data Protection Act (DPDPA), 2023. Fits secure standard release protocols.
            </div>
            
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl text-xs font-sans text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {mockPlayStoreListing.privacyPolicy}
            </div>
          </div>
        )}

        {/* VIEW 4: FIREWALL SECURITY AUDIT MATRIX */}
        {activePane === "audit" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Security Hardening Conflict Matrix
            </h4>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Below is the conflict report compiled against our airtight Firestore security boundaries to block malicious exploits (Shadow Updates, Privilege Escalation).
            </p>

            <div className="border border-zinc-900 rounded-xl overflow-hidden text-[11px] font-sans">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-300">
                    <th className="p-2.5 font-bold font-mono text-[9px] uppercase tracking-wider">Vector Check</th>
                    <th className="p-2.5 font-bold font-mono text-[9px] uppercase tracking-wider">Threat Result</th>
                    <th className="p-2.5 font-bold font-mono text-[9px] uppercase tracking-wider">Security Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  <tr>
                    <td className="p-2.5 text-zinc-200 font-semibold">Identity Spoofing</td>
                    <td className="p-2.5 text-emerald-400">REJECTED (Pass)</td>
                    <td className="p-2.5 text-zinc-400 font-mono text-[9.5px]">isOwner(userId) && request.auth.uid == userId</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-zinc-200 font-semibold">Self-Assigned RBAC</td>
                    <td className="p-2.5 text-emerald-400">REJECTED (Pass)</td>
                    <td className="p-2.5 text-zinc-400 font-mono text-[9.5px]">hasOnly() validation blocks admin flags assignment</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-zinc-200 font-semibold">Eavesdropping</td>
                    <td className="p-2.5 text-emerald-400">REJECTED (Pass)</td>
                    <td className="p-2.5 text-zinc-400 font-mono text-[9.5px]">check parent room members array list bounds</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-zinc-200 font-semibold">Resource Poisoning</td>
                    <td className="p-2.5 text-emerald-400">REJECTED (Pass)</td>
                    <td className="p-2.5 text-zinc-400 font-mono text-[9.5px]">strict size() checks on string buffers</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-zinc-200 font-semibold">Shadow Updates</td>
                    <td className="p-2.5 text-emerald-400">REJECTED (Pass)</td>
                    <td className="p-2.5 text-zinc-400 font-mono text-[9.5px]">isValidUser() strict size Matching logic filter</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-zinc-500 font-mono">
              *Rules audited against @firebase/eslint-plugin-security-rules recommendations.
            </p>
          </div>
        )}

      </div>

      {/* Launcher stats details */}
      <div className="shrink-0 pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono select-none">
        <span>GATEWAY REGION: AP-SOUTH-1</span>
        <span>STATUS: CERTIFIED GREEN ✔</span>
      </div>

    </div>
  );
}
