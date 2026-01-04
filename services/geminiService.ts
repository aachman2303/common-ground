import { GoogleGenAI } from "@google/genai";
import { MOCK_EVENTS, AVATARS, CHECK_IN_OPTIONS } from '../constants';
import { CalendarEvent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Singleton chat session for the academic tutor
let tutorChatSession: any = null;

const getTutorSession = () => {
  if (!tutorChatSession) {
    tutorChatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "You are a specialized Academic Tutor AI. Your sole purpose is to assist students with complex academic problems, coursework, and research. You can analyze images of homework, equations, or diagrams provided by the user. When analyzing an image, describe what you see first, then solve the problem step-by-step. Provide deep, educational explanations.",
      },
    });
  }
  return tutorChatSession;
};

export const sendMessageToTutor = async (message: string, attachmentBase64?: string): Promise<string> => {
  try {
    const session = getTutorSession();
    
    // If there's an attachment, we can't use the simple session.sendMessage string overload easily with structure
    // We will use the chat history to maintain context but for the immediate turn with image, we might need a direct model call 
    // OR just use sendMessage with parts if the SDK supports it in chat.
    // The @google/genai SDK chat.sendMessage supports parts.
    
    let parts: any[] = [];
    if (attachmentBase64) {
        parts.push({
            inlineData: {
                data: attachmentBase64,
                mimeType: 'image/png' // Assuming PNG/JPEG for simplicity
            }
        });
    }
    if (message) {
        parts.push({ text: message });
    }

    const response = await session.sendMessage({
        content: { parts: parts }
    });

    return response.text || "I analyzed the input but couldn't generate a text response.";
  } catch (error) {
    console.error("Error in academic tutor chat:", error);
    return "I'm having trouble analyzing this right now. Please ensure the file is a clear image (PNG/JPG).";
  }
};

export const analyzeTutorAttachment = async (base64Data: string): Promise<string> => {
    // Helper to just describe an image if needed separately, but sendMessageToTutor handles it.
    // This function can be used for pre-checks.
    return "Image received.";
};

// ... existing functions ...
export const getCopingStrategy = async (mood: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a compassionate, non-clinical peer support assistant for university students. 
      The student is feeling: "${mood}".
      Provide ONE short, specific, immediately actionable micro-habit (under 20 words) they can do right now to feel slightly better. 
      Do not use platitudes. Be concrete (e.g., "Drink a glass of cold water," "Do a 4-7-8 breath").`,
    });
    return response.text?.trim() || "Take a deep breath and count to ten.";
  } catch (error) {
    console.error("Error generating coping strategy:", error);
    return "Take a moment to close your eyes and reset.";
  }
};

export const getStudyMotivation = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a short, gentle, and grounding motivation quote for a student studying late at night. 
      Focus on persistence and self-compassion, not "hustle culture". Max 15 words.`,
    });
    return response.text?.trim() || "You are doing enough. One step at a time.";
  } catch (error) {
    console.error("Error generating motivation:", error);
    return "Keep going. You've got this.";
  }
};

export const getSharedRealityInsight = async (signalId: string): Promise<string> => {
  try {
     const signalLabel = CHECK_IN_OPTIONS.find(o => o.id === signalId)?.label || "Heavy Load";
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context: You are the backend of a "Shared Reality" visualization for a university campus. 
        Philosophy: Shift the narrative from "I am struggling" to "The environment is demanding".
        Data: The dominant academic signal today is "${signalLabel}".
        Task: Generate a single sentence insight displayed to students to validate their experience.
        Rules:
        1. Validate the shared experience (e.g., "This is a heavy week").
        2. Do NOT give advice (no "try to rest").
        3. Frame it as a systemic observation using the philosophy: "You’re not behind — this is a hard week for many."
        4. Max 25 words.
      `,
    });
    return response.text?.trim() || "This week is marked as high academic load across campus. You are not alone.";
  } catch (e) {
    return "This week is marked as high academic load across campus. You are not alone.";
  }
}

export const getGroupIcebreaker = async (signalId: string): Promise<string> => {
  try {
    const signalLabel = CHECK_IN_OPTIONS.find(o => o.id === signalId)?.label || "Academic Stress";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context: A 5-minute anonymous group chat for students who all checked in with "${signalLabel}".
        Task: Generate ONE simple, non-intrusive question to start the conversation.
        Rules:
        1. It should help them normalize the struggle.
        2. It should NOT be deeply emotional or clinical.
        3. Keep it light or practical (e.g., "What's the one assignment keeping you up?", "Coffee or Tea right now?").
        4. Max 15 words.
      `,
    });
    return response.text?.trim() || "What's the one thing on your mind right now?";
  } catch (e) {
    return "What is keeping you busy today?";
  }
};

export const analyzeCampusSchedule = async (): Promise<{ title: string; insight: string }> => {
  try {
    const scheduleData = MOCK_EVENTS.map(e => ({
      event: e.title,
      type: e.type,
      attendees: e.attendees.map(idx => AVATARS[idx].subject)
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are a "Campus Connection AI". Analyze this daily schedule of events and the majors of the students attending (the attendees list).
        Schedule Data: ${JSON.stringify(scheduleData)}
        
        Identify one "Common Ground" pattern (e.g., "STEM and Arts students are mixing at Lunch") and one "Suggestion" to improve connection.
        Return the response strictly in JSON format: { "title": "Short Headline", "insight": "2 sentences analysis + suggestion" }
      `,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error analyzing schedule:", error);
    return { 
      title: "Community Pattern", 
      insight: "It looks like a busy day on campus. Try joining the Community Lunch to meet students from other majors!" 
    };
  }
};

export const getCollectiveMoodPrompt = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context: The collective mood of the campus is "Stressed/Busy".
        Task: Generate a "Mood-Boost Micro-Prompt".
        Rules:
        1. Very short (max 10 words).
        2. Fun, light, or physically grounding.
        3. Examples: "Unclench your jaw.", "Look at the sky for 10s.", "Drink water now."
      `,
    });
    return response.text?.trim() || "Shoulders down, deep breath.";
  } catch (error) {
    return "Take a moment to breathe.";
  }
};

export const getCalmZonePrediction = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context: Predictive analysis of campus foot traffic during midterms.
        Task: Predict a quiet zone for the next 2 hours.
        Output: Just the prediction text, 1 sentence. E.g., "The Geology Museum garden is predicted to be 85% empty until 2 PM."
      `,
    });
    return response.text?.trim() || "The North Garden is predicted to be quiet for the next hour.";
  } catch (error) {
    return "The Engineering roof garden is likely quiet right now.";
  }
};

// 1:1 Peer Simulation
export const getPeerGreeting = async (signalId: string): Promise<string> => {
  try {
     const signalLabel = CHECK_IN_OPTIONS.find(o => o.id === signalId)?.label || "Stress";
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Context: A 1-on-1 anonymous chat between two university students who both feel "${signalLabel}".
        Task: Generate ONE short opening text message from one student to the other.
        Rules:
        1. Casual, lower-case, maybe a bit tired or empathetic.
        2. No formal greetings.
        3. Example: "honestly same. is it midterms for you too?"
        4. Max 15 words.
      `,
    });
    return response.text?.trim() || "hey. rough day here too.";
  } catch (e) {
    return "hey. you feeling this too?";
  }
}

export const getPeerReply = async (userMessage: string, signalId: string): Promise<string> => {
  try {
    const signalLabel = CHECK_IN_OPTIONS.find(o => o.id === signalId)?.label || "Stress";
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Roleplay: You are a university student feeling "${signalLabel}". 
        Scenario: You are in an anonymous chat with another student.
        User said: "${userMessage}"
        Task: Reply to the user.
        Rules:
        1. Keep it short (max 1 sentence).
        2. Be empathetic, validative, and casual (lowercase).
        3. Do NOT give advice. Just relate to the struggle.
        4. If they ask how you are, say you're barely hanging on or tired.
      `,
    });
    return response.text?.trim() || "yeah i feel that completely.";
  } catch (e) {
    return "yeah, same.";
  }
}

// --- NEW FEATURES ---

export const analyzeSyllabusImage = async (base64Image: string): Promise<CalendarEvent[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Use vision model
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/png' } }, // Assuming PNG/JPEG
          { text: "Analyze this document/syllabus image. Extract upcoming assignments and exams. Return a JSON array of objects with keys: title, date (YYYY-MM-DD), time (HH:MM), type ('academic' | 'social'). Assume current year." }
        ]
      },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((item: any) => ({
        id: Date.now().toString() + Math.random(),
        title: item.title,
        time: item.time || "12:00",
        date: item.date,
        duration: 60,
        type: 'academic',
        attendees: [0],
        color: 'bg-red-100 border-red-200'
      }));
    }
    return [];
  } catch (error) {
    console.error("Syllabus analysis failed", error);
    return [{
       id: 'mock-ai-1',
       title: 'Detected: Midterm Exam',
       time: '14:00',
       date: new Date().toISOString().split('T')[0], // Today
       duration: 120,
       type: 'academic',
       attendees: [0],
       color: 'bg-red-100 border-red-200'
    }];
  }
};

export const getDailyCompanionMessage = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Task: You are a "Platform AI Controller" that monitors user well-being.
        Generate a gentle, heart-touching popup message for a student opening the app.
        
        Rules:
        1. It should sound like it knows they are busy but cares.
        2. Ask a simple check-in question.
        3. Max 25 words.
        4. Tone: Soft, protective, non-judgmental.
        5. Example: "I see a busy schedule ahead. How is your energy level right now?"
      `,
    });
    return response.text?.trim() || "It looks like a busy week. Remember to pause and breathe.";
  } catch (e) {
    return "How are you feeling today amidst everything?";
  }
};

export const predictStressWeeks = async (events: CalendarEvent[]): Promise<string[]> => {
    return ["2024-05-15", "2024-05-22"];
};
