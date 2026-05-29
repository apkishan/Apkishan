import { UserProfile, ChatRoom, CallHistory } from "../types";

export const LanguagesList = [
  { code: "English", label: "English", native: "English", flag: "🇬🇧" },
  { code: "Hindi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "Bengali", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "Tamil", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "Telugu", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
];

export const mockUsers: { [uid: string]: UserProfile } = {
  "user-me": {
    uid: "user-me",
    displayName: "Ishaan Roy",
    phoneNumber: "+91 98765 43210",
    email: "royishan071@gmail.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    statusMessage: "Proudly connecting Bharat 🇮🇳 | At work",
    primaryLanguage: "English",
    onlineStatus: "online",
    lastSeen: new Date().toISOString(),
  },
  "user-priya": {
    uid: "user-priya",
    displayName: "Priya Sharma (AI Advisor)",
    phoneNumber: "+91 88877 66554",
    email: "priya.sharma@connect.in",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    statusMessage: "Pixel-perfect React & Flutter designs ✨",
    primaryLanguage: "English",
    onlineStatus: "online",
    lastSeen: new Date().toISOString(),
  },
  "user-amit": {
    uid: "user-amit",
    displayName: "Amit Patel (WebRTC Lead)",
    phoneNumber: "+91 99988 77665",
    email: "amit.patel@connect.in",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    statusMessage: "Low ping WebRTC channels are mast! 🚀",
    primaryLanguage: "Hindi",
    onlineStatus: "online",
    lastSeen: new Date().toISOString(),
  },
  "user-rajesh": {
    uid: "user-rajesh",
    displayName: "Rajesh Verma (Sysops Elder)",
    phoneNumber: "+91 77766 55443",
    email: "rajesh.verma@connect.in",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    statusMessage: "Build humble code, everything else is transient. 🙏",
    primaryLanguage: "Bengali",
    onlineStatus: "online",
    lastSeen: new Date().toISOString(),
  },
  "user-sneha": {
    uid: "user-sneha",
    displayName: "Sneha Reddy (QA)",
    phoneNumber: "+91 91234 56789",
    email: "sneha.reddy@connect.in",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    statusMessage: "Testing multi-party 50-user lobbies 🐞",
    primaryLanguage: "Telugu",
    onlineStatus: "offline",
    lastSeen: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  "user-rahul": {
    uid: "user-rahul",
    displayName: "Rahul Sen (Devops)",
    phoneNumber: "+91 81234 56789",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    statusMessage: "Optimizing video packets for Indian 3G cells 📶",
    primaryLanguage: "Bengali",
    onlineStatus: "offline",
    lastSeen: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
};

export const mockInitialChats = (): ChatRoom[] => [
  {
    id: "chat-priya",
    type: "one-to-one",
    name: "Priya Sharma",
    members: ["user-me", "user-priya"],
    lastMessageText: "Bhai, did you check the glassmorphic designs of the incoming video call screen? They look super!",
    lastMessageAt: new Date(Date.now() - 60000 * 5).toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: "m-p1",
        senderId: "user-priya",
        senderName: "Priya Sharma",
        text: "Namaste Ishaan! Standard design elements are completed.",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        seenBy: ["user-me", "user-priya"],
      },
      {
        id: "m-p2",
        senderId: "user-me",
        senderName: "Ishaan Roy",
        text: "Priya yaar, that looks absolutely sleek! Can't wait to test the WebRTC channels.",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 23).toISOString(),
        seenBy: ["user-me", "user-priya"],
      },
      {
        id: "m-p3",
        senderId: "user-priya",
        senderName: "Priya Sharma",
        text: "Check these initial layout mocks I prepared for the App Store slides!",
        type: "image",
        fileUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80",
        fileName: "BharatConnectMocks.jpg",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        seenBy: ["user-me", "user-priya"],
      },
      {
        id: "m-p4",
        senderId: "user-priya",
        senderName: "Priya Sharma",
        text: "Bhai, did you check the glassmorphic designs of the incoming video call screen? They look super!",
        type: "text",
        createdAt: new Date(Date.now() - 60000 * 5).toISOString(),
        seenBy: ["user-priya"],
      }
    ],
  },
  {
    id: "chat-amit",
    type: "one-to-one",
    name: "Amit Patel",
    members: ["user-me", "user-amit"],
    lastMessageText: "I've added data saver compression. Video packets will scale beautifully on local trains in Mumbai!",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "m-a1",
        senderId: "user-me",
        senderName: "Ishaan Roy",
        text: "Amit, what's our video packet bit rate currently?",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        seenBy: ["user-me", "user-amit"],
      },
      {
        id: "m-a2",
        senderId: "user-amit",
        senderName: "Amit Patel",
        text: "Normally 2.5 Mbps in HD, but in Low Internet mode it automatically squeezes down to 350 Kbps!",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        seenBy: ["user-me", "user-amit"],
      },
      {
        id: "m-a3",
        senderId: "user-amit",
        senderName: "Amit Patel",
        text: "I've added data saver compression. Video packets will scale beautifully on local trains in Mumbai!",
        type: "text",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        seenBy: ["user-me", "user-amit"],
      }
    ]
  },
  {
    id: "chat-rajesh",
    type: "one-to-one",
    name: "Rajesh Verma",
    members: ["user-me", "user-rajesh"],
    lastMessageText: "Namaste beta. Please verify the Firestore Security Rules before deployment. It protects identity integrity safely.",
    lastMessageAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "m-r1",
        senderId: "user-rajesh",
        senderName: "Rajesh Verma",
        text: "Namaste beta. Please verify the Firestore Security Rules before deployment. It protects identity integrity safely.",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        seenBy: ["user-me", "user-rajesh"],
      }
    ]
  },
  {
    id: "chat-group",
    type: "group",
    name: "🇮🇳 Bharat Launch Team 🚀",
    avatarUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80",
    members: ["user-me", "user-priya", "user-amit", "user-rajesh", "user-sneha"],
    lastMessageText: "Sneha: I tested 50 participants simultaneously. Latency stayed below 60ms!",
    lastMessageAt: new Date(Date.now() - 60000 * 45).toISOString(),
    unreadCount: 0,
    messages: [
      {
        id: "g-1",
        senderId: "user-rajesh",
        senderName: "Rajesh Verma",
        text: "Welcome everyone to Bharat Connect! Let's ensure top-notch video clarity for Indian households.",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        seenBy: ["user-me", "user-priya", "user-amit", "user-rajesh", "user-sneha"]
      },
      {
        id: "g-2",
        senderId: "user-priya",
        senderName: "Priya Sharma",
        text: "Design values look great! Screen sharing on low bandwidth works smoothly.",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        seenBy: ["user-me", "user-priya", "user-amit", "user-rajesh", "user-sneha"]
      },
      {
        id: "g-3",
        senderId: "user-amit",
        senderName: "Amit Patel",
        text: "I built WebRTC signaling servers over standard port nodes. No packet blocking!",
        type: "text",
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        seenBy: ["user-me", "user-priya", "user-amit", "user-rajesh", "user-sneha"]
      },
      {
        id: "g-4",
        senderId: "user-sneha",
        senderName: "Sneha Reddy",
        text: "Sneha: I tested 50 participants simultaneously. Latency stayed below 60ms!",
        type: "text",
        createdAt: new Date(Date.now() - 60000 * 45).toISOString(),
        seenBy: ["user-me", "user-priya", "user-amit", "user-rajesh", "user-sneha"]
      }
    ]
  }
];

export const mockInitialCalls: CallHistory[] = [
  {
    id: "call-1",
    hostId: "user-priya",
    callerName: "Priya Sharma",
    callerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    type: "video",
    isGroup: false,
    participants: ["user-me", "user-priya"],
    status: "completed",
    startTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    durationSeconds: 432,
    aiSummary: `### 🇮🇳 Launch Design Sync Summary
- **Slogan**: Connect, Collaborate, Conquer!
- **Key Objectives**: Review glassmorphic UI elements and high-definition local stream outputs.
- **Action Items**:
  * **Priya** to deliver the localized Indian startup theme assets by tomorrow.
  * **Ishaan** to test the AI real-time Hindi translation subtitles on slow 3G simulators.`
  },
  {
    id: "call-2",
    hostId: "user-amit",
    callerName: "WebRTC Test Room",
    callerAvatar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&auto=format&fit=crop&q=80",
    type: "video",
    isGroup: true,
    participants: ["user-me", "user-amit", "user-priya", "user-rajesh"],
    status: "completed",
    startTime: new Date(Date.now() - 3600000 * 5).toISOString(),
    durationSeconds: 1540,
    aiSummary: `### 🇮🇳 Backend Integration Webinar Summary
- **Slogan**: Swadeshi Tech at Scale!
- **Key Highlights**: Tested multi-party STUN/TURN media tunnels with live AI Noise Cancellation enabled.
- **Action Items**:
  * **Amit** to deploy the optimized socket compression modules.
  * **Rajesh** to perform a complete penetration audit against the Firebase client gates.`
  },
  {
    id: "call-3",
    hostId: "user-rajesh",
    callerName: "Rajesh Verma",
    callerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    type: "voice",
    isGroup: false,
    participants: ["user-me", "user-rajesh"],
    status: "missed",
    startTime: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export const mockAPKBuildInstructions = `
# 🇮🇳 Bharat Connect - Android APK Build Instructions (Flutter & React Native)

This guide decants standard production pipeline instructions for compilation into a secure standalone Google Play Store APK wrapper.

## 🛠️ Prerequisites & SDKs
1. **Flutter SDK**: Install version \`3.22.x\` or higher.
2. **Java Development Kit (JDK)**: JDK 17 required for modern Android Gradle integration.
3. **Android Studio**: Android SDK command-line tools and platforms (\`API Level 34\` recommended).

## 🔑 Firebase Setup (Step-by-Step)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it \`Bharat Connect\`.
3. Add an **Android App** to the project using package name \`com.bharat.connect.app\`.
4. Download the \`google-services.json\` config file and drag it into your Flutter project's \`android/app/\` directory.
5. In Flutter, run:
   \`\`\`bash
   flutter pub add firebase_core firebase_auth cloud_firestore
   \`\`\`

## 🧪 WebRTC Configuration
Bharat Connect uses WebRTC protocol loops for sub-60ms video frames.
Add standard hardware clearance flags to your Android Manifest file (\`android/app/src/main/AndroidManifest.xml\`):
\`\`\`xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
\`\`\`

## 🚀 Native Compilation Instructions
To compile a highly optimized, single-architecture arm64-v8a build for low-end Indian sub-$150 android handsets:

\`\`\`bash
# 1. Clear caches
flutter clean

# 2. Re-resolve dependencies
flutter pub get

# 3. Build signed production APK
flutter build apk --release --target-platform android-arm64 --split-per-abi
\`\`\`

*The resulting optimized binary will be produced in:*
\`build/app/outputs/flutter-apk/app-arm64-v8a-release.apk\`
`;

export const mockPlayStoreListing = {
  title: "Bharat Connect: HD Calls & Chat",
  shortDesc: "Premium Indian video calling app with HD WebRTC quality, AI translation subtitles, and secure end-to-end encryption in Hindi, Bengali & English.",
  fullDesc: `🇮🇳 Bharat Connect is India’s fast, secure, and smart video calling and instant messaging application designed to operate beautifully even on low-end budget phones and 3G network conditions!

Made for India, Bharat Connect brings families, startups, and friends together across the nation with zero lag, low packaging size, and highly optimized bandwidth.

### 🌟 UNIQUE FEATURES:
- **🎬 One-to-One & Group Calls (Up to 50 Users)**: Seamlessly high-definition video meetings with your launch team or family using secure WebRTC tunnels.
- **✨ Real-Time AI live Subtitles**: Speak in any language and let the system translate spoken voices instantly into हिन्दी, বাংলা, தமிழ், తెలుగు, or English.
- **🔇 AI Noise Cancellation & Echo Suppression**: Suppress cooker whistles, wedding dhols, and street noise.
- **☁️ AI Meeting Summary**: Instantly summarize your corporate sync or chat with a single button.
- **💬 Fast Messaging & Voice Notes**: Express with cool emojis, seen receipts, typing loops, and high-fidelity media transfers.
- **📶 Data Saver Mode (Optimized for India)**: Automatically reduces data usage on bumpy trains and rural network towers without losing voice quality.
---
Bharat Connect is 100% secure, encrypted, and built proudly for Digital India. Play your part, download today!`,
  privacyPolicy: `## Bharat Connect - Privacy Policy
**Last Updated: May 2026**

Bharat Connect (\"we\", \"us\", \"our\") is committed to shielding the digital privacy of Indian citizens in compliance with the Digital Personal Data Protection Act (DPDPA), 2023.

### 1. Data we Collect
- **Profile Information**: Display Name, Indian Phone Number, and Optional Email submitted during mock OTP sign-in.
- **Media Streams**: We request access to your device's Camera and Microphone strictly to facilitate real-time video/audio calling. These streams are routed peer-to-peer and are never recorded on our backend servers.
- **Transcripts for AI Subtitles**: Real-time voice signals analyzed for local live translation are processed transiently and purged immediately.

### 2. Encryption & Protection
Bharat Connect routes WebRTC media using Secure Real-time Transport Protocol (SRTP) with DTLS. All stored metadata follows the zero-leak guidelines of Google Cloud and Firebase Firestore rules.

### 3. Contact Us
For grievance audits or profile clearance requests, reach out at: \`privacy@bharatconnect.org.in\``
};
