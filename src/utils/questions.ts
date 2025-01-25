export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "Consider age", priority: 0.4 },
    { id: "userGender", text: "What's your gender?", prompt: "Consider gender", priority: 0.4 },
    { id: "impression", text: "How would you like to come across?", prompt: "Match this tone in responses", priority: 0.7 },
    { id: "relationship", text: "Who is this person to you?", prompt: "Consider relationship context", priority: 0.5 }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "Consider age", priority: 0.4 },
    { id: "targetGender", text: "What's their gender?", prompt: "Consider gender", priority: 0.4 },
    { id: "targetPersonality", text: "How's their personality?", prompt: "Consider personality traits", priority: 0.6 },
    { id: "mood", text: "How are they feeling?", prompt: "Consider their emotional state", priority: 0.8 },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if relevant or needed", priority: 0.2 },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively", priority: 0.6 },
    { id: "dislikes", text: "What do they dislike?", prompt: "Playfully tease about these or wittily hate on them too", priority: 0.5 },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use interests as conversation starters", priority: 0.7 },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests as topics", priority: 0.5 },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes when relevant", priority: 0.4 },
    { id: "humor", text: "How is their sense of humor?", prompt: "Match their humor style", priority: 0.7 },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Reference zodiac traits occasionally", priority: 0.2 },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality traits in approach", priority: 0.3 },
    { id: "style", text: "What's their style?", prompt: "Note their aesthetic preferences", priority: 0.4 }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "Try to match your responses according to the situation", priority: 0.7 },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on previous conversations", priority: 0.6 }
  ],
};
