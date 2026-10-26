/**
 * Serverless API Function: Orientador Clínico con Google AI (Gemini)
 * Compatible con Vercel, Netlify y Node.js Express.
 * 
 * Requiere variable de entorno:
 * GEMINI_API_KEY="AIzaSy..."
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utiliza POST.' });
  }

  try {
    const { message, lang = 'es' } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje del consultante es obligatorio.' });
    }

    // Limitar longitud para evitar abusos
    const sanitizedMessage = message.trim().slice(0, 1000);
    const isEn = lang === 'en';

    const apiKey = process.env.GEMINI_API_KEY;

    // Si no hay API Key configurada en el hosting, devolver respuesta estructurada clínica
    if (!apiKey) {
      console.warn('GEMINI_API_KEY no encontrada en variables de entorno. Usando generador clínico de respaldo.');
      return res.status(200).json(generateClinicalFallback(sanitizedMessage, lang));
    }

    const systemPrompt = `Eres la asistente clínica y de triaje empático de la psicóloga Jessica Prieto (Universidad del Magdalena, Magíster en Psicología en las Organizaciones, atención Virtual para Colombia/exterior y Presencial en Barranquilla).
Tu misión es recibir el motivo de consulta de la persona con calidez, validación empática, respeto y rigor ético profesional (basado en TCC, ACT y regulación del estrés/sistema nervioso).
Lema del consultorio: "Escucha · Comprende · Acompaña".

IMPORTANTE: Responde EXCLUSIVAMENTE con un JSON válido con la siguiente estructura exacta:
{
  "validacion": "Párrafo empático que valide lo que la persona siente sin juzgar, normalizando su respuesta ante la sobrecarga o el dolor.",
  "patron": "Breve frase identificando el foco o síntoma predominante (ej. Ansiedad anticipatoria y sobrecarga cognitiva).",
  "enfoque": "Enfoque terapéutico sugerido (ej. Terapia Cognitivo-Conductual (TCC) + ACT y Regulación Emocional).",
  "pregunta": "Una pregunta introspectiva respetuosa y compasiva para reflexionar de cara a la primera sesión con Jessica Prieto."
}
Idioma: ${isEn ? 'Inglés' : 'Español'}. No uses asteriscos ni markdown dentro de las cadenas.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `Motivo de consulta del paciente: "${sanitizedMessage}"` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Error de Gemini API:', response.status, errText);
      return res.status(200).json(generateClinicalFallback(sanitizedMessage, lang));
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Respuesta vacía de Gemini');
    }

    const parsedJson = JSON.parse(candidateText.trim());
    return res.status(200).json(parsedJson);

  } catch (error) {
    console.error('Error procesando consulta clínica con Google AI:', error);
    return res.status(200).json(generateClinicalFallback(req.body?.message || '', req.body?.lang || 'es'));
  }
}

// Respaldo clínico inteligente si la API falla o no tiene clave
function generateClinicalFallback(text, lang) {
  const lower = (text || '').toLowerCase();
  const isEn = lang === 'en';

  if (lower.includes('ruptura') || lower.includes('pareja') || lower.includes('terminar') || lower.includes('breakup')) {
    return {
      validacion: isEn 
        ? "Navigating a separation or relationship struggle is a deeply valid emotional grief. Feeling disoriented, anxious, or fearful of the unknown are natural human responses to losing an attachment bond."
        : "Atravesar un dolor vincular o una ruptura amorosa es un duelo real y profundo. La sensación de vacío, el miedo a la incertidumbre y el vaivén emocional son respuestas naturales ante la pérdida de un vínculo significativo.",
      patron: isEn 
        ? "Relational transition, attachment hurt, and autonomy rebuilding"
        : "Duelo afectivo, dolor de apego y reconfiguración de la autonomía personal",
      enfoque: isEn 
        ? "Compassion-Focused Therapy (CFT) & Attachment Theory"
        : "Terapia Focalizada en la Compasión (CFT) y Teoría del Apego",
      pregunta: isEn 
        ? "¿What gentle words would you offer to someone you love if they were walking through this same heartbreak?"
        : "¿Qué le dirías con amor y ternura a alguien muy querido si estuviese atravesando este mismo dolor?"
    };
  }

  if (lower.includes('trabajo') || lower.includes('burnout') || lower.includes('agotamiento') || lower.includes('work')) {
    return {
      validacion: isEn 
        ? "Burnout is not a personal failure; it is the physiological reaction of an overextended nervous system that has spent too long in survival mode without restorative pauses."
        : "El agotamiento laboral no es falta de fortaleza personal; es la respuesta biológica de un organismo que lleva demasiado tiempo en modo supervivencia sin pausas reales de desconexión.",
      patron: isEn 
        ? "Occupational burnout and stress overload"
        : "Síndrome de Burnout y sobrecarga sostenida del eje del estrés",
      enfoque: isEn 
        ? "Nervous System Down-Regulation & Environmental Boundary Setting"
        : "Desescalada del Sistema Nervioso y Rediseño de Límites Laborales",
      pregunta: isEn 
        ? "¿What is one boundary between your workday and your personal space that you need to protect this week?"
        : "¿Cuál es el primer límite entre tu trabajo y tu vida personal que necesitas blindar esta semana?"
    };
  }

  return {
    validacion: isEn 
      ? "What you are experiencing is deeply understandable. Putting these feelings into words is a brave first step. Your mind and body are simply reacting to accumulated weight and need a secure space to unpack."
      : "Lo que estás sintiendo tiene todo el sentido del mundo. Poner en palabras este malestar es un acto de gran valentía. Tu mente y tu cuerpo no están rotos; simplemente están reaccionando a un nivel de sobrecarga prolongada y necesitan un espacio seguro para descargar.",
    patron: isEn 
      ? "Elevated anxiety and cognitive overactivation"
      : "Activación del sistema nervioso y sobrecarga cognitiva",
    enfoque: isEn 
      ? "CBT (Cognitive Behavioral Therapy) + ACT & Somatic Grounding"
      : "Terapia Cognitivo-Conductual (TCC) + ACT y Regulación Emocional",
    pregunta: isEn 
      ? "¿What is one expectation you could release this week to give yourself some breathing room?"
      : "¿Qué exigencia o expectativa podrías permitirte aflojar hoy para darte un poco de aire?"
  };
}
