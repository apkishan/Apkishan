import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Phone, Video, Smile, Paperclip, Check, CheckCheck, Loader2, Globe, AudioLines } from "lucide-react";
import { ChatRoom, Message, UserProfile, Language } from "../types";
import { translateText, fetchBotReply } from "../utils/ai";

interface ChatDetailProps {
  chat: ChatRoom;
  currentUser: UserProfile;
  onBack: () => void;
  onUpdateChatMessages: (chatId: string, messages: Message[]) => void;
  onStartCall: (type: "video" | "voice", contactName: string, contactAvatar: string) => void;
}

export default function ChatDetail({
  chat,
  currentUser,
  onBack,
  onUpdateChatMessages,
  onStartCall,
}: ChatDetailProps) {
  const [inputText, setInputText] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [translatedMessages, setTranslatedMessages] = useState<{ [msgId: string]: string }>({});
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages, isBotTyping]);

  const handleSendMessage = async (textToSend: string, type: Message["type"] = "text", fileUrl?: string) => {
    if (!textToSend.trim() && !fileUrl) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      text: textToSend,
      type: type,
      fileUrl: fileUrl,
      seenBy: [currentUser.uid],
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...chat.messages, newMessage];
    onUpdateChatMessages(chat.id, updatedMessages);
    setInputText("");

    // Simulate AI Advisor BOT response if typing in individual chat
    if (chat.type === "one-to-one") {
      setIsBotTyping(true);
      
      const botName = chat.name.includes("Priya") ? "Priya" : chat.name.includes("Amit") ? "Amit" : "Rajesh";
      
      try {
        const botReply = await fetchBotReply(textToSend, botName as any);
        
        setIsBotTyping(false);
        const botMessage: Message = {
          id: `msg-${Date.now()}-${botName}`,
          senderId: `user-${botName.toLowerCase()}`,
          senderName: chat.name,
          text: botReply,
          type: "text",
          seenBy: [currentUser.uid],
          createdAt: new Date().toISOString(),
        };
        onUpdateChatMessages(chat.id, [...updatedMessages, botMessage]);
      } catch (err) {
        setIsBotTyping(false);
      }
    }
  };

  // Run dynamic Gemini Translation service
  const handleTranslateMessage = async (msg: Message) => {
    if (translatedMessages[msg.id]) {
      // Toggle off if already translated
      const copy = { ...translatedMessages };
      delete copy[msg.id];
      setTranslatedMessages(copy);
      return;
    }

    setTranslatingId(msg.id);
    try {
      const targetLang = currentUser.primaryLanguage;
      const response = await translateText(msg.text, targetLang);
      setTranslatedMessages((prev) => ({ ...prev, [msg.id]: response }));
    } catch (err) {
      console.error(err);
    } finally {
      setTranslatingId(null);
    }
  };

  // Add customized reactions
  const handleReactToMessage = (msgId: string, emoji: string) => {
    const updated = chat.messages.map((m) => {
      if (m.id !== msgId) return m;
      const currentReactions = m.reactions || {};
      const currentReactors = currentReactions[emoji] || [];

      // Toggle reaction
      if (currentReactors.includes(currentUser.uid)) {
        currentReactions[emoji] = currentReactors.filter((uid) => uid !== currentUser.uid);
      } else {
        currentReactions[emoji] = [...currentReactors, currentUser.uid];
      }

      // Cleanup empty reaction categories
      if (currentReactions[emoji].length === 0) {
        delete currentReactions[emoji];
      }

      return { ...m, reactions: { ...currentReactions } };
    });

    onUpdateChatMessages(chat.id, updated);
    setShowEmojis("");
  };

  // Voice recording simulation
  const handleVoiceRecordToggle = () => {
    if (!voiceRecording) {
      setVoiceRecording(true);
    } else {
      setVoiceRecording(false);
      // Post Voice message attachment
      handleSendMessage("🎙️ Voice Note (Simulated recording • 0:04s)", "audio", "#");
    }
  };

  // Mock document sender attachment
  const handleSendDocument = () => {
    handleSendMessage("📄 ProjectRequirements-v2.pdf (1.2 MB)", "document", "#");
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-950 text-zinc-100 flex-1 relative overflow-hidden">
      
      {/* Header bar */}
      <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <img
            src={chat.avatarUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80"}
            alt="avat-pic"
            className="w-9 h-9 rounded-xl object-cover border border-zinc-800"
          />

          <div className="min-w-0">
            <h4 className="text-xs font-bold text-zinc-200 truncate">{chat.name}</h4>
            <span className="text-[9px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              online
            </span>
          </div>
        </div>

        {/* Shortcuts to direct WebRTC Call components */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStartCall("voice", chat.name, chat.avatarUrl || "")}
            className="p-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={() => onStartCall("video", chat.name, chat.avatarUrl || "")}
            className="p-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800"
          >
            <Video className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Messages area list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-zinc-950/20">
        
        {chat.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.uid;
          const isTranslated = !!translatedMessages[msg.id];
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] ${isMe ? "ml-auto" : "mr-auto"}`}>
              
              {/* Optional dynamic bot names for team groups */}
              {!isMe && chat.type === "group" && (
                <span className="text-[9px] text-orange-400 font-mono mb-1">{msg.senderName}</span>
              )}

              {/* Message bubble */}
              <div
                className={`relative px-3.5 py-2.5 rounded-2xl text-xs leading-normal select-text relative group ${
                  isMe
                    ? "bg-orange-600 text-white rounded-tr-none"
                    : "bg-zinc-900 text-zinc-200 border border-zinc-850 rounded-tl-none"
                }`}
                onDoubleClick={() => handleTranslateMessage(msg)}
              >
                
                {/* Media attachments templates */}
                {msg.type === "image" && msg.fileUrl && (
                  <div className="mb-2 max-w-full rounded-xl overflow-hidden border border-zinc-800">
                    <img src={msg.fileUrl} alt="uploaded" className="w-full h-auto object-cover max-h-40" />
                  </div>
                )}

                {msg.type === "audio" && (
                  <div className="flex items-center gap-2 pb-1.5 font-mono text-[10px] text-orange-400">
                    <AudioLines className="w-4 h-4 shrink-0 animate-pulse" />
                    <span>PCM Voice Note Attachment</span>
                  </div>
                )}

                {/* Main text content with translation fallback */}
                <p className="font-sans whitespace-pre-wrap">{msg.text}</p>

                {/* Renders Gemini translate text dynamically below if translated */}
                {isTranslated && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-800/40 text-[11px] text-yellow-300/95 leading-relaxed font-sans select-all animate-fadeIn">
                    <span className="text-[8px] bg-yellow-400 text-black px-1 rounded uppercase mr-1 font-mono">
                      AI Translated ({currentUser.primaryLanguage}):
                    </span>
                    {translatedMessages[msg.id]}
                  </div>
                )}

                {/* Interaction info bar */}
                <div className="flex justify-between items-center gap-1.5 mt-1.5">
                  <div className="flex gap-1 items-center shrink-0">
                    {/* Tiny translate helper triggers */}
                    {msg.type === "text" && (
                      <button
                        onClick={() => handleTranslateMessage(msg)}
                        className={`text-[9px] rounded-sm px-1 py-0.5 font-mono cursor-pointer flex items-center gap-1 transition-colors ${
                          isMe
                            ? "bg-orange-700/60 text-zinc-200 hover:bg-orange-800"
                            : "bg-zinc-800 text-[#f97316] hover:bg-zinc-850"
                        }`}
                      >
                        {translatingId === msg.id ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <>
                            <Globe className="w-2.5 h-2.5" />
                            <span>{isTranslated ? "Show original" : "Translate"}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <span className="text-[8.5px] text-zinc-400 font-mono self-end">
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>

                {/* Message seen checkmarks */}
                {isMe && (
                  <div className="absolute right-2.5 bottom-1 flex items-center gap-0.5">
                    {msg.seenBy.length > 1 ? (
                      <CheckCheck className="w-3.5 h-3.5 text-orange-200 stroke-[2.5]" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-zinc-300" />
                    )}
                  </div>
                )}

                {/* Tap to show quick reaction toolbox */}
                <button
                  onClick={() => setShowEmojis(showEmojis === msg.id ? "" : msg.id)}
                  className="absolute -top-3.5 right-1 opacity-0 group-hover:opacity-100 bg-zinc-800 hover:bg-zinc-700 text-[10px] p-0.5 rounded border border-zinc-700 transition-opacity"
                >
                  <Smile className="w-3.5 h-3.5 text-yellow-500" />
                </button>

                {/* Persistent reacted emojis container */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {Object.entries(msg.reactions).map(([emo, users]) => (
                      <span
                        key={emo}
                        className="text-[9.5px] bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 flex items-center gap-0.5"
                      >
                        {emo} <span className="text-[8px] text-zinc-500">{users.length}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Reaction box drawer inline below message bubble */}
              {showEmojis === msg.id && (
                <div className="flex gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mt-1 shadow-2xl z-40 select-none">
                  {["👍", "❤️", "😂", "😮", "🙏"].map((emo) => (
                    <button
                      key={emo}
                      onClick={() => handleReactToMessage(msg.id, emo)}
                      className="hover:scale-125 px-1.5 text-xs transition-transform transform active:scale-95"
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              )}

            </div>
          );
        })}

        {/* AI Typing state block */}
        {isBotTyping && (
          <div className="flex gap-2 items-center text-zinc-400 font-mono text-[10px]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f97316]" />
            <span>{chat.name} typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom control input messaging deck */}
      <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2 z-40 shrink-0">
        
        {/* Attach items quick select */}
        <button
          onClick={handleSendDocument}
          className="p-2 h-10 w-10 text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 rounded-xl border border-zinc-800 shrink-0 flex items-center justify-center transition-all"
        >
          <Paperclip className="w-4.5 h-4.5" />
        </button>

        {/* Text messaging text input box */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
            placeholder={voiceRecording ? "Microphone active..." : "Say something in Hindi, English..."}
            disabled={voiceRecording}
            className="w-full h-10 bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/30"
          />
        </div>

        {/* Recording / Submit triggers */}
        {inputText.trim() ? (
          <button
            onClick={() => handleSendMessage(inputText)}
            className="p-2 h-10 w-10 text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-lg shrink-0 flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <Send className="w-4 h-4 translate-x-0.5" />
          </button>
        ) : (
          <button
            onClick={handleVoiceRecordToggle}
            className={`p-2 h-10 w-10 h-11 w-11 rounded-full text-white cursor-pointer flex items-center justify-center transition-all active:scale-95 justify-center shrink-0 ${
              voiceRecording ? "bg-red-600 animate-bounce" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
            }`}
          >
            <AudioLines className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
