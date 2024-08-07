import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY, 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { songTitles } = req.body;

  try {
    const indexedTitles = songTitles.map((title, index) => `${index}: ${title}`);
    const { text } = await generateText({
      model: groq('llama-3.1-70b-versatile'),
      prompt: `Rate each song on a scale from 1 to 100 based on how suitable it is for training at the gym.
        Consider the following factors: tempo (0-30), lyrics motivation (0-30), and intensity of percussion (0-40).
        When evaluating lyrics motivation, focus on motivational or energizing lyrics, and avoid scoring high
        for songs with romantic or non-energizing content. Favor songs from the genres of hip-hop, rock, or electronic music,
        as they are generally more suitable for gym workouts. Only assign scores above 75 to songs that excel significantly in all
        three aspects: high tempo, strong motivational lyrics (excluding romantic content), and intense percussion.
        Be critical but fair—high scores should be reserved for songs that stand out in their suitability for gym workouts,
        with a particular preference for the mentioned genres. Return ONLY a JSON object with song indices starting at 0 as keys
        and their corresponding scores as values. Don't include any text or opinion. Just return the JSON.
        Here are the song titles and artists: ${songTitles.map(song => `${song.title} by ${song.artist}`).join(', ')}.`
    });

    // Regular expression to find JSON
    const jsonRegex = /{[^]*}/; // Finds the first JSON in the text
    const match = text.match(jsonRegex);

    if (match) {
      const jsonString = match[0];
      const json = JSON.parse(jsonString);
      res.status(200).json(json);
    } else {
      res.status(400).json({ error: 'No valid JSON found in response' });
    }
  } catch (error) {
    console.error('Error fetching rhythm score:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error fetching rhythm score' });
  }
}
