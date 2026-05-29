import React, { useState, useEffect } from "react";
import { Smartphone, Wifi, Battery, Radio } from "lucide-react";

interface DeviceSimulatorProps {
  children: React.ReactNode;
}

export default function DeviceSimulator({ children }: DeviceSimulatorProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="device-frame" className="relative mx-auto my-4 w-full max-w-[420px] h-[820px] bg-zinc-950 rounded-[48px] p-3.5 shadow-2xl border-4 border-zinc-800 transition-all duration-300">
      {/* Speaker Bar */}
      <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-zinc-700 rounded-full z-20" />

      {/* Dynamic Island / Punch Hole */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-center border border-zinc-900 shadow">
        <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-950 mr-1.5" />
        <span className="text-[10px] text-orange-500 font-bold font-mono tracking-widest animate-pulse">BHARAT 🇮🇳</span>
      </div>

      {/* Mobile Volume Buttons Side Accent */}
      <div className="absolute top-28 -left-1 w-1 h-12 bg-zinc-700 rounded-r-lg z-10" />
      <div className="absolute top-44 -left-1 w-1 h-12 bg-zinc-700 rounded-r-lg z-10" />
      <div className="absolute top-28 -right-1 w-1 h-16 bg-zinc-700 rounded-l-lg z-10" />

      {/* Inner Screen Housing */}
      <div className="relative w-full h-full bg-zinc-900 rounded-[34px] overflow-hidden flex flex-col border border-zinc-900">
        
        {/* Customized Mobile Status Bar */}
        <div className="w-full h-11 px-6 pt-5 pb-2 flex items-center justify-between text-white text-[11px] font-medium z-40 select-none bg-zinc-950">
          <span className="font-sans font-semibold tracking-tight">{time}</span>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-[9px] font-bold font-mono bg-zinc-800 text-green-400 px-1 rounded border border-zinc-700">Jio 5G</span>
            <Wifi className="w-3.5 h-3.5 text-zinc-300" />
            <Radio className="w-3.5 h-3.5 text-zinc-400" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] text-zinc-400">92%</span>
              <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            </div>
          </div>
        </div>

        {/* Client Application Screen Flow Component */}
        <div className="flex-1 w-full bg-zinc-900 flex flex-col overflow-hidden text-zinc-100">
          {children}
        </div>

        {/* Operating System Software Pill Bar */}
        <div className="w-full h-4 bg-zinc-950 flex items-center justify-center z-40 relative bottom-0 select-none">
          <div className="w-32 h-1 bg-zinc-700 rounded-full mb-1" />
        </div>
      </div>
    </div>
  );
}
