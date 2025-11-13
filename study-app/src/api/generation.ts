import { backendConfig, isBackendReady } from './config';
import { isOpenAIConfigured, openAIChat } from './openai';

export interface FlashcardPayload {
  folderId: string;
  notes?: string;
}

export interface FlashcardResponseItem {
  id?: string;
  front: string;
  back: string;
  tag?: string;
}

export interface FlashcardGenerationResult {
  flashcards: FlashcardResponseItem[];
  summary: string;
}

export interface QuizGenerationParams {
  folderId: string;
  questionCount: number;
  difficulty: number;
  includeImages: boolean;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  type: string;
  difficulty: number;
  mediaUrl?: string;
}

export interface QuizGenerationResult {
  questions: QuizQuestion[];
  progress: number;
}

const QUIZ_TYPES = ['Multiple choice', 'Open response', 'Image labeling', 'Audio comprehension', 'Code review'];
const FLASHCARD_FALLBACK_TAGS = ['Key idea', 'Memory hook', 'Quick win', 'Common trap', 'Deep dive'];

function extractJsonBlock<T>(input: string): T {
  const fencedMatch = input.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1] : input;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('The AI response did not include valid JSON.');
  }

  const json = candidate.slice(start, end + 1);
  return JSON.parse(json) as T;
}

function normalizeQuizType(type: string | undefined, index: number): string {
  if (!type) {
    return QUIZ_TYPES[index % QUIZ_TYPES.length];
  }

  const normalized = QUIZ_TYPES.find((value) => value.toLowerCase() === type.toLowerCase());
  return normalized ?? QUIZ_TYPES[index % QUIZ_TYPES.length];
}

async function postToFunction<T>(route: string, body: unknown): Promise<T> {
  if (!isBackendReady()) {
    throw new Error('The backend environment variables are missing.');
  }

  const response = await fetch(`${backendConfig.functionsUrl}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'The AI generation service returned an error.');
  }

  return (await response.json()) as T;
}

export async function requestFlashcards(payload: FlashcardPayload): Promise<FlashcardGenerationResult> {
  return postToFunction<FlashcardGenerationResult>('/generator/flashcards', payload);
}

export async function requestQuiz(payload: QuizGenerationParams): Promise<QuizGenerationResult> {
  return postToFunction<QuizGenerationResult>('/generator/quiz', payload);
}

export async function generateFlashcardsWithOpenAI(input: {
  focus: string;
  notes: string;
  materials: string[];
  cardCount?: number;
}): Promise<FlashcardGenerationResult> {
  if (!isOpenAIConfigured()) {
    throw new Error('The OpenAI API key is not configured.');
  }

  const cardCount = Math.max(4, Math.min(12, input.cardCount ?? 6));
  const materialsBlock = input.materials
    .filter(Boolean)
    .map((material, index) => `Material ${index + 1}: ${material}`)
    .join('\n\n');

  const userPrompt = [
    `Study focus: ${input.focus || 'General review'}.`,
    input.notes ? `Learner notes: ${input.notes}` : null,
    materialsBlock ? `Source materials:\n${materialsBlock}` : null,
    `Generate ${cardCount} flashcards that cover the most important concepts, misconceptions to avoid, and memory aids.`,
    'Return a JSON object with the keys "summary" and "flashcards". Each flashcard must have the keys "front", "back", and "tag". '
      + 'Keep the JSON strictly valid and do not include commentary outside the JSON structure.'
  ]
    .filter(Boolean)
    .join('\n\n');

  const response = await openAIChat(
    [
      {
        role: 'system',
        content:
          'You are AetherLearn, an AI study companion that crafts flashcards, mnemonics, and summaries for students. '
          + 'Always respond with strict JSON when asked.'
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    { temperature: 0.4 }
  );

  const parsed = extractJsonBlock<{ summary: string; flashcards: FlashcardResponseItem[] }>(response);

  if (!parsed.summary || !Array.isArray(parsed.flashcards)) {
    throw new Error('The AI response was missing flashcards or a summary.');
  }

  const normalized = parsed.flashcards
    .map((card, index) => ({
      front: card.front?.trim() ?? '',
      back: card.back?.trim() ?? '',
      tag: card.tag ?? FLASHCARD_FALLBACK_TAGS[index % FLASHCARD_FALLBACK_TAGS.length]
    }))
    .filter((card) => card.front.length > 0 && card.back.length > 0);

  if (normalized.length === 0) {
    throw new Error('The AI response did not include any usable flashcards.');
  }

  return {
    summary: parsed.summary,
    flashcards: normalized
  };
}

export async function generateQuizWithOpenAI(input: {
  topic: string;
  questionCount: number;
  difficulty: number;
  includeImages: boolean;
  context?: string;
  materials?: string[];
}): Promise<QuizGenerationResult> {
  if (!isOpenAIConfigured()) {
    throw new Error('The OpenAI API key is not configured.');
  }

  const questionCount = Math.max(3, Math.min(15, input.questionCount));
  const materialsBlock = (input.materials ?? [])
    .filter(Boolean)
    .map((material, index) => `Material ${index + 1}: ${material}`)
    .join('\n\n');

  const userPrompt = [
    `Topic: ${input.topic || 'General knowledge review'}.`,
    `Difficulty (1 easy - 5 expert): ${Math.max(1, Math.min(5, input.difficulty))}.`,
    input.includeImages
      ? 'Include at least one question that references an image-based description if possible.'
      : 'Do not include any image-based questions.',
    input.context ? `Additional context from the learner: ${input.context}` : null,
    materialsBlock ? `Reference materials:\n${materialsBlock}` : null,
    `Create ${questionCount} questions. Each question must include the fields "prompt", "type", and "difficulty". `
      + `Use only these question types: ${QUIZ_TYPES.join(', ')}.`,
    'Return strict JSON with the keys "questions" (an array) and "progress" (a number from 0-100). '
      + 'Do not include any commentary outside the JSON.'
  ]
    .filter(Boolean)
    .join('\n\n');

  const response = await openAIChat(
    [
      {
        role: 'system',
        content:
          'You are an adaptive learning coach that produces targeted quiz questions. '
          + 'Always reply using valid JSON when giving structured outputs.'
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    { temperature: 0.55 }
  );

  const parsed = extractJsonBlock<{ questions: QuizQuestion[]; progress?: number }>(response);

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('The AI response did not include any quiz questions.');
  }

  const normalizedQuestions = parsed.questions.map((question, index) => ({
    id: question.id ?? String(index + 1),
    prompt: question.prompt,
    type: normalizeQuizType(question.type, index),
    difficulty: Math.max(1, Math.min(5, question.difficulty ?? input.difficulty)),
    mediaUrl: question.mediaUrl
  }));

  const progress = Math.max(0, Math.min(100, parsed.progress ?? 60));

  return {
    questions: normalizedQuestions,
    progress
  };
}
