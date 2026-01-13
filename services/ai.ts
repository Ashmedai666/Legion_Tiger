import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from "../lib/constants";

// Initialize the Gemini client
const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateTacticalAdvice = async (query: string): Promise<string> => {
  if (!ai) {
    return "Тактический советник офлайн: Ключ API отсутствует.";
  }

  // Contextualize the AI with product knowledge
  const productContext = MOCK_PRODUCTS.map(p => 
    `${p.name} (${p.category}): ${p.description}. Specs: ${JSON.stringify(p.specs)}`
  ).join('\n');

  const systemInstruction = `
    Ты — "Советник Легион Тигр", экспертный ИИ-ассистент магазина премиального тактического снаряжения "ЛЕГИОН_ТИГР".
    Твой тон — профессиональный, лаконичный, военный и полезный. Ты общаешься на русском языке.
    Ты ставишь во главу угла функциональность и надежность.
    Используй следующий каталог товаров для ответов на вопросы пользователей:
    ${productContext}
    
    Если пользователь спрашивает о чем-то, чего нет в каталоге, дай общий тактический совет, но упомяни, что у нас этого пока нет.
    Держи ответы короче 150 слов.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || "Связь прервана. Попробуйте снова.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Сигнал потерян. Советник недоступен.";
  }
};