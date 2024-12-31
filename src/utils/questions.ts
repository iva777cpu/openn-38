export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "This is the user's age. Consider age appropriateness in conversation", temperature: 0.5 },
    { id: "userGender", text: "What's your gender?", prompt: "This is the user's gender. Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "impression", text: "How would you like to come across?", prompt: "This is how the user wants to be perceived. Match this tone in responses", temperature: 0.8, examples: "Funny, Charming, Flirty" }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "This is the target person's age. Ensure age-appropriate conversation", temperature: 0.5 },
    { id: "targetGender", text: "What's their gender?", prompt: "This is the target person's gender. Consider gender dynamics in conversation", temperature: 0.5 },
    { id: "targetPersonality", text: "How's their personality?", prompt: "This describes the target person's personality traits", temperature: 0.8, examples: "Outgoing, Reserved, Energetic" },
    { id: "mood", text: "How are they feeling?", prompt: "This is the target person's current emotional state", temperature: 0.7, examples: "Sad, Happy, Confused" },
    { id: "origin", text: "Where are they from?", prompt: "This is the target person's origin/nationality", temperature: 0.6, examples: "America, England, Japan" },
    { id: "loves", text: "What do they love?", prompt: "These are the target person's interests and likes", temperature: 0.8, examples: "Mythology, Traveling, Music" },
    { id: "dislikes", text: "What do they dislike?", prompt: "These are things the target person dislikes - avoid these topics", temperature: 0.6, examples: "Spicy food, Loud noises, Crowds" },
    { id: "hobbies", text: "What are their hobbies?", prompt: "These are the target person's hobbies and activities", temperature: 0.8, examples: "Reading, Gaming, Hiking" },
    { id: "books", text: "What are their favorite books?", prompt: "These are the target person's favorite books", temperature: 0.7, examples: "Harry Potter, The Hobbit, 1984" },
    { id: "music", text: "What's their favorite music?", prompt: "This is the target person's music taste", temperature: 0.7, examples: "Pop, Rock, Classical" },
    { id: "humor", text: "How is their sense of humor?", prompt: "This describes the target person's humor style", temperature: 0.9, examples: "Dark, Dry, Sarcastic" },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "This is the target person's zodiac sign", temperature: 0.7, examples: "Leo, Taurus, Scorpio" },
    { id: "mbti", text: "What's their MBTI type?", prompt: "This is the target person's MBTI personality type", temperature: 0.6, examples: "INTJ, ENFP, ISTP" },
    { id: "style", text: "What's their style?", prompt: "This describes the target person's fashion/aesthetic preferences", temperature: 0.7, examples: "Casual, Elegant, Sporty" }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "This describes the context/scenario of the interaction", temperature: 0.8, examples: "Date, Party, Online Texting" },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "These are topics already discussed with the target person", temperature: 0.7, examples: "Books, Movies, Food" }
  ]
};