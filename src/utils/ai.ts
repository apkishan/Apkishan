/**
 * Bharat Connect client-side AI helper utilities.
 * Routes through the server backend to keep API keys securely hidden.
 */

export async function checkAIStatus(): Promise<{ configured: boolean; model: string; region: string }> {
  try {
    const response = await fetch("/api/ai-status");
    if (!response.ok) throw new Error("API status check failed");
    return await response.json();
  } catch (error) {
    console.warn("AI status check failed:", error);
    return { configured: false, model: "N/A", region: "Offline (Local Preview)" };
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text.trim()) return "";
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLanguage }),
    });

    if (!response.ok) {
      throw new Error("Translation API returned error");
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("AI Translation client failure:", error);
    return `[Translation Error, using local fallback] ${text}`;
  }
}

export async function summarizeCallTranscript(transcript: string): Promise<string> {
  if (!transcript.trim()) return "No conversation was captured to summarize.";
  try {
    const response = await fetch("/api/summarize-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      throw new Error("Summarization API returned error");
    }

    const data = await response.json();
    return data.summary || "Summary generation failure.";
  } catch (error) {
    console.error("AI Summarizer client failure:", error);
    return `### 🇮🇳 Live Meeting Notes
*Mock Summary Fallback:*
- High-fidelity conversation has concluded.
- Tested "AI Subtitles" and WebRTC video pipelines on responsive emulator.
- Host ended the call successfully.`;
  }
}

export async function fetchBotReply(message: string, botPersona: "Priya" | "Amit" | "Rajesh"): Promise<string> {
  if (!message.trim()) return "";
  try {
    const response = await fetch("/api/chat-bot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, botPersona }),
    });

    if (!response.ok) {
      throw new Error("Chatbot API returned error");
    }

    const data = await response.json();
    return data.reply || "Thinking...";
  } catch (error) {
    console.error("AI Chatbot client failure, returning local fallback:", error);
    // Offline / unconfigured keys fallback personas
    if (botPersona === "Priya") {
      return "Hey yaar! That sounds absolutely superb! Let's craft some beautiful, clean pixel structures for Bharat Connect.";
    } else if (botPersona === "Amit") {
      return "Ekdam solid question, bro! Let's ensure WebRTC bandwidth allocation is optimized.";
    } else {
      return "Namaste, beta. Keep coding with steady hands. My best blessings are with you.";
    }
  }
}
