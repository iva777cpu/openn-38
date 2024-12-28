export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "Consider age appropriateness in conversation", temperature: 0.5 },
    { id: "userGender", text: "What's your gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "impression", text: "How would you like to come across?", prompt: "Match this tone in responses", temperature: 0.8, examples: "Funny, Charming, Flirty" }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "Ensure age-appropriate conversation", temperature: 0.5 },
    { id: "targetGender", text: "What's their gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "targetPersonality", text: "How's their personality?", prompt: "Consider personality traits in conversation", temperature: 0.8, examples: "Outgoing, Reserved, Energetic" },
    { id: "mood", text: "How are they feeling?", prompt: "Consider their emotional state", temperature: 0.5, examples: "Sad, Happy, Confused" },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if relevant", temperature: 0.5, examples: "America, England, Japan" },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively", temperature: 0.5, examples: "Mythology, Traveling, Music" },
    { id: "dislikes", text: "What do they dislike?", prompt: "Avoid these topics", temperature: 0.5, examples: "Spicy food, Loud noises, Crowds" },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use shared interests as conversation starters", temperature: 0.5, examples: "Reading, Gaming, Hiking" },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests as topics", temperature: 0.5, examples: "Harry Potter, The Hobbit, 1984" },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes when relevant", temperature: 0.5, examples: "Pop, Rock, Classical" },
    { id: "humor", text: "How would you describe their sense of humor?", prompt: "Match their humor style", temperature: 0.5, examples: "Dark, Dry, Sarcastic" },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Reference zodiac traits if mentioned", temperature: 0.5, examples: "Leo, Taurus, Scorpio" },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality type in approach", temperature: 0.5, examples: "INTJ, ENFP, ISTP" },
    { id: "style", text: "What's their style?", prompt: "Note their aesthetic preferences", temperature: 0.2, examples: "Casual, Elegant, Sporty" }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "Factor in the context", temperature: 0.5, examples: "Date, Party, Online Texting" },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on previous conversations", temperature: 0.8, examples: "Books, Movies, Food" }
  ]
};