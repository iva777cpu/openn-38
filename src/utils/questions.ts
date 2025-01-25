export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "Consider age in responses and use it to create relatable content", priority: 0.4 },
    { id: "userGender", text: "What's your gender?", prompt: "Consider gender dynamics in conversation", priority: 0.4 },
    { id: "impression", text: "How would you like to come across?", prompt: "Match this exact tone and style in responses", priority: 0.7 },
    { id: "relationship", text: "Who is this person to you?", prompt: "Adjust familiarity and intimacy based on relationship", priority: 0.5 }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "Consider their age when crafting responses", priority: 0.4 },
    { id: "targetGender", text: "What's their gender?", prompt: "Consider gender dynamics in conversation", priority: 0.4 },
    { id: "targetPersonality", text: "How's their personality?", prompt: "Match or complement their personality traits", priority: 0.6 },
    { id: "mood", text: "How are they feeling?", prompt: "Address or acknowledge their current emotional state", priority: 0.8 },
    { id: "origin", text: "Where are they from?", prompt: "Include cultural references if relevant", priority: 0.2 },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively and show knowledge", priority: 0.6 },
    { id: "dislikes", text: "What do they dislike?", prompt: "Avoid or playfully reference their dislikes", priority: 0.5 },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use hobbies as conversation starters or references", priority: 0.7 },
    { id: "books", text: "What are their favorite books?", prompt: "Reference their literary interests when relevant", priority: 0.5 },
    { id: "music", text: "What's their favorite music?", prompt: "Include musical references they would appreciate", priority: 0.4 },
    { id: "humor", text: "How is their sense of humor?", prompt: "Match their specific humor style", priority: 0.7 },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Include subtle zodiac references if appropriate", priority: 0.2 },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality type in approach", priority: 0.3 },
    { id: "style", text: "What's their style?", prompt: "Reference or compliment their aesthetic preferences", priority: 0.4 }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "Tailor responses to this specific context", priority: 0.7 },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Reference or build upon previous conversations", priority: 0.6 }
  ],
};