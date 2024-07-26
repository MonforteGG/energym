import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Configura el cliente de Groq con la clave de API
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

// Función para obtener puntuación del ritmo
export const getRhythmScore = async (songTitles) => {
  try {
    const { text } = await generateText({
      model: groq('llama3-8b-8192'),
      prompt: `Rate each song on a scale from 1 to 100 based on the rhythm of the song. Return only a JSON object with song names as keys and scores as values. Do not include any explanations or text outside the JSON object. Here are the song titles: ${songTitles.join(', ')}.`,
      temperature: 0, // Para respuestas más consistentes
    });

    // Intentamos parsear el texto como JSON
    try {
      const scoresObject = JSON.parse(text.trim());
      return scoresObject;
    } catch (parseError) {
      console.error('Error parsing rhythm scores JSON:', parseError);
      throw new Error('Invalid JSON response from AI');
    }
  } catch (error) {
    console.error('Error fetching rhythm score:', error.response ? error.response.data : error.message);
    throw error;
  }
};
