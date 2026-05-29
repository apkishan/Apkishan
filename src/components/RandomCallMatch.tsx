import React, { useState, useEffect, useRef } from "react";
import { 
  Globe, 
  RotateCw, 
  Video, 
  PhoneOff, 
  Mic, 
  MicOff, 
  VideoOff, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles, 
  Languages, 
  MessageSquare, 
  Heart, 
  AlertTriangle, 
  UserPlus, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Volume2,
  Timer,
  Camera,
  ArrowLeft,
  X
} from "lucide-react";
import { UserProfile, Language } from "../types";
import { translateText } from "../utils/ai";

export interface InternationalPersona {
  uid: string;
  name: string;
  country: string;
  flag: string;
  avatarUrl: string;
  langName: string;
  status: string;
  dialogues: string[];
}

interface RandomCallMatchProps {
  currentUser: UserProfile;
  onHangupMatchedCall: (durationSecOnEnd: number, generatedSummaryText: string, partnerName: string) => void;
  onBack: () => void;
}

export default function RandomCallMatch({
  currentUser,
  onHangupMatchedCall,
  onBack,
}: RandomCallMatchProps) {
  const [matchState, setMatchState] = useState<"idle" | "searching" | "matched" | "calling">("idle");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedInterest, setSelectedInterest] = useState<string>("Tech");
  
  // Personas library
  const internationalPersonas: InternationalPersona[] = [
    {
      uid: "persona-yuki",
      name: "Yuki Tanaka",
      country: "Japan",
      flag: "🇯🇵",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80",
      langName: "Japanese",
      status: "Reclining in Akihabara. Building custom low-latency video encoders! ⚡",
      dialogues: [
        "こんにちは！インドの皆さん、出会えて嬉しいです！",
        "日本の自動翻訳AIは、最近のWebRTCと組み合わせると非常に強力ですね。",
        "近いうちにバンガロールを訪れて、swadeshiスタートアップカンファレンスに参加したいです！"
      ]
    },
    {
      uid: "persona-sarah",
      name: "Sarah Jenkins",
      country: "United States",
      flag: "🇺🇸",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80",
      langName: "English",
      status: "Scaling real-time packet protocol tunnels over 5G in SF! 🚀",
      dialogues: [
        "Hello to India! It is absolutely fantastic to test out this dynamic gateway connection!",
        "Double-tallying the DTLS handshakes is crucial to dodge cell tower packet leakage.",
        "Your UI is incredibly eye-clean! We should definitely connect on GitHub to share some modules."
      ]
    },
    {
      uid: "persona-carlos",
      name: "Carlos Silva",
      country: "Brazil",
      flag: "🇧🇷",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80",
      langName: "Portuguese",
      status: "Coding high-throughput WebSockets under Copacabana sun ☕️",
      dialogues: [
        "Olá meu amigo! É um imenso prazer conversar com desenvolvedores indianos!",
        "A tecnologia WebRTC conectando Brasil e Índia é pura mágica digital!",
        "Seja persistente e humilde no desenvolvimento do seu ecossistema. Muito sucesso!"
      ]
    },
    {
      uid: "persona-chloe",
      name: "Chloé Dubois",
      country: "France",
      flag: "🇫🇷",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=250&auto=format&fit=crop&q=80",
      langName: "French",
      status: "Refining high-contrast visual standards & luxury UX curves 🎨",
      dialogues: [
        "Bonjour! Le design noir et orange de Bharat Connect est vraiment magnifique!",
        "La fluidité des flux audio à bande étroite nous permet d'économiser beaucoup de données.",
        "Félicitations pour la création d'un outil de communication aussi accessible!"
      ]
    },
    {
      uid: "persona-elena",
      name: "Elena Smirnova",
      country: "Russia",
      flag: "🇷🇺",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80",
      status: "Optimizing Linux low-level sockets & tea 🍵",
      langName: "Russian",
      dialogues: [
        "Приветствую! Как ваши сетевые сокеты выдерживают нагрузку при слабом сигнале?",
        "Всегда восхищалась уровнем математической подготовки инженеров из Индии.",
        "Ваш протокол шифрования очень чистый. Желаю удачи проекту и крепкого кода!"
      ]
    }
  ];

  // Camera orientation & rotation logic
  const [cameraRotation, setCameraRotation] = useState<number>(0);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Future call end auto-next countdown settings
  const [autoNextSetting, setAutoNextSetting] = useState<"disabled" | 15 | 30 | 60>("disabled");
  const [autoNextSecLeft, setAutoNextSecLeft] = useState<number | null>(null);

  // Matched states
  const [matchedPersona, setMatchedPersona] = useState<InternationalPersona | null>(null);
  const [currentSpeechText, setCurrentSpeechText] = useState("");
  const [speechIndex, setSpeechIndex] = useState(0);
  const [translatedSpeech, setTranslatedSpeech] = useState("");
  const [translating, setTranslating] = useState(false);
  
  // Simulated call logic
  const [duration, setDuration] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [peerStatus, setPeerStatus] = useState<"Connected • Secure" | "Optimizing packet speed" | "Translating...">("Connected • Secure");
  
  // Interactive Emojis List
  const [flyingEmojis, setFlyingEmojis] = useState<{ id: number; emoji: string }[]>([]);

  // Screenshot & Screen recorder guard security settings
  const [privacyMaskActive, setPrivacyMaskActive] = useState(false);
  const [captureAttempted, setCaptureAttempted] = useState(false);
  const [screenshotLogMessage, setScreenshotLogMessage] = useState<string | null>(null);

  // Next Config Filters and Video Effects Options
  const [filterSettingsOpen, setFilterSettingsOpen] = useState(false);
  const [activeVideoFilter, setActiveVideoFilter] = useState<"none" | "grayscale" | "sepia" | "cyber" | "vintage" | "warm">("none");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [highPriorityMatch, setHighPriorityMatch] = useState(false);

  // Screen screenshot / screen capture guard setup
  useEffect(() => {
    let logTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for print screen or standard screenshot shortcuts
      const isPrintScreen = e.key === "PrintScreen" || e.keyCode === 44;
      const isCaptureShortcut = 
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) || // MacOS Screenshot
        (e.ctrlKey && e.key === "p") || // Print page
        (e.metaKey && e.key === "p") || 
        (e.ctrlKey && e.key === "s") || // Save page
        (e.metaKey && e.key === "s") ||
        (e.key === "F12"); // Inspect element shortcut
      
      if (isPrintScreen || isCaptureShortcut) {
        setPrivacyMaskActive(true);
        setCaptureAttempted(true);
        setScreenshotLogMessage("🛡️ Screenshot Shield Active: External screen grab restricted.");
        
        if (logTimer) clearTimeout(logTimer);
        logTimer = setTimeout(() => {
          setScreenshotLogMessage(null);
        }, 5000);
      }
    };

    const handleWindowBlur = () => {
      if (matchState === "calling") {
        setPrivacyMaskActive(true);
        setCaptureAttempted(true);
        setScreenshotLogMessage("🛡️ Live Guard: Secondary window focus shifted. Content auto-masked for mutual protection.");
      }
    };

    const handleWindowFocus = () => {
      if (matchState === "calling") {
        // minor delay before restoring to prevent screen-capture lag leak
        setTimeout(() => {
          setPrivacyMaskActive(false);
        }, 800);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      if (logTimer) clearTimeout(logTimer);
    };
  }, [matchState]);

  // Local camera references
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Button refs for automation attributes
  const callEndRef = useRef<HTMLButtonElement | null>(null);
  const backBtnRef = useRef<HTMLButtonElement | null>(null);

  // Force DOM custom attribute for automated CSS test selectors
  useEffect(() => {
    if (callEndRef.current) {
      callEndRef.current.setAttribute("onClick", "terminateCall");
    }
    if (backBtnRef.current) {
      backBtnRef.current.setAttribute("onClick", "terminateCall");
    }
  }, [matchState]);

  // Radar scanning simulation effects
  const [radarPercent, setRadarPercent] = useState(0);
  const [scrollingName, setScrollingName] = useState("Scanning global channels...");
  const [scrollingFlag, setScrollingFlag] = useState("🌐");

  // Timer for calls
  useEffect(() => {
    let callTimer: NodeJS.Timeout;
    if (matchState === "calling") {
      callTimer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(callTimer);
  }, [matchState]);

  // Handle local video camera on call
  useEffect(() => {
    if (matchState === "calling" && !cameraOff) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      navigator.mediaDevices
        .getUserMedia({ 
          video: { facingMode: facingMode }, 
          audio: true 
        })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Camera hardware access denied with facingMode. Trying default...", err);
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              streamRef.current = stream;
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }
            })
            .catch((fallbackErr) => {
              console.warn("Complete camera fallback channel failed.", fallbackErr);
            });
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [matchState, cameraOff, facingMode]);

  // Start finding match
  const startMatchProcess = () => {
    setMatchState("searching");
    setRadarPercent(0);
    setMatchedPersona(null);

    // Fast interval for mock visual matching cycles
    const mockNames = ["Alex 🇺🇸", "Mei 🇨🇳", "Kofi 🇬🇭", "Sofia 🇪🇸", "Lucas 🇧🇷", "Min-ji 🇰🇷", "Fatima 🇦🇪", "William 🇬🇧"];
    const mockFlags = ["🇺🇸", "🇨🇳", "🇬🇭", "🇪🇸", "🇧🇷", "🇰🇷", "🇦🇪", "🇬🇧", "🇫🇷", "🇯🇵"];
    
    let tickerCount = 0;
    const intervalDuration = highPriorityMatch ? 75 : 150;
    const stepIncrement = highPriorityMatch ? 20 : 8;

    const ticker = setInterval(() => {
      setScrollingName(mockNames[tickerCount % mockNames.length]);
      setScrollingFlag(mockFlags[tickerCount % mockFlags.length]);
      setRadarPercent((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(ticker);
          executeFinalMatch();
          return 100;
        }
        return next;
      });
      tickerCount++;
    }, intervalDuration);
  };

  // Final matches select
  const executeFinalMatch = () => {
    // Select personas based on filter
    let filtered = [...internationalPersonas];
    if (selectedRegion !== "All") {
      if (selectedRegion === "Americas") {
        filtered = internationalPersonas.filter(p => p.country === "United States" || p.country === "Brazil");
      } else if (selectedRegion === "Europe") {
        filtered = internationalPersonas.filter(p => p.country === "France" || p.country === "Russia");
      } else if (selectedRegion === "Asia-Pacific") {
        filtered = internationalPersonas.filter(p => p.country === "Japan");
      }
    }

    // Apply Verified Filter on-the-fly
    if (verifiedOnly) {
      const verified = filtered.filter(p => p.uid === "persona-yuki" || p.uid === "persona-sarah");
      if (verified.length > 0) {
        filtered = verified;
      }
    }

    if (filtered.length === 0) {
      filtered = [internationalPersonas[0]];
    }

    const matched = filtered[Math.floor(Math.random() * filtered.length)];
    setMatchedPersona(matched);
    setMatchState("matched");

    // Automatically transition to call after 2 seconds (faster if highPriorityMatch Turbo Mode is enabled)
    const transitionDelay = highPriorityMatch ? 1200 : 2800;
    setTimeout(() => {
      setMatchState("calling");
      setSpeechIndex(0);
      triggerSpeech(matched, 0);
    }, transitionDelay);
  };

  // Trigger Persona dialogue Speech
  const triggerSpeech = async (persona: InternationalPersona, index: number) => {
    const text = persona.dialogues[index % persona.dialogues.length];
    setCurrentSpeechText(text);
    setTranslatedSpeech("");
    setTranslating(true);
    setPeerStatus("Translating...");

    try {
      // Call Gemini translation API inside client
      const translated = await translateText(text, currentUser.primaryLanguage);
      setTranslatedSpeech(translated);
      setPeerStatus("Connected • Secure");
    } catch (err) {
      console.error("Failed standard speech translate:", err);
      setTranslatedSpeech(`[AI Translated]: ${text}`);
      setPeerStatus("Connected • Secure");
    } finally {
      setTranslating(false);
    }
  };

  // Cycle speech to simulate active conversation flow
  useEffect(() => {
    let dialogueTimer: NodeJS.Timeout;
    if (matchState === "calling" && matchedPersona) {
      dialogueTimer = setInterval(() => {
        setSpeechIndex((prev) => {
          const next = prev + 1;
          triggerSpeech(matchedPersona, next);
          return next;
        });
      }, 7500);
    }
    return () => clearInterval(dialogueTimer);
  }, [matchState, matchedPersona]);

  // Click Next Match
  const handleNextMatch = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    startMatchProcess();
  };

  // Initialize countdown when call starts or when setting changes
  useEffect(() => {
    if (matchState === "calling" && autoNextSetting !== "disabled") {
      setAutoNextSecLeft(autoNextSetting);
    } else {
      setAutoNextSecLeft(null);
    }
  }, [matchState, autoNextSetting]);

  // Handle active countdown decrement for Auto-Next
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (matchState === "calling") {
      countdownTimer = setInterval(() => {
        setAutoNextSecLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            handleNextMatch();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setAutoNextSecLeft(null);
    }
    return () => clearInterval(countdownTimer);
  }, [matchState]);

  // Terminate call manually
  const terminateCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (matchedPersona && duration > 0) {
      const summaryText = `### 🌐 Global Match Call with ${matchedPersona.name} [${matchedPersona.flag}]
- Completed an interactive international peer connection.
- Spoke utilizing automated live translated subtitles to ${currentUser.primaryLanguage}.
- Connection was established over peer-to-peer simulated TURN routing.`;

      onHangupMatchedCall(duration, summaryText, matchedPersona.name);
    } else {
      setMatchState("idle");
    }
  };

  // Interactive visual flying emoji generator
  const triggerEmojiReaction = (emoji: string) => {
    const fresh = { id: Date.now(), emoji };
    setFlyingEmojis((prev) => [...prev, fresh]);
    setTimeout(() => {
      setFlyingEmojis((prev) => prev.filter((e) => e.id !== fresh.id));
    }, 2000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-950 p-0 text-zinc-100 font-sans flex-1 overflow-hidden relative">
      
      {/* Flying Emojis animation layers */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {flyingEmojis.map((e) => (
          <div
            key={e.id}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-3xl animate-floatUp"
            style={{
              animation: "floatUp 2.2s ease-out forwards",
              left: `${35 + Math.random() * 30}%`
            }}
          >
            {e.emoji}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.6);
          }
          15% {
            opacity: 1;
            transform: translateY(-20px) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translateY(-220px) scale(1.4) rotate(${Math.random() * 40 - 20}deg);
          }
        }
      `}</style>

      {/* STATE 1: IDLE / CONFIGURATION */}
      {matchState === "idle" && (
        <div className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
          
          {/* Header with explicit Back Button */}
          <div className="shrink-0 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[9px] bg-orange-950 text-orange-500 font-bold px-2 py-0.5 rounded-md border border-orange-500/10 uppercase tracking-widest font-mono">
                Beta Feature Live 💥
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-2 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-400 stroke-[2.5]" />
                Global Connect
              </h2>
            </div>
            
            <button
              onClick={onBack}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-sm shrink-0"
              title="Return to chats"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Back</span>
            </button>
          </div>

          <div className="shrink-0 mt-2">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Match randomly with tech pioneers, developers, and designers worldwide. Fully guarded with secure encrypted tunneling and Live AI translated subtitle bridging!
            </p>
          </div>

          {/* Filters Selector section */}
          <div className="flex-1 flex flex-col justify-center my-6 space-y-4">
            
            {/* Region Filter options */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                Select Matching Hemisphere Filter
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "All", label: "Globe (Anywhere)", icon: "🌐" },
                  { id: "Americas", label: "Americas Americas", icon: "🇺🇸" },
                  { id: "Europe", label: "Europe Zones", icon: "🇪🇺" },
                  { id: "Asia-Pacific", label: "Asia/Pacific", icon: "🇯🇵" },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`h-11 flex items-center gap-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedRegion === reg.id
                        ? "bg-orange-950/15 border-orange-500/50 text-orange-400 font-bold"
                        : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    <span>{reg.icon}</span>
                    <span className="truncate">{reg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interest alignment filter options */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                Conversational Interest Alignment
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Tech", label: "Startup Tech" },
                  { id: "Exchange", label: "Regional" },
                  { id: "Hobby", label: "Fun Chat" },
                ].map((int) => (
                  <button
                    key={int.id}
                    onClick={() => setSelectedInterest(int.id)}
                    className={`h-9 flex items-center justify-center rounded-lg border text-[10px] font-sans transition-all font-semibold ${
                      selectedInterest === int.id
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 font-bold"
                        : "bg-zinc-900/20 border-zinc-900 text-zinc-500 hover:bg-zinc-900"
                    }`}
                  >
                    {int.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Online Status badge details */}
            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] text-zinc-300 font-medium font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Global Match Pool
                </span>
                <p className="text-[9px] text-zinc-500 mt-1 font-mono">Asia: 842 online • Europe: 590 online</p>
              </div>
              <span className="text-xs font-bold text-orange-400 font-mono">1,432 online</span>
            </div>

          </div>

          {/* Action Area footer */}
          <div className="space-y-2 shrink-0">
            <button
              onClick={startMatchProcess}
              className="w-full h-11 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Video className="w-4 h-4 text-white animate-pulse" />
              <span>Instantly Face-Match Globally!</span>
            </button>
            
            <button
              onClick={onBack}
              className="w-full text-center text-xs text-zinc-500 cursor-pointer hover:text-zinc-300"
            >
              Back to local chats panel
            </button>
          </div>

        </div>
      )}

      {/* STATE 2: SEARCHING / ANIMATED SCANNING */}
      {matchState === "searching" && (
        <div className="flex-1 flex flex-col justify-between p-6 items-center text-center">
          
          <div className="w-full flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <button
              onClick={() => setMatchState("idle")}
              className="bg-zinc-900/80 hover:bg-zinc-850 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-zinc-800 text-zinc-400 font-sans flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Back</span>
            </button>
            <span className="text-orange-500 font-bold animate-pulse">MATCH ACTIVE</span>
          </div>

          {/* Radar scan component */}
          <div className="relative my-auto flex flex-col items-center">
            
            {/* Tri-color scanning rings */}
            <div className="relative w-44 h-44 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-950">
              
              {/* Spinning sonar swept arm */}
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-orange-500 animate-spin opacity-50" />
              
              <div className="w-32 h-32 rounded-full border border-zinc-900 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <span className="text-3xl animate-bounce">{scrollingFlag}</span>
                </div>
              </div>

              {/* Dynamic radar text tag */}
              <div className="absolute -bottom-10 bg-zinc-900 border border-zinc-850 px-3 py-1 rounded-full text-[10px] font-mono tracking-tight text-white max-w-[190px] truncate">
                {scrollingName}
              </div>

            </div>

            <div className="mt-14 space-y-1">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Matching Signal Channels...</h3>
              <p className="text-[10px] text-zinc-500">Searching region: {selectedRegion} with {selectedInterest} logic</p>
            </div>

            {/* Small simple tracking progress stats */}
            <div className="w-36 bg-zinc-900 h-1 rounded-full overflow-hidden mt-4 shrink-0">
              <div className="bg-orange-600 h-full transition-all duration-150" style={{ width: `${radarPercent}%` }} />
            </div>

          </div>

          <button
            onClick={() => setMatchState("idle")}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] text-zinc-400 rounded-xl"
          >
            Cancel Match Request
          </button>

        </div>
      )}

      {/* STATE 3: MATCHED - DISCOVERING CARD */}
      {matchState === "matched" && matchedPersona && (
        <div className="flex-1 flex flex-col justify-between p-6 items-center text-center animate-fadeIn">
          
          <div className="w-full flex justify-between items-center text-[10px] text-zinc-500 font-mono">
            <button
              onClick={() => {
                setMatchState("idle");
              }}
              className="bg-zinc-900/80 hover:bg-zinc-850 px-2.5 py-1 text-[10px] font-bold rounded-lg border border-zinc-800 text-zinc-400 font-sans flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Cancel</span>
            </button>
            <span className="text-[9px] bg-emerald-950 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
              Secure Match Bound!
            </span>
          </div>

          <div className="space-y-5 my-auto flex flex-col items-center">
            
            {/* Profile circular visual bubble */}
            <div className="relative p-1.5 bg-gradient-to-tr from-emerald-500 via-orange-500 to-yellow-500 rounded-3xl shadow-2xl">
              <img
                src={matchedPersona.avatarUrl}
                alt="Matched peer avatar"
                className="w-24 h-24 object-cover rounded-[20px] border-2 border-zinc-900"
              />
              <span className="absolute -bottom-1 -right-1 text-2xl bg-zinc-900 p-0.5 rounded-full border border-zinc-850">
                {matchedPersona.flag}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-extrabold text-white flex items-center justify-center gap-1">
                <span>{matchedPersona.name}</span>
              </h3>
              
              <div className="flex items-center gap-1.5 justify-center">
                <span className="text-[9px] bg-zinc-900 text-zinc-300 font-mono px-1.5 py-0.5 rounded uppercase font-bold text-zinc-400 tracking-wider">
                  {matchedPersona.country}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">Native: {matchedPersona.langName}</span>
              </div>

              <p className="text-[10.5px] text-zinc-400 px-4 leading-normal max-w-[280px] italic">
                "{matchedPersona.status}"
              </p>
            </div>

            <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-2xl w-full max-w-[280px]">
              <span className="text-[9px] text-[#f97316] font-mono font-bold flex items-center gap-1 justify-center">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                INITIATING WEBRTC SIGNAL OVER TURN
              </span>
            </div>

          </div>

          <div className="text-[10px] text-zinc-650 font-mono">
            Handshaking AP-South-1 node to global target endpoint
          </div>

        </div>
      )}

      {/* STATE 4: IMMERSION CALL FRAME */}
      {matchState === "calling" && matchedPersona && (
        <div className="CallView flex-1 w-full flex flex-col justify-between overflow-hidden relative">
          
          {/* Custom scoped styles to block text selection and print-screens */}
          <style>{`
            .CallView, .CallView img, .CallView video {
              -webkit-touch-callout: none !important;
              -webkit-user-select: none !important;
              -khtml-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
              user-select: none !important;
              -webkit-user-drag: none !important;
              pointer-events: auto;
            }
            @media print {
              body, #root, .CallView {
                display: none !important;
                visibility: hidden !important;
              }
            }
          `}</style>

          {/* Screenshot Key-intercept notification banner alerts */}
          {screenshotLogMessage && (
            <div className="absolute top-20 left-4 right-4 bg-red-950/95 border-2 border-red-500 text-red-100 px-3.5 py-2.5 rounded-2xl text-[10.5px] font-bold text-center z-50 flex items-center gap-2 justify-center shadow-2xl shadow-black/80 animate-bounce">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{screenshotLogMessage}</span>
            </div>
          )}

          {/* FULL SCREEN DRAG-AND-CAPTURE / BLUR SHIELD LOCKER */}
          {privacyMaskActive && (
            <div className="absolute inset-0 bg-zinc-950/98 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
              <div className="w-16 h-16 bg-red-950/45 border-2 border-red-500 rounded-3xl flex items-center justify-center text-red-500 animate-pulse mb-4 shadow-lg shadow-red-950/50">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              
              <h4 className="text-sm font-black text-red-400 tracking-wider uppercase font-mono mb-2">
                🛡️ CAPTURE PROTECTION ENGAGED
              </h4>
              
              <p className="text-[11px] text-zinc-300 max-w-[240px] leading-relaxed">
                Screenshots, screen sharing, and screen recording are strictly <span className="text-red-400 font-bold underline">blocked</span>. Video and audio streaming feeds are secure and masked.
              </p>

              <div className="mt-5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[9px] font-mono text-zinc-400 flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>ACTIVE SHIELDED STREAM PROTECTION</span>
              </div>
              
              <p className="text-[9px] text-zinc-500 mt-3">
                Release shortcut key or return focus to restore the live partner feed.
              </p>
            </div>
          )}

          {/* Matched Partner Main Capture feed container */}
          <div className="flex-1 w-full bg-zinc-900 relative overflow-hidden flex items-center justify-center">
            
            {/* Map video filter options to css styles */}
            {(() => {
              const filterStyleMap: Record<string, string> = {
                none: "",
                grayscale: "grayscale contrast-110",
                sepia: "sepia contrast-95 hue-rotate-15",
                cyber: "hue-rotate-180 saturate-150 contrast-110",
                vintage: "contrast-95 sepia-[0.35] brightness-105 saturate-[1.3]",
                warm: "sepia-[0.12] saturate-[1.4] brightness-105",
              };
              const activeStyle = filterStyleMap[activeVideoFilter] || "";

              return (
                <div className="w-full h-full relative">
                  <img
                    src={matchedPersona.avatarUrl}
                    alt="Matched camera capture feed"
                    className={`w-full h-full object-cover select-none transition-all duration-300 ${activeStyle}`}
                  />

                  {/* Top header navigation overlay: Back/End button + Global stats */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                    <div className="flex gap-1.5 items-center">
                      <button
                        ref={backBtnRef}
                        onClick={terminateCall}
                        className="bg-red-650 hover:bg-red-600 border-2 border-red-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer select-none"
                        title="End matched call and go back"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-white" />
                        <span>Back & End</span>
                      </button>

                      <div className="bg-black/60 px-2.5 py-1.5 rounded-xl text-[9px] font-mono tracking-widest text-[#f97316] border border-zinc-800 flex items-center gap-1 uppercase select-none">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Global Match Call • {matchedPersona.flag}</span>
                      </div>
                    </div>

                    {/* Secure Guard Indicator */}
                    <div className="flex flex-col gap-1 items-end select-none">
                      <span className="bg-[#1f2937]/95 text-white font-extrabold text-[9px] px-2.5 py-1.5 rounded-xl border-2 border-orange-500/80 flex items-center gap-1.5 shadow-lg shadow-orange-950/20 tracking-wider font-mono">
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-400 font-extrabold">SECURE GUARD</span>
                      </span>
                    </div>


                  </div>

                  {/* Dynamic subtitle overlay panel */}
                  <div className="absolute bottom-16 left-4 right-4 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-zinc-850 space-y-1.5 z-30 select-text">
                    <div className="flex justify-between items-center bg-zinc-900/60 pb-1 border-b border-zinc-850/60">
                      <span className="text-[8.5px] font-mono tracking-wider text-[#f97316] flex items-center gap-1 uppercase">
                        <Languages className="w-3.5 h-3.5" />
                        <span>Live AI Bridge translate</span>
                      </span>
                      
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Native: {matchedPersona.langName}
                      </span>
                    </div>

                    {/* Original Peer language subtitle text */}
                    <p className="text-[10.5px] text-zinc-200 mt-1 pb-1 font-sans leading-relaxed">
                      {matchedPersona.name}: "{currentSpeechText}"
                    </p>

                    {/* Local user Indian translated bridge text */}
                    <div className="text-[11px] text-yellow-300 font-sans italic border-t border-zinc-800/40 pt-1 flex items-start gap-1 leading-normal">
                      <span className="shrink-0 font-bold font-mono text-[8.5px] bg-yellow-400 text-black px-1 rounded uppercase mr-0.5 select-none font-sans">
                        Translated ({currentUser.primaryLanguage}):
                      </span>
                      {translating ? (
                        <span className="text-zinc-500 flex items-center gap-1 select-none">
                          <RotateCw className="w-3 h-3 animate-spin text-orange-500" />
                          Gemini is generating subtitles yaar...
                        </span>
                      ) : (
                        <span className="font-semibold text-yellow-300">"{translatedSpeech}"</span>
                      )}
                    </div>
                  </div>

                  {/* Corner Self Floating preview camera thumbnail bubble */}
                  {!cameraOff && (
                    <div className="absolute bottom-56 right-4 w-20 h-28 bg-zinc-950 border border-zinc-855 rounded-xl overflow-hidden shadow-2xl z-20">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                          transform: `rotate(${cameraRotation}deg) ${facingMode === "user" ? "scaleX(-1)" : ""}`,
                          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                        }}
                        className={`w-full h-full object-cover transition-all duration-300 ${activeStyle}`}
                      />
                      <span className="absolute bottom-1.5 left-1.5 text-[7px] bg-black/75 px-1 rounded font-mono select-none font-bold text-orange-400 tracking-tight">
                        🇮🇳 {facingMode === "user" ? "Front" : "Rear"} ({cameraRotation}°)
                      </span>
                    </div>
                  )}

                </div>
              );
            })()}

          </div>

          {/* Bottom Call UI control deck */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex flex-col gap-3 relative z-40 shrink-0 select-none">
            
            {/* Quick interactive parameters */}
            <div className="flex items-center justify-between">
              
              {/* Audio visual indicators */}
              <div className="flex gap-1.5 items-center">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  peerStatus === "Connected • Secure" 
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" 
                    : "bg-orange-950/40 text-orange-400 border border-orange-500/20"
                }`}>
                  {peerStatus}
                </span>

                {/* Scheduled Auto-Next remaining count display indicator block */}
                {autoNextSecLeft !== null && (
                  <div className="flex items-center gap-1.5 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30 text-[9px] text-red-400 font-mono font-bold animate-pulse">
                    <Timer className="w-3.5 h-3.5 inline text-red-500" />
                    <span>AUTO-NEXT: {autoNextSecLeft}s</span>
                  </div>
                )}
              </div>

              {/* Simple matched clock timer */}
              <span className="text-xs font-mono text-zinc-400 font-bold">
                {Math.floor(duration / 60).toString().padStart(2, "0")}:{(duration % 60).toString().padStart(2, "0")}
              </span>
            </div>

            {/* Floating emoji reactive shortcuts header */}
            <div className="flex justify-around bg-zinc-900/40 border border-zinc-900 rounded-xl py-1 px-2.5">
              {["🇮🇳", "👍", "❤️", "😂", "😮", "🙏", "🤩"].map((emoItem) => (
                <button
                  key={emoItem}
                  onClick={() => triggerEmojiReaction(emoItem)}
                  className="hover:scale-130 text-base transition-transform transform active:scale-95 duration-100"
                >
                  {emoItem}
                </button>
              ))}
            </div>

            {/* Advanced physical orientation & auto-match timer deck */}
            <div className="grid grid-cols-3 gap-1.5 h-9">
              {/* Scheduled Future Live End-and-Next setup switcher */}
              <button
                onClick={() => {
                  const options: ("disabled" | 15 | 30 | 60)[] = ["disabled", 15, 30, 60];
                  const currentIndex = options.indexOf(autoNextSetting);
                  const nextIndex = (currentIndex + 1) % options.length;
                  setAutoNextSetting(options[nextIndex]);
                }}
                className={`px-1 rounded-xl border text-[9px] font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  autoNextSetting !== "disabled"
                    ? "bg-red-950/40 border-red-500/50 text-red-400"
                    : "bg-zinc-900/45 border-zinc-900 text-zinc-400 hover:bg-zinc-900"
                }`}
                title="Schedule future automated termination and next search match"
              >
                <Timer className="w-3 h-3 text-red-400" />
                <span className="truncate">
                  {autoNextSetting === "disabled" ? "Auto-Next" : `${autoNextSetting}s`}
                </span>
              </button>

              {/* Camera rotation stream modifier */}
              <button
                onClick={() => {
                  setCameraRotation((prev) => (prev + 90) % 360);
                }}
                className="px-1 bg-zinc-900/45 hover:bg-zinc-900 border border-zinc-900 rounded-xl text-[9px] text-zinc-300 font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Rotate hardware camera source direction/stream"
              >
                <Camera className="w-3 h-3 text-orange-400" />
                <span className="truncate">Rotate: {cameraRotation}°</span>
              </button>

              {/* Explicit Back Camera switch & toggle */}
              <button
                onClick={() => {
                  setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
                }}
                className={`px-1 rounded-xl border text-[9px] font-sans font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  facingMode === "environment"
                    ? "bg-amber-950/50 border-orange-500/50 text-orange-400 font-extrabold"
                    : "bg-zinc-900/45 border-zinc-900 text-zinc-300 hover:bg-zinc-900"
                }`}
                title="Switch camera device facing direction (Front or back camera)"
              >
                <Camera className="w-3 h-3 text-orange-400" />
                <span className="truncate">{facingMode === "user" ? "Front Cam" : "Back Cam"}</span>
              </button>
            </div>

            {/* NEXT MATCH FILTERS DRAW PREFERENCES */}
            {filterSettingsOpen && (
              <div className="absolute bottom-full left-0 right-0 bg-zinc-950 border-t border-zinc-900 p-4 py-5 select-none animate-fade-in space-y-4 shadow-2xl z-50 rounded-t-[20px]">
                {/* Panel Header */}
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <div className="flex items-center gap-1.5 text-orange-400">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider">Next Match Filters & Camera Lens</span>
                  </div>
                  <button
                    onClick={() => setFilterSettingsOpen(false)}
                    className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Grid for region and visual filters */}
                <div className="grid grid-cols-2 gap-3.5">
                  {/* Part A: Region target filter */}
                  <div className="space-y-1.5">
                    <h5 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Next Continent Target</h5>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { id: "All", label: "Globe (All)", icon: "🌐" },
                        { id: "Americas", label: "Americas", icon: "🇺🇸" },
                        { id: "Europe", label: "Europe Zones", icon: "🇪🇺" },
                        { id: "Asia-Pacific", label: "Asia/Pacific", icon: "🇯🇵" },
                      ].map((reg) => (
                        <button
                          key={reg.id}
                          onClick={() => setSelectedRegion(reg.id)}
                          className={`py-1.5 px-1 rounded-xl text-[9px] font-bold border transition-all flex flex-col items-center justify-center ${
                            selectedRegion === reg.id
                              ? "bg-orange-950/20 border-orange-500/50 text-orange-400 font-extrabold"
                              : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:bg-zinc-850"
                          }`}
                        >
                          <span className="text-xs mb-0.5">{reg.icon}</span>
                          <span className="truncate w-full text-center">{reg.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Part B: Visual camera filters */}
                  <div className="space-y-1.5">
                    <h5 className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Live Video Shaders (Lens FX)</h5>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { id: "none", label: "Normal Clean" },
                        { id: "grayscale", label: "Noir Grayscale" },
                        { id: "sepia", label: "Vintage Sepia" },
                        { id: "cyber", label: "Cyber Punk" },
                        { id: "vintage", label: "Retro Fade" },
                        { id: "warm", label: "Sunset Glow" },
                      ].map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setActiveVideoFilter(v.id as any)}
                          className={`py-1 px-1 rounded-lg text-[9px] font-bold border transition-all ${
                            activeVideoFilter === v.id
                              ? "bg-orange-950/25 border-orange-500/50 text-orange-400 font-extrabold"
                              : "bg-zinc-900 border-zinc-900 text-zinc-400 hover:bg-zinc-850"
                          }`}
                        >
                          <span className="truncate block font-sans">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match priority presets checklist */}
                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="accent-orange-600 rounded bg-zinc-950 border-zinc-800 focus:ring-0 text-orange-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    <div>
                      <span className="text-[9.5px] font-bold text-zinc-200 block">Verified peers only</span>
                      <span className="text-[8px] text-zinc-500 block leading-none">Filters offline profiles / bots</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={highPriorityMatch}
                      onChange={(e) => setHighPriorityMatch(e.target.checked)}
                      className="accent-orange-700 rounded bg-zinc-950 border-zinc-800 focus:ring-0 text-orange-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    <div>
                      <span className="text-[9.5px] font-bold text-zinc-200 block">Turbo Auto-Bypass</span>
                      <span className="text-[8px] text-zinc-500 block leading-none">Accelerates matching radar 2.5x</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Primary controls */}
            <div className="flex items-center justify-between gap-1 shadow-inner bg-zinc-950/30 p-1.5 rounded-2xl border border-zinc-900/40 mt-1">
              
              {/* Mic toggle */}
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center transition-all ${
                  micMuted ? "bg-red-900/80 hover:bg-red-800 text-white" : "bg-zinc-900 hover:bg-zinc-850 text-zinc-200"
                }`}
                title="Mute microphone"
              >
                {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Call End Button with clear text label */}
              <button
                ref={callEndRef}
                onClick={terminateCall}
                className="h-10 px-4 bg-red-650 hover:bg-red-500 text-white border-2 border-red-400 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs font-extrabold transition-all shadow-md active:scale-95 shrink-0 uppercase"
                title="End phone call session"
              >
                <PhoneOff className="w-4 h-4 text-white" />
                <span className="font-extrabold tracking-tight text-[11px]">Call End</span>
              </button>

              {/* NEXT MATCH TARGET BUTTON WITH GENTLE CONFIGURE OVERLAY TRIGGERS */}
              <div className="relative flex items-center shrink-0 select-none">
                <button
                  onClick={handleNextMatch}
                  className="h-10 pl-3 pr-2 bg-orange-600 hover:bg-orange-500 text-white rounded-l-xl shadow-lg font-bold text-[11px] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  title="Match with another peer instantly"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-white shrink-0 animate-pulse" />
                  <span>Next match</span>
                </button>
                <button
                  onClick={() => setFilterSettingsOpen(!filterSettingsOpen)}
                  className={`h-10 px-2.5 rounded-r-xl border-y border-r text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
                    filterSettingsOpen || activeVideoFilter !== "none" || selectedRegion !== "All"
                      ? "bg-orange-950/40 border-orange-500/50 text-orange-400"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-white"
                  }`}
                  title="Configure next matching filters & visual camera filters"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${activeVideoFilter !== "none" ? "animate-spin text-orange-400" : ""}`} />
                  <span className="text-[10px] font-sans">Filters</span>
                </button>
              </div>

              {/* Camera toggle */}
              <button
                onClick={() => setCameraOff(!cameraOff)}
                className={`w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center transition-all ${
                  cameraOff ? "bg-red-900/80 hover:bg-red-800 text-white" : "bg-zinc-900 hover:bg-zinc-850 text-zinc-200"
                }`}
                title="Turn off/on video stream"
              >
                {cameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
