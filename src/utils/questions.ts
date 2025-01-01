export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "Consider age", temperature: 0.5 },
    { id: "userGender", text: "What's your gender?", prompt: "Consider gender", temperature: 0.5 },
    { id: "impression", text: "How would you like to come across?", prompt: "Match this tone in responses", temperature: 0.8 },
    { id: "relationship", text: "Who is this person to you?", prompt: "Consider relationship context", temperature: 0.6 }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "Consider age", temperature: 0.5 },
    { id: "targetGender", text: "What's their gender?", prompt: "Consider gender", temperature: 0.5 },
    { id: "targetPersonality", text: "How's their personality?", prompt: "Consider personality traits", temperature: 0.6 },
    { id: "mood", text: "How are they feeling?", prompt: "Consider their emotional state", temperature: 0.6 },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if relevant or needed", temperature: 0.2 },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively", temperature: 0.6 },
    { id: "dislikes", text: "What do they dislike?", prompt: "Playfully tease about these or wittily hate on them too", temperature: 0.5 },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use interests as conversation starters", temperature: 0.6 },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests as topics", temperature: 0.6 },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes when relevant", temperature: 0.5 },
    { id: "humor", text: "How is their sense of humor?", prompt: "Match their humor style", temperature: 0.6 },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Reference zodiac traits occasionally", temperature: 0.3 },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality traits in approach", temperature: 0.3 },
    { id: "style", text: "What's their style?", prompt: "Note their aesthetic preferences", temperature: 0.3 }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "Try to match your responses according to the situation", temperature: 0.7 },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on previous conversations", temperature: 0.6 }
  ]
};
