// Fallback prompts when Gemini API is not available
const FALLBACK_PROMPTS = [
  "Describe the flavor of the color beige.",
  "Your group chat is silent after you sent a meme. What's your next move?",
  "The year is 2050. What's a '/r/OldPeopleFacebook' post about?",
  "Your phone autocorrects 'okay' to 'ok boomer'. How do you respond?",
  "You're stuck in an elevator with your ex. What's the first thing you say?",
  "Your WiFi password is 'password123'. How do you explain this to guests?",
  "You accidentally liked a post from 2018. What's your excuse?",
  "Your mom just discovered TikTok. What's the first thing she posts?",
  "You're at a restaurant and the waiter calls you 'boss'. How do you react?",
  "Your dating app bio says 'I'm not like other girls'. What's your actual personality?",
  "You're in a meeting and someone says 'synergy'. What's your internal monologue?",
  "Your friend just said 'I'm not a morning person' at 3 PM. Your thoughts?",
  "You're at a party and someone asks 'What do you do?'. What's your elevator pitch?",
  "Your neighbor is mowing their lawn at 7 AM on Sunday. What's your revenge plan?",
  "You're in a group chat and someone sends 'This aged well'. What's the context?"
];

export const getDailyHumorPrompt = async (): Promise<string> => {
  // For now, return a random fallback prompt since Gemini API is disabled
  const randomIndex = Math.floor(Math.random() * FALLBACK_PROMPTS.length);
  return FALLBACK_PROMPTS[randomIndex];
};
