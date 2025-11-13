const apiKey = import.meta.env.VITE_OPENAI_API_KEY ?? '';
const baseUrl = (import.meta.env.VITE_OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
const defaultModel = import.meta.env.VITE_OPENAI_MODEL ?? 'gpt-4o-mini';
const organization = import.meta.env.VITE_OPENAI_ORG ?? '';

export type OpenAIChatRole = 'system' | 'user' | 'assistant';

export interface OpenAIChatMessage {
  role: OpenAIChatRole;
  content: string;
}

export interface OpenAIChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(apiKey);
}

export async function openAIChat(messages: OpenAIChatMessage[], options: OpenAIChatOptions = {}): Promise<string> {
  if (!apiKey) {
    throw new Error('The OpenAI API key is not configured.');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(organization ? { 'OpenAI-Organization': organization } : {})
    },
    body: JSON.stringify({
      model: options.model ?? defaultModel,
      messages,
      temperature: options.temperature ?? 0.6,
      max_tokens: options.maxTokens
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || 'Failed to contact the OpenAI service.');
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error('The AI response did not include any content.');
  }

  return content;
}
