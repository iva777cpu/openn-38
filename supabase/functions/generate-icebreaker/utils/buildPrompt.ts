export const buildPrompt = (
  userTraits: Record<string, any>,
  targetTraits: Record<string, any>,
  situationInfo: Record<string, any>,
  isFirstTime: boolean
) => {
  console.log('Building prompt with:', { userTraits, targetTraits, situationInfo });
  
  const contextString = `
YOUR TRAITS (The person initiating conversation):
${Object.entries(userTraits)
  .map(([_, value]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}\nINSTRUCTION: ${value.prompt || 'Consider this information'} with priority ${value.priority}.`)
  .join('\n')}

THEIR TRAITS (The person you're approaching):
${Object.entries(targetTraits)
  .map(([_, value]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}\nINSTRUCTION: ${value.prompt || 'Consider this information'} with priority ${value.priority}.`)
  .join('\n')}

SITUATION:
${Object.entries(situationInfo)
  .map(([_, value]) => 
    `${value.questionText} (priority ${value.priority}): ${value.value}\nINSTRUCTION: ${value.prompt || 'Consider this context'} with priority ${value.priority}.`)
  .join('\n')}`;

  console.log('Generated context string:', contextString);

  return `You are a charming conversation expert. Generate numbered, engaging icebreakers that are clever, witty, and fun with refined sentences and flair. Mix formats and types with equal probability, such as:

Teasing or playful banter (if appropriate)
Shared experiences or hypotheticals
Fun facts or bold statements
Other creative options

Focus on charm, humor, and clever phrasing. Use contrasts for dramatic effect, playful twists, or poetic phrasing when possible. try to be friendly and sophisticated, ensuring humor is used appropriately. If referencing anything that may need context (e.g., music, songs, poems, movies, TV shows, books, jokes, mythology, historical events, celebrities, mythological creatures, scientific facts, political events, quotes, proverbs, riddles, fun facts, wordplay, deities, or cultural references, etc.), assume the user doesn't know the context and add a brief explanation in parentheses (max 15 words). Ensure each icebreaker combined with a reference explanation is less than 40 words.

CRITICAL GUIDELINES:
- Mostly use information from the context below
- Return exactly 10 responses, numbered 1-10, where the last 3 should be general icebreakers not related to any traits
- No introductory text or emojis
- Include NO MORE THAN 4 questions in your responses
- NEVER ask the person to:
  - Tell a story
  - Share a joke
  - Give a pickup line
  - Share shopping preferences
  - Explain where they got something
- For each trait or piece of information, use the priority value to determine how much emphasis to give it
- Higher priorities (0.7-0.9) mean these traits should be prominently featured in responses
- Lower priorities (0.2-0.4) mean these traits should be referenced less frequently or subtly
- Conversation Context: ${isFirstTime ? 'This is a first-time conversation, focus on initial introductions and ice-breaking' : 'These people have talked before, at least once'}

Context (USE ONLY THIS INFORMATION):
${contextString}

Additional Context:
- First time conversation: ${isFirstTime ? 'Yes - Focus on initial introductions and getting to know each other' : 'No - They have talked before, build upon existing familiarity'}`;
};