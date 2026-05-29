import React, { useState } from "react";
import DeviceSimulator from "./components/DeviceSimulator";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import HomeTabs from "./components/HomeTabs";
import ChatDetail from "./components/ChatDetail";
import CallView from "./components/CallView";
import PlayStoreDocs from "./components/PlayStoreDocs";
import { UserProfile, ChatRoom, CallHistory } from "./types";
import { mockInitialChats, mockInitialCalls } from "./data/mockData";
import { Sparkles, Star } from "lucide-react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // State lists for local persistence simulation
  const [chats, setChats] = useState<ChatRoom[]>(mockInitialChats());
  const [calls, setCalls] = useState<CallHistory[]>(mockInitialCalls);
  
  // Navigation pointers
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{
    type: "video" | "voice";
    contactName: string;
    contactAvatar: string;
  } | null>(null);

  // User details modify helper
  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
  };

  // Chats message state updates
  const handleUpdateChatMessages = (chatId: string, updatedMessages: any[]) => {
    setChats((prevChats) =>
      prevChats.map((ch) => {
        if (ch.id !== chatId) return ch;
        // Decrease unread count when message is sending or reading
        return {
          ...ch,
          messages: updatedMessages,
          lastMessageText: updatedMessages[updatedMessages.length - 1]?.text || "",
          lastMessageAt: updatedMessages[updatedMessages.length - 1]?.createdAt || new Date().toISOString(),
          unreadCount: 0,
        };
      })
    );
  };

  const handleClearChats = () => {
    setChats(mockInitialChats());
  };

  // Launch direct dialing triggers
  const handleStartCall = (type: "video" | "voice", contactName: string, contactAvatar: string) => {
    setActiveCall({ type, contactName, contactAvatar });
  };

  // Terminate dial session
  const handleHangupCall = (durationSec: number, summaryText: string) => {
    if (!activeCall) return;

    // Append new logs to Call history
    const completedCall: CallHistory = {
      id: `call-${Date.now()}`,
      hostId: "user-me",
      callerName: activeCall.contactName,
      callerAvatar: activeCall.contactAvatar,
      type: activeCall.type,
      isGroup: false,
      participants: ["user-me"],
      status: durationSec > 0 ? "completed" : "missed",
      startTime: new Date().toISOString(),
      durationSeconds: durationSec,
      aiSummary: summaryText,
    };

    setCalls((prevCalls) => [completedCall, ...prevCalls]);
    setActiveCall(null);
  };

  const selectedChat = chats.find((ch) => ch.id === activeChatId);

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-zinc-950 to-zinc-900 text-zinc-100 flex flex-col justify-between">
      
      {/* Decorative Tri-color top ribbon */}
      <div className="w-full h-1 flex shrink-0">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-emerald-600" />
      </div>

      {/* Top micro landing header */}
      <header className="w-full px-6 py-4 border-b border-zinc-800/60 bg-zinc-950 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-sm text-white border border-orange-500/30">
            BC
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white font-sans">
              Bharat Connect Build Console
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono">
              SWADESHI REAL-TIME VIDEO & AUDIO COMMUNICATOR IN REACT
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sandbox Ports: Operational
          </span>
        </div>
      </header>

      {/* Dual Column Layout: Responsive Smartphone on Left, Documentation Launcher on Right */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Framed Device Simulator */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <DeviceSimulator>
            {showSplash ? (
              <SplashScreen onComplete={() => setShowSplash(false)} />
            ) : !currentUser ? (
              <AuthScreen onLoginSuccess={(prof) => setCurrentUser(prof)} />
            ) : activeCall ? (
              <CallView
                type={activeCall.type}
                contactName={activeCall.contactName}
                contactAvatar={activeCall.contactAvatar}
                onHangup={handleHangupCall}
              />
            ) : selectedChat ? (
              <ChatDetail
                chat={selectedChat}
                currentUser={currentUser}
                onBack={() => setActiveChatId(null)}
                onUpdateChatMessages={handleUpdateChatMessages}
                onStartCall={handleStartCall}
              />
            ) : (
              <HomeTabs
                currentUser={currentUser}
                chats={chats}
                calls={calls}
                onSelectChat={(chatId) => setActiveChatId(chatId)}
                onStartCall={handleStartCall}
                onUpdateUser={handleUpdateUser}
                onClearChats={handleClearChats}
                onAddCallHistory={(newCall) => setCalls((prev) => [newCall, ...prev])}
              />
            )}
          </DeviceSimulator>
        </div>

        {/* Right Column: Premium Startup and APK Build Logs Board */}
        <div className="lg:col-span-7 h-full lg:h-[820px] py-4">
          <PlayStoreDocs />
        </div>

      </main>

      {/* Humble digital India footer info */}
      <footer className="w-full bg-zinc-950 border-t border-zinc-800/60 py-4 text-center text-[10px] text-zinc-650 font-mono tracking-wider shrink-0 select-none">
        BHARAT CONNECT IS POWERED BY WEBRTC, FIRESTORE SECURITY RULES, AND GEMINI 3.5 FLASH • 🇮🇳 DEC 2026.
      </footer>
    </div>
  );
}
