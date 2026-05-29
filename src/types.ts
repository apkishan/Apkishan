export type Language = "English" | "Hindi" | "Bengali" | "Tamil" | "Telugu";

export interface UserProfile {
  uid: string;
  displayName: string;
  phoneNumber: string;
  email?: string;
  avatarUrl: string;
  statusMessage: string;
  primaryLanguage: Language;
  onlineStatus: "online" | "offline";
  lastSeen: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  type: "text" | "image" | "video" | "audio" | "document";
  fileUrl?: string;
  fileName?: string;
  reactions?: { [emoji: string]: string[] }; // emoji -> array of senderIds
  seenBy: string[]; // array of UIDs
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  type: "one-to-one" | "group";
  name: string;
  avatarUrl?: string; // for group chat
  members: string[]; // UIDs
  lastMessageText: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
  typingStatus?: { [uid: string]: boolean };
}

export interface CallHistory {
  id: string;
  hostId: string;
  callerName: string;
  callerAvatar: string;
  type: "video" | "voice";
  isGroup: boolean;
  participants: string[];
  status: "missed" | "completed" | "ongoing";
  startTime: string;
  durationSeconds?: number;
  aiSummary?: string;
}

export interface TechTelemetry {
  cpuUsage: number;
  memoryUsage: number;
  latencyMs: number;
  packetLoss: number;
  bandwidthKbps: number;
}
