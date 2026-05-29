import { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800); // splash duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-12 text-center h-full overflow-hidden">
      <div /> {/* Spacer */}

      <div className="flex flex-col items-center relative gap-4">
        {/* Animated background halo */}
        <div className="absolute w-40 h-40 bg-orange-600/10 rounded-full blur-2xl top-0 left-1/2 -translate-x-1/2 -z-10" />
        <div className="absolute w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl bottom-0 left-1/2 -translate-x-1/2 -z-10" />

        {/* Soft interactive Tri-color halo border icon */}
        <div className="relative p-1 rounded-3xl bg-linear-to-tr from-emerald-500 via-white to-orange-500 shadow-xl">
          <div className="w-20 h-20 bg-zinc-950 rounded-[22px] flex items-center justify-center border border-zinc-800">
            <Video className="w-10 h-10 text-orange-500 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight font-sans mt-4 bg-gradient-to-r from-orange-400 via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
          Bharat Connect
        </h1>
        <p className="text-xs text-zinc-400 font-mono tracking-wider">
          FAST • SECURE • LOCALIZED
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* Minimal loading bar */}
        <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-orange-500 animate-[loading_2.2s_linear_infinite]" style={{ width: "65%" }} />
        </div>
        <p className="text-[10px] text-zinc-500 font-sans tracking-wide">
          Swadeshi Video Call Gateway
        </p>
        <span className="text-[9px] text-zinc-600 font-mono">
          V1.2.0 • Proudly Made in India 🇮🇳
        </span>
      </div>

      {/* Embedded CSS animation for custom loader */}
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(30%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
