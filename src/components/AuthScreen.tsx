import React, { useState } from "react";
import { Lock, Phone, User, CheckCircle2, AlertCircle } from "lucide-react";
import { UserProfile, Language } from "../types";

interface AuthScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("+91 98765 43210");
  const [email, setEmail] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [otpCode, setOtpCode] = useState("");
  const [sentOtp, setSentOtp] = useState("1947"); // Independence day easter egg
  const [otpNotification, setOtpNotification] = useState(false);
  const [error, setError] = useState("");

  // After OTP, prompt for profile name and language selection
  const [profileName, setProfileName] = useState("Ishaan Roy");
  const [prefLang, setPrefLang] = useState<Language>("English");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  );

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!useEmail && !phoneNumber.trim()) {
      setError("Please insert a valid mobile number.");
      return;
    }
    if (useEmail && !email.trim()) {
      setError("Please insert a valid email address.");
      return;
    }

    // Trigger simulated SMS trigger
    setOtpNotification(true);
    setStep("otp");
    setTimeout(() => {
      setOtpNotification(false);
    }, 8500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode !== sentOtp) {
      setError("Incorrect OTP code. Hint: Use standard Swadeshi code '1947'!");
      return;
    }

    setStep("profile");
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    // Provision profile
    const userProfile: UserProfile = {
      uid: "user-me",
      displayName: profileName,
      phoneNumber: useEmail ? "+91 99999 88888" : phoneNumber,
      email: email || "royishan071@gmail.com",
      avatarUrl: avatarUrl,
      statusMessage: "Proudly connecting Bharat 🇮🇳 | At work",
      primaryLanguage: prefLang,
      onlineStatus: "online",
      lastSeen: new Date().toISOString(),
    };

    onLoginSuccess(userProfile);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-950 p-6 flex-1 relative overflow-y-auto">
      
      {/* Simulated SMS Notification Banner */}
      {otpNotification && (
        <div className="absolute top-2 left-4 right-4 bg-zinc-900 border border-orange-500/40 p-3 rounded-2xl shadow-2xl z-50 flex gap-2.5 items-start animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-zinc-100 font-sans">SMS: BHARAT-OTP</h4>
            <p className="text-[10px] text-zinc-300 mt-0.5">
              Ref ID CODE: <span className="font-bold text-orange-400">1947</span> is your security key to register on Bharat Connect. Secure India! 🇮🇳
            </p>
          </div>
        </div>
      )}

      {/* Top Graphic Header */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-14 h-14 bg-zinc-900/60 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner">
          <Lock className="w-6 h-6 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-3 font-sans">
          {step === "phone" && "Secure Gateway Log In"}
          {step === "otp" && "SMS Verification"}
          {step === "profile" && "Create Swadeshi Account"}
        </h2>
        <p className="text-xs text-zinc-400 text-center px-4 mt-1 font-sans">
          {step === "phone" && "Log in directly using your verified Indian mobile number or Email."}
          {step === "otp" && `We've sent a simulated SMS security token to your terminal.`}
          {step === "profile" && "Configure your regional avatar and subtitle language settings."}
        </p>
      </div>

      {/* Primary Forms */}
      <div className="flex-1 flex flex-col justify-center my-6">
        
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800 flex items-center gap-2 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === "phone" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            
            {useEmail ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest font-mono">Email Address</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email ID"
                    className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest font-mono">Indian Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm font-sans text-white tracking-wide focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-950/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get Indian SMS OTP
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setUseEmail(!useEmail);
                }}
                className="text-xs text-zinc-400 hover:text-orange-400 underline"
              >
                {useEmail ? "Log in with phone number instead" : "Log in with email ID instead"}
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest font-mono">Simulated OTP Code</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter standard 4-digit code (1947)"
                  className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm font-mono text-white tracking-widest focus:outline-none focus:border-orange-500/50"
                />
              </div>
              <p className="text-[10px] text-orange-400/90 font-sans">
                💡 Code loaded! Look at the banner notification or insert <span className="font-bold underline">1947</span>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white shadow-lg active:scale-95 transition-all"
            >
              Verify Secure OTP Key
            </button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300"
            >
              Go back and correct number
            </button>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            
            {/* Avatar Selectors */}
            <div className="space-y-1.5 text-center">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest font-mono block">Choose Avatar</label>
              <div className="flex justify-center gap-3.5 mt-2.5">
                {[
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
                ].map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all shrink-0 ${
                      avatarUrl === url ? "border-orange-500 ring-2 ring-orange-950 scale-110" : "border-zinc-800"
                    }`}
                  >
                    <img src={url} alt="Avatar profile" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest font-mono">Display Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest font-mono">Primary Language </label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as Language)}
                className="w-full h-11 bg-zinc-900/40 border border-zinc-800 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
              >
                <option value="English">🇬🇧 English</option>
                <option value="Hindi">🇮🇳 Hindi (हिन्दी)</option>
                <option value="Bengali">🇮🇳 Bengali (বাংলা)</option>
                <option value="Tamil">🇮🇳 Tamil (தமிழ்)</option>
                <option value="Telugu">🇮🇳 Telugu (తెలుగు)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-600 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white shadow-lg active:scale-95 transition-all text-center mt-2.5"
            >
              Launch Bharat Connect 🇮🇳
            </button>
          </form>
        )}

      </div>

      {/* Footer Branding */}
      <div className="text-center">
        <p className="text-[10px] text-zinc-600 font-sans tracking-wide">
          Secured with DTLS End-to-End Encryption protocol
        </p>
        <p className="text-[9px] text-zinc-700 font-mono mt-0.5">
          Bharat Startup Laboratories Private Limited
        </p>
      </div>
    </div>
  );
}
