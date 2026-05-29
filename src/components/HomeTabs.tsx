import React, { useState, useEffect } from "react";
import { MessageSquare, PhoneCall, Users, Settings, BarChart2, ShieldAlert, Star, Search, Trash2, Globe, UserCheck, Smartphone, Camera, Upload, X, Link2, Image, Check } from "lucide-react";
import { UserProfile, ChatRoom, CallHistory, TechTelemetry, Language } from "../types";
import { LanguagesList } from "../data/mockData";
import RandomCallMatch from "./RandomCallMatch";

interface HomeTabsProps {
  currentUser: UserProfile;
  chats: ChatRoom[];
  calls: CallHistory[];
  onSelectChat: (chatId: string) => void;
  onStartCall: (type: "video" | "voice", contactName: string, contactAvatar: string) => void;
  onUpdateUser: (profile: UserProfile) => void;
  onClearChats: () => void;
  onAddCallHistory?: (call: CallHistory) => void;
}

export default function HomeTabs({
  currentUser,
  chats,
  calls,
  onSelectChat,
  onStartCall,
  onUpdateUser,
  onClearChats,
  onAddCallHistory,
}: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<"chats" | "calls" | "contacts" | "settings" | "admin" | "global">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [telemetry, setTelemetry] = useState<TechTelemetry>({
    cpuUsage: 12,
    memoryUsage: 350, // MB
    latencyMs: 38,
    packetLoss: 0,
    bandwidthKbps: 1800,
  });

  // Simulation loop for system analytics telemetry in Admin Dashboard
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        const drift = Math.random() * 4 - 2;
        const netDrift = Math.floor(Math.random() * 80 - 40);
        return {
          cpuUsage: Math.max(5, Math.min(95, Math.floor(prev.cpuUsage + drift))),
          memoryUsage: Math.max(280, Math.min(512, Math.floor(prev.memoryUsage + drift * 2))),
          latencyMs: Math.max(12, Math.min(220, Math.floor(prev.latencyMs + (Math.random() * 10 - 5)))),
          packetLoss: Math.random() > 0.85 ? Number((Math.random() * 0.4).toFixed(2)) : 0,
          bandwidthKbps: Math.max(280, Math.min(4800, prev.bandwidthKbps + netDrift)),
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Admin ban state
  const [reportedUsers, setReportedUsers] = useState<Array<{ uid: string; name: string; reports: number; banned: boolean }>>([
    { uid: "spam-bot-1", name: "Ankit (Blocked)", reports: 4, banned: true },
    { uid: "user-rahul", name: "Rahul Sen (Devops)", reports: 0, banned: false },
    { uid: "spam-bot-2", name: "Spam Lottery Ads", reports: 12, banned: false }
  ]);

  const [scannedFriend, setScannedFriend] = useState("");
  const [avatarEditOpen, setAvatarEditOpen] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const PRESET_AVATARS = [
    { name: "Priya", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { name: "Rahul", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    { name: "Sanya", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    { name: "Arjun", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" },
    { name: "Aarav", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { name: "Neha", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80" }
  ];

  const processAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select a valid image file (PNG/JPG/WebP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 4MB for compatibility.");
      return;
    }

    setAvatarError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUpdateUser({ ...currentUser, avatarUrl: result });
        setCustomAvatarUrl(result);
      }
    };
    reader.onerror = () => {
      setAvatarError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const toggleBan = (uid: string) => {
    setReportedUsers((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, banned: !item.banned } : item))
    );
  };

  // Contacts
  const allContactsList = [
    { uid: "user-priya", name: "Priya Sharma", role: "AI Advisor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", online: true, status: "Pixel-perfect UI design ✨" },
    { uid: "user-amit", name: "Amit Patel", role: "WebRTC Specialist", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", online: true, status: "Low ping WebRTC channels are mast! 🚀" },
    { uid: "user-rajesh", name: "Rajesh Verma", role: "Sysops Elder", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", online: true, status: "Build humble code 🙏" },
    { uid: "user-sneha", name: "Sneha Reddy", role: "QA Engineer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", online: false, status: "Testing multi-party lobbies 🐞" },
    { uid: "user-rahul", name: "Rahul Sen", role: "Devops", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", online: false, status: "Optimizing video packets 📶" }
  ];

  // Selected historic Call Summary Modal
  const [activeSummaryCall, setActiveSummaryCall] = useState<CallHistory | null>(null);

  const totalUnread = chats.reduce((sum, ch) => sum + ch.unreadCount, 0);

  return (
    <div className="flex-1 w-full flex flex-col justify-between bg-zinc-950 overflow-hidden h-full relative">
      
      {/* Dynamic Header */}
      <div className="w-full h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-lg bg-orange-600 font-mono text-[9px] font-bold text-white tracking-widest uppercase">
            StartUp
          </div>
          <h2 className="text-base font-bold text-white font-sans flex items-center gap-1.5 select-none">
            Bharat Connect
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Active user indicator */}
          <div className="flex items-center gap-1.5 bg-zinc-850 py-1 pl-1.5 pr-2 rounded-full border border-zinc-800">
            <img src={currentUser.avatarUrl} alt="Me" className="w-5 h-5 rounded-full object-cover border border-zinc-700" />
            <span className="text-[10px] text-zinc-300 font-medium max-w-[50px] truncate">{currentUser.displayName.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className={`flex-1 overflow-y-auto ${activeTab === "global" ? "p-0" : "px-4 py-3 pb-24"}`}>
        
        {/* TAB: GLOBAL CONNECTION MATCHING (RANDOM CALLING INTERNATIONAL) */}
        {activeTab === "global" && (
          <RandomCallMatch
            currentUser={currentUser}
            onHangupMatchedCall={(durationSecOnEnd, generatedSummaryText, partnerName) => {
              const completedCall: CallHistory = {
                id: `global-call-${Date.now()}`,
                hostId: "user-me",
                callerName: `${partnerName} (Global Match)`,
                callerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                type: "video",
                isGroup: false,
                participants: ["user-me", partnerName],
                status: "completed",
                startTime: new Date().toISOString(),
                durationSeconds: durationSecOnEnd,
                aiSummary: generatedSummaryText,
              };

              if (onAddCallHistory) {
                onAddCallHistory(completedCall);
              }
              setActiveTab("calls");
            }}
            onBack={() => setActiveTab("chats")}
          />
        )}

        {/* TAB 1: CHATS VIEW */}
        {activeTab === "chats" && (
          <div className="space-y-4">
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats or topics..."
                className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/30"
              />
            </div>

            <div className="space-y-2">
              {chats
                .filter((ch) => ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((chat) => {
                  const hasUnread = chat.unreadCount > 0;
                  return (
                    <div
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={`p-3 rounded-2xl flex gap-3 cursor-pointer transition-all border ${
                        hasUnread
                          ? "bg-orange-950/15 border-orange-500/20 hover:bg-orange-950/20"
                          : "bg-zinc-900/30 border-zinc-850 hover:bg-zinc-900/50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={chat.avatarUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80"}
                          alt="chat-pic"
                          className="w-11 h-11 rounded-xl object-cover border border-zinc-800"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-zinc-200 truncate pr-2">{chat.name}</h4>
                          <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                            {new Date(chat.lastMessageAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </div>
                        <p className={`text-[10.5px] truncate mt-1 ${hasUnread ? "text-orange-400 font-medium" : "text-zinc-400"}`}>
                          {chat.lastMessageText}
                        </p>
                      </div>

                      {hasUnread && (
                        <div className="self-center flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-orange-600 font-mono text-[9px] font-bold text-white shrink-0">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })}

              {chats.length === 0 && (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No active chats available. Add friends or load template!
                </div>
              )}
            </div>

            {/* Simulated Data Trigger */}
            <div className="text-center pt-2">
              <button
                onClick={onClearChats}
                className="text-[10px] text-zinc-500 cursor-pointer hover:text-red-400 underline "
              >
                Reset Chats to Default Template
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CALLS LOGS VIEW */}
        {activeTab === "calls" && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">Recent Dial Session Records</h3>
            
            <div className="space-y-2">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="p-3 bg-zinc-900/30 border border-zinc-850 hover:bg-zinc-900/50 rounded-2xl flex items-center justify-between transition-all"
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <img src={call.callerAvatar} alt="contact" className="w-10 h-10 rounded-xl object-cover border border-zinc-800" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate">{call.callerName}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${call.status === "completed" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {call.status === "completed" ? `Completed • ${call.durationSeconds}s` : "Missed Dial Sequence"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* If call has AI summary, show summary fetch button */}
                    {call.status === "completed" && call.aiSummary && (
                      <button
                        onClick={() => setActiveSummaryCall(call)}
                        className="px-2.5 py-1 text-[9.5px] font-bold rounded-lg bg-orange-950/40 text-orange-400 hover:bg-orange-950/70 border border-orange-500/20 mr-1 shrink-0"
                      >
                        AI Summary
                      </button>
                    )}

                    <button
                      onClick={() => onStartCall(call.type, call.callerName, call.callerAvatar)}
                      className="p-2 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/20 text-emerald-400 rounded-xl transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CONTACTS VIEW */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            {/* Invitation helper */}
            <div className="p-3.5 bg-orange-950/20 border border-orange-500/20 rounded-2xl">
              <h4 className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-orange-400" />
                Invite Friends to Bharat Connect!
              </h4>
              <p className="text-[10px] text-zinc-300 mt-1 leading-normal font-sans">
                Help build India's largest localized calling gateway. Share your custom linkage code to bypass firewall delays directly.
              </p>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  readOnly
                  value="https://bharat.connect.in/invite/ishaan"
                  className="bg-zinc-950 border border-zinc-850 px-2.5 rounded-xl text-[10px] font-mono text-zinc-400 flex-1 h-9 flex items-center focus:outline-none"
                />
                <button
                  onClick={() => alert("Simulated invite link copied to clipboard!")}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] uppercase px-3 rounded-xl transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Friend search/scanner */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search phone number or scanner ID..."
                value={scannedFriend}
                onChange={(e) => setScannedFriend(e.target.value)}
                className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-4 text-xs text-white focus:outline-none focus:border-orange-500/30"
              />
            </div>

            {/* Contacts list */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">My Contacts ({allContactsList.length})</h3>
              
              <div className="space-y-2">
                {allContactsList
                  .filter((c) => c.name.toLowerCase().includes(scannedFriend.toLowerCase()))
                  .map((contact) => (
                    <div
                      key={contact.uid}
                      className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="relative shrink-0">
                          <img src={contact.avatar} alt="buddy" className="w-[42px] h-[42px] rounded-xl object-cover border border-zinc-800" />
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-zinc-950 rounded-full ${
                            contact.online ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"
                          }`} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-semibold text-zinc-200 truncate">{contact.name}</h4>
                            <span className="text-[8px] bg-zinc-800 px-1 text-zinc-400 uppercase tracking-widest font-mono rounded">
                              {contact.online ? "ONLINE" : "OFFLINE"}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5 italic">{contact.status}</p>
                        </div>
                      </div>

                      {/* Call and text quick launching triggers */}
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => onStartCall("video", contact.name, contact.avatar)}
                          className="p-1.5 bg-zinc-850 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-emerald-400"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS VIEW */}
        {activeTab === "settings" && (
          <div className="space-y-5">
            {/* Quick Profile config widget with edit trigger */}
            <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-850 flex items-center gap-3">
              <div 
                onClick={() => {
                  setCustomAvatarUrl(currentUser.avatarUrl);
                  setAvatarEditOpen(true);
                }}
                className="relative group cursor-pointer w-14 h-14 rounded-xl overflow-hidden border border-zinc-800 shrink-0 select-none"
                title="Click to change profile picture"
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt="Me" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" 
                />
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-4 h-4 text-white" />
                  <span className="text-[7px] text-zinc-300 font-bold uppercase mt-0.5 tracking-wider">Change</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-orange-600 rounded-tl-lg p-0.5 shadow-md">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0 leading-normal">
                <input
                  type="text"
                  value={currentUser.displayName}
                  onChange={(e) => onUpdateUser({ ...currentUser, displayName: e.target.value })}
                  className="bg-transparent font-bold text-sm text-zinc-200 focus:outline-none border-b border-transparent focus:border-zinc-700 w-full"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={currentUser.statusMessage}
                  onChange={(e) => onUpdateUser({ ...currentUser, statusMessage: e.target.value })}
                  className="bg-transparent text-[11px] text-zinc-400 mt-0.5 focus:outline-none border-b border-transparent focus:border-zinc-700 w-full"
                  placeholder="Your status message"
                />
              </div>
            </div>

            {/* Quick Language selectors and togglers */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 font-mono">App Customization</h3>

              {/* Subtitles translate config */}
              <div className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-400" />
                    <div>
                      <h4 className="text-xs font-medium text-zinc-200">AI Subtitle Language</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Real-time transcribing translated language</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {LanguagesList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onUpdateUser({ ...currentUser, primaryLanguage: lang.code as Language })}
                      className={`h-9 flex items-center justify-between px-3 rounded-xl border text-[11px] font-sans transition-all ${
                        currentUser.primaryLanguage === lang.code
                          ? "bg-orange-950/20 border-orange-500/40 text-orange-400 font-semibold"
                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:bg-zinc-900"
                      }`}
                    >
                      <span>{lang.flag} {lang.label}</span>
                      <span className="text-[9px] text-zinc-500 font-mono italic">{lang.native}</span>
                    </button>
                    ))}
                </div>
              </div>

              {/* Low bandwidth compression setting direct */}
              <div className="p-3.5 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">Data Saver Mode (Indian optimized)</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-normal max-w-[240px]">
                    Saves packet loads by scaling down WebRTC video capture streams to 350 Kbps.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    id="datasaver-toggle"
                    defaultChecked
                  />
                  <label
                    htmlFor="datasaver-toggle"
                    className="block w-11 h-6 bg-zinc-700 rounded-full cursor-pointer peer-checked:bg-emerald-600 transition-colors after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"
                  />
                </div>
              </div>

              {/* Security parameters */}
              <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                <span className="text-[9px] bg-emerald-600 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                  E2E ENCRYPTION
                </span>
                <p className="text-[10px] text-zinc-300 mt-2.5 leading-relaxed font-sans">
                  Video Calling signaling frames are fully wrapped with WebRTC DTLS security profiles. Keys are refreshed upon call tear-down.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: ADMIN & TELEMETRY VIEW */}
        {activeTab === "admin" && (
          <div className="space-y-4">
            
            {/* System Status widgets */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-2xl leading-normal">
                <span className="text-[9px] font-mono text-zinc-500">BHARAT CPU LOAD</span>
                <h4 className="text-lg font-bold text-zinc-200 mt-1 font-mono tracking-tight">{telemetry.cpuUsage}%</h4>
                <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      telemetry.cpuUsage > 75 ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${telemetry.cpuUsage}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-2xl leading-normal">
                <span className="text-[9px] font-mono text-zinc-500">WEBRTC LATENCY</span>
                <h4 className="text-lg font-bold text-emerald-400 mt-1 font-mono tracking-tight">{telemetry.latencyMs} <span className="text-xs">ms</span></h4>
                <p className="text-[9px] text-zinc-500 mt-2">Packets routed: 100%</p>
              </div>
            </div>

            {/* Simulated Live telemetry SVG Area chart */}
            <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-2xl">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Bandwidth Squeezing Analytics (Simulated 3G/5G train cell)</span>
                <span className="text-[9px] bg-orange-950/60 text-orange-500 font-mono px-1.5 py-0.5 rounded border border-orange-500/20">LIVE</span>
              </div>
              
              {/* Custom SVG Line graph */}
              <div className="h-24 w-full bg-zinc-950/60 rounded-xl relative overflow-hidden p-1 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="#1d1d20" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#1d1d20" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="#1d1d20" strokeWidth="0.5" strokeDasharray="2,2" />

                  {/* Rendered simulated area path */}
                  <path
                    d={`M 0 40 L 0 25 L 15 ${20 + (telemetry.cpuUsage % 5)} L 30 ${15 + (telemetry.cpuUsage % 8)} L 45 ${5 + (telemetry.cpuUsage % 4)} L 60 ${25 + (telemetry.cpuUsage % 10)} L 75 ${15 + (telemetry.cpuUsage % 5)} L 90 20 L 100 ${30 + (telemetry.cpuUsage % 2)} L 100 40 Z`}
                    fill="url(#gradient-area)"
                  />
                  
                  {/* Border line */}
                  <path
                    d={`M 0 25 L 15 ${20 + (telemetry.cpuUsage % 5)} L 30 ${15 + (telemetry.cpuUsage % 8)} L 45 ${5 + (telemetry.cpuUsage % 4)} L 60 ${25 + (telemetry.cpuUsage % 10)} L 75 ${15 + (telemetry.cpuUsage % 5)} L 90 20 L 100 ${30 + (telemetry.cpuUsage % 2)}`}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="absolute bottom-2 left-3 font-mono text-[9px] text-zinc-400">
                  Bitrate Slices: {(telemetry.bandwidthKbps / 1000).toFixed(2)} Mbps
                </div>
              </div>
            </div>

            {/* Admin reported/banned user listing table */}
            <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-2xl">
              <h4 className="text-xs font-semibold text-zinc-300 font-sans mb-3.5 flex items-center justify-between">
                <span>Manage Users & Spam Blocking</span>
                <span className="text-[10px] text-zinc-500 font-mono">Active Session: Admin</span>
              </h4>

              <div className="space-y-2">
                {reportedUsers.map((user) => (
                  <div key={user.uid} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-900">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{user.name}</p>
                      <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1 mt-0.5">
                        {user.reports > 0 ? `⚠️ Reports logged: ${user.reports}` : "Clean record • verified"}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBan(user.uid)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        user.banned
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-950/40 text-red-400 border border-red-500/20 hover:bg-red-950/70"
                      }`}
                    >
                      {user.banned ? "Unban User" : "Ban / Block"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>



      {/* Change Profile Picture Modal */}
      {avatarEditOpen && (
        <div 
          className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-end overflow-hidden animate-fade-in" 
          onClick={() => {
            setAvatarEditOpen(false);
            setAvatarError("");
          }}
        >
          <div 
            className="w-full bg-zinc-900 border-t border-zinc-800 rounded-t-[32px] p-5 pb-8 space-y-4 max-h-[85%] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                  <Camera className="w-4 h-4 text-orange-500" />
                  <span>Update Profile Photo</span>
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Choose a preset, connect a link, or drag a photo.</p>
              </div>
              <button
                onClick={() => {
                  setAvatarEditOpen(false);
                  setAvatarError("");
                }}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {avatarError && (
              <div className="p-2.5 bg-red-950/45 border border-red-200/30 text-red-400 text-[10px] rounded-xl text-center font-medium animate-pulse">
                {avatarError}
              </div>
            )}

            {/* Live Preview & Core stats */}
            <div className="flex items-center gap-4 p-3 bg-zinc-950/40 border border-zinc-850 rounded-2xl">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500/35 relative shrink-0">
                <img 
                  src={customAvatarUrl || currentUser.avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase font-mono bg-orange-950/30 border border-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">
                  Live Preview
                </span>
                <p className="text-xs text-zinc-300 font-bold mt-1.5 truncate">
                  {currentUser.displayName || "User"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {currentUser.statusMessage || "No status set"}
                </p>
              </div>
            </div>

            {/* Option 1: File Dragger / Selector */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Option 1: Upload Image File</h5>
              
              <div 
                className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer relative ${
                  isDraggingAvatar 
                    ? "bg-orange-950/10 border-orange-500/80 scale-[0.99]" 
                    : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950/60"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingAvatar(true);
                }}
                onDragLeave={() => setIsDraggingAvatar(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingAvatar(false);
                  if (e.dataTransfer.files?.[0]) {
                    processAvatarFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      processAvatarFile(e.target.files[0]);
                    }
                  }}
                />
                
                <Upload className="w-6 h-6 text-orange-500/80 mx-auto mb-2" />
                <p className="text-xs font-bold text-zinc-300">Drag & Drop or Click to Select</p>
                <p className="text-[9px] text-zinc-500 mt-1">Supports PNG, JPG, WebP up to 4MB.</p>
              </div>
            </div>

            {/* Option 2: Choose Preset Character */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Option 2: Select Preset</h5>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset, index) => {
                  const isSelected = customAvatarUrl === preset.url;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCustomAvatarUrl(preset.url);
                        onUpdateUser({ ...currentUser, avatarUrl: preset.url });
                        setAvatarError("");
                      }}
                      className="group relative focus:outline-none aspect-square shrink-0"
                    >
                      <div className={`w-full h-full rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected 
                          ? "border-orange-500 scale-95 shadow-md shadow-orange-950/40" 
                          : "border-zinc-800 hover:border-zinc-600"
                      }`}>
                        <img 
                          src={preset.url} 
                          alt={preset.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 bg-orange-600 rounded-full p-0.5 shadow-md z-10">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Option 3: Direct Link Input Url */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Option 3: Use Image Link / URL</h5>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Link2 className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    placeholder="Paste direct URL (https://...)"
                    value={customAvatarUrl.startsWith("data:") ? "" : customAvatarUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomAvatarUrl(val);
                      if (val.trim()) {
                        onUpdateUser({ ...currentUser, avatarUrl: val.trim() });
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl text-xs text-zinc-300 focus:outline-none placeholder:text-zinc-600 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-zinc-800/40 flex justify-end">
              <button
                onClick={() => {
                  setAvatarEditOpen(false);
                  setAvatarError("");
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white rounded-xl transition-colors shadow-lg shadow-orange-950/20 text-center"
              >
                Apply Profile Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Action Call Summary Modal */}
      {activeSummaryCall && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-end" onClick={() => setActiveSummaryCall(null)}>
          <div
            className="w-full bg-zinc-900 border-t border-zinc-800 rounded-t-[34px] px-5 py-6 space-y-4 max-h-[75%] overflow-y-auto select-text shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#f97316]">Gemini 3.5 AI Summarizer</span>
              <button
                onClick={() => setActiveSummaryCall(null)}
                className="text-xs bg-zinc-800 px-3 py-1.5 text-zinc-300 rounded-xl hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
            
            <div className="border border-zinc-800 bg-zinc-950/60 rounded-2xl p-4 text-xs font-sans text-zinc-300 leading-relaxed markdown-body">
              {activeSummaryCall.aiSummary ? (
                <div className="space-y-3 whitespace-pre-line">
                  {activeSummaryCall.aiSummary}
                </div>
              ) : (
                <p className="text-zinc-500">Summary transcript data is unavailable.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Premium Material design bottom navigation bars */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-zinc-900 flex items-center justify-around px-1 z-40 shrink-0 select-none">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-all ${
            activeTab === "chats" ? "text-orange-400 bg-orange-950/15" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 rounded-full w-4 h-4 text-[9px] font-bold text-white flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium font-sans">Chats</span>
        </button>

        <button
          onClick={() => setActiveTab("calls")}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-all ${
            activeTab === "calls" ? "text-orange-400 bg-orange-950/15" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[9px] font-medium font-sans">Calls</span>
        </button>

        <button
          onClick={() => setActiveTab("global")}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-all ${
            activeTab === "global" ? "text-orange-400 bg-orange-950/15" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <div className="relative">
            <Globe className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-orange-500 rounded-full w-2 h-2 animate-ping" />
          </div>
          <span className="text-[9px] font-medium font-sans">Global</span>
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-all ${
            activeTab === "contacts" ? "text-orange-400 bg-orange-950/15" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-medium font-sans">People</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-all ${
            activeTab === "settings" ? "text-orange-400 bg-orange-950/15" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-medium font-sans">Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-2xl transition-all ${
            activeTab === "admin" ? "text-orange-400 bg-orange-950/15" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[9px] font-medium font-sans">Metrics</span>
        </button>
      </div>

    </div>
  );
}
