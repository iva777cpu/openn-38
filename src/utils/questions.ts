export const questions = {
  userTraits: [
    { id: "userAge", text: "How old are you?", prompt: "Consider age appropriateness in conversation", temperature: 0.5, examples: "Enter age" },
    { id: "userGender", text: "What's your gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5, examples: "Enter gender" },
    { id: "impression", text: "How would you like to come across?", prompt: "Match this tone in responses", temperature: 0.8, examples: "Confident, Funny, Mysterious" }
  ],
  targetTraits: [
    { id: "targetAge", text: "How old are they?", prompt: "Ensure age-appropriate conversation", temperature: 0.5, examples: "Enter age" },
    { id: "targetGender", text: "What's their gender?", prompt: "Consider gender dynamics in conversation", temperature: 0.5, examples: "Enter gender" },
    { id: "targetPersonality", text: "How's their personality?", prompt: "Consider personality traits in conversation", temperature: 0.6, examples: "Bitter, Outgoing, Reserved" },
    { id: "mood", text: "How are they feeling?", prompt: "Consider their emotional state", temperature: 0.6, examples: "Sad, Happy, Angry" },
    { id: "origin", text: "Where are they from?", prompt: "Consider cultural context if relevant or needed", temperature: 0.2, examples: "Country or city" },
    { id: "loves", text: "What do they love?", prompt: "Reference their interests positively", temperature: 0.6, examples: "Mythology, Traveling, Books" },
    { id: "dislikes", text: "What do they dislike?", prompt: "Avoid these topics", temperature: 0.5, examples: "Topics they dislike" },
    { id: "hobbies", text: "What are their hobbies?", prompt: "Use interests as conversation starters", temperature: 0.6, examples: "Their activities and interests" },
    { id: "books", text: "What are their favorite books?", prompt: "Use literary interests as topics", temperature: 0.6, examples: "Book titles or genres" },
    { id: "music", text: "What's their favorite music?", prompt: "Reference musical tastes when relevant", temperature: 0.5, examples: "Artists or genres" },
    { id: "humor", text: "How would you describe their sense of humor?", prompt: "Match their humor style", temperature: 0.6, examples: "Dark, Sarcastic, Silly" },
    { id: "zodiac", text: "What's their zodiac sign?", prompt: "Sometimes reference zodiac traits if needed", temperature: 0.3, examples: "Their zodiac sign" },
    { id: "mbti", text: "What's their MBTI type?", prompt: "Consider personality traits in approach", temperature: 0.3, examples: "INFJ, ENTP, etc" },
    { id: "style", text: "What's their style?", prompt: "Note their aesthetic preferences", temperature: 0.3, examples: "Their fashion or aesthetic" }
  ],
  generalInfo: [
    { id: "situation", text: "What's the situation?", prompt: "Try to match your responses according to the situation", temperature: 0.7, examples: "Context of interaction" },
    { id: "previousTopics", text: "What topics have you chatted about before?", prompt: "Build on previous conversations", temperature: 0.6, examples: "Previous conversation topics" }
  ]
};