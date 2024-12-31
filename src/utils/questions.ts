export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "Consider age appropriateness in conversation", temperature: 0.5 },
    { id: "userGender", text: "What's your gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "impression", text: "How would you like to come across?", prompt: "Match this tone in responses", temperature: 0.8 }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "Ensure age-appropriate conversation", temperature: 0.5 },
    { id: "targetGender", text: "What's their gender?", prompt: "Consider gender dynamics", temperature: 0.5 },
    { id: "targetPersonality", text: "How's their personality?", prompt: "Consider personality traits", temperature: 0.6, examples: "Bitter, Outgoing, Reserved" },
    { id: "mood", text: "How are they feeling?", prompt: "Consider emotional state", temperature: 0.6, examples: "Sad, Happy, Angry" },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if needed", temperature: 0.2 },
    { id: "loves", text: "What do they love?", prompt: "Reference interests positively", temperature: 0.6, examples: "Mythology, Traveling, Books" },
    { id: "dislikes", text: "What do they dislike?", prompt: "Playfully tease about these", temperature: 0.5 },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use as conversation starters", temperature: 0.6 },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests", temperature: 0.6 },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes", temperature: 0.5 },
    { id: "humor", text: "How is their sense of humor?", prompt: "Match humor style", temperature: 0.6 },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Reference zodiac traits occasionally", temperature: 0.3 },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality type", temperature: 0.3 },
    { id: "style", text: "What's their style?", prompt: "Note aesthetic preferences", temperature: 0.3 }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "Match context appropriately", temperature: 0.7 },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on past conversations", temperature: 0.6 }
  ]
};