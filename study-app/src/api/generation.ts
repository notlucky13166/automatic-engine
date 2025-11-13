import { backendConfig, isBackendReady } from './config';

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
