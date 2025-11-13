import { useMemo, useState } from 'react';
import { getBackendReadiness } from '../api/config';
import { ensureStudyFolder } from '../api/folders';
import { generateQuizWithOpenAI, requestQuiz } from '../api/generation';
import { isOpenAIConfigured } from '../api/openai';

const questionTypes = ['Multiple choice', 'Open response', 'Image labeling', 'Audio comprehension', 'Code review'];

interface Question {
  id: number;
  prompt: string;
  type: string;
  difficulty: number;
}

export function QuizBuilder() {
  const [topic, setTopic] = useState('Neural networks fundamentals');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState(3);
  const [includeImages, setIncludeImages] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState(0);
  const [folderName, setFolderName] = useState('Neural Networks Sprint');
  const [folderId, setFolderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const backendReadiness = getBackendReadiness();
  const backendReady = backendReadiness === 'ready';
  const openAIReady = isOpenAIConfigured();

  type Tone = 'success' | 'warning' | 'danger';
  const tone: Tone = backendReady
    ? 'success'
    : openAIReady
      ? 'success'
      : backendReadiness === 'partial'
        ? 'warning'
        : 'danger';
  const statusLabel = backendReady
    ? 'Supabase Edge Functions connected'
    : openAIReady
      ? 'Direct OpenAI (gpt-4o-mini)'
      : backendReadiness === 'partial'
        ? 'Missing Supabase Function URL'
        : 'Local preview only';

  const toneStyles: Record<Tone, { background: string; color: string }> = {
    success: { background: 'rgba(34, 197, 94, 0.18)', color: '#16a34a' },
    warning: { background: 'rgba(251, 191, 36, 0.18)', color: '#ca8a04' },
    danger: { background: 'rgba(248, 113, 113, 0.18)', color: '#dc2626' }
  };

  const questionPool = useMemo(() => {
    const basePrompts = [
      'Explain this concept in your own words.',
      'Select the correct statement from the options.',
      'Label the important parts of the diagram.',
      'Solve the scenario using the given data.',
      'Debug the snippet and describe the fix.'
    ];

    return basePrompts.map((prompt, index) => ({
      id: index + 1,
      prompt,
      type: questionTypes[index % questionTypes.length],
      difficulty: Math.max(1, Math.min(5, difficulty + (index % 3) - 1))
    }));
  }, [difficulty]);

  const handleGenerate = () => {
    const run = async () => {
      try {
        setError(null);
        setIsGenerating(true);

        if (backendReady) {
          const folder = await ensureStudyFolder(folderName);
          setFolderId(folder.id);

          const { questions: remoteQuestions, progress: remoteProgress } = await requestQuiz({
            folderId: folder.id,
            questionCount,
            difficulty,
            includeImages
          });

          setQuestions(
            remoteQuestions.map((question, index) => ({
              id: Number(question.id ?? index + 1),
              prompt: question.prompt,
              type: question.type,
              difficulty: question.difficulty
            }))
          );
          setProgress(Math.max(0, Math.min(100, remoteProgress)));
          return;
        }

        if (openAIReady) {
          const { questions: aiQuestions, progress: aiProgress } = await generateQuizWithOpenAI({
            topic,
            questionCount,
            difficulty,
            includeImages
          });

          setQuestions(
            aiQuestions.map((question, index) => ({
              id: Number(question.id ?? index + 1),
              prompt: question.prompt,
              type: question.type,
              difficulty: question.difficulty
            }))
          );
          setFolderId('openai-session');
          setProgress(aiProgress);
          return;
        }

        const newQuestions = Array.from({ length: questionCount }, (_, idx) => {
          const template = questionPool[idx % questionPool.length];
          return {
            ...template,
            id: idx + 1,
            prompt: `${template.prompt} (Topic: ${topic})`
          };
        });

        setQuestions(newQuestions);
        setFolderId('local-preview');
        setProgress((prev) => Math.min(100, prev + 25));
      } catch (generationError) {
        console.error(generationError);
        setError(generationError instanceof Error ? generationError.message : 'Unable to generate a quiz right now.');
      } finally {
        setIsGenerating(false);
      }
    };

    void run();
  };

  return (
    <section
      id="quizzes"
      style={{
        marginTop: '1.5rem',
        padding: '3rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(150deg, rgba(59, 130, 246, 0.12), transparent)',
        border: '1px solid var(--outline)',
        display: 'grid',
        gap: '2rem'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Custom Quiz Generator</h2>
        <p className="section-subtitle">
          Craft quizzes with adaptive difficulty, multimedia prompts, and instant progress tracking. Perfect for solo drills or
          collaborative study rooms.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
        }}
      >
        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ fontWeight: 600 }}>What are you studying?</span>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="e.g., Cardiology basics"
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '18px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)',
              color: 'var(--text)'
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ fontWeight: 600 }}>How many questions?</span>
          <input
            type="number"
            min={1}
            max={15}
            value={questionCount}
            onChange={(event) => setQuestionCount(Number(event.target.value))}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '18px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)'
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ fontWeight: 600 }}>Difficulty focus: {difficulty}/5</span>
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={(event) => setDifficulty(Number(event.target.value))}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={includeImages}
            onChange={(event) => setIncludeImages(event.target.checked)}
          />
          Include diagram-based questions
        </label>
      </div>

      <label style={{ display: 'grid', gap: '0.45rem' }}>
        <span style={{ fontWeight: 600 }}>Study folder name</span>
        <input
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
          placeholder="e.g., Anatomy finals review"
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '18px',
            border: '1px solid var(--outline)',
            background: 'var(--surface-strong)',
            color: 'var(--text)'
          }}
        />
      </label>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <span
          style={{
            padding: '0.3rem 0.85rem',
            borderRadius: 999,
            fontSize: '0.78rem',
            fontWeight: 600,
            background: toneStyles[tone].background,
            color: toneStyles[tone].color
          }}
        >
          {statusLabel}
        </span>
        {folderId && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last folder: {folderId}</span>}
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          justifySelf: 'flex-start',
          padding: '0.95rem 2rem',
          borderRadius: '999px',
          border: 'none',
          background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
          color: '#fff',
          fontWeight: 700,
          letterSpacing: '0.02em'
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate adaptive quiz'}
      </button>

      {error && (
        <div
          role="alert"
          style={{
            padding: '0.9rem 1.1rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(248, 113, 113, 0.12)',
            color: '#dc2626',
            fontSize: '0.85rem',
            border: '1px solid rgba(248, 113, 113, 0.35)'
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div
          style={{
            height: 12,
            borderRadius: 999,
            background: 'rgba(148, 163, 184, 0.18)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Adaptive engine confidence: {Math.min(100, progress + difficulty * 8)}%
        </span>
      </div>

      {questions.length > 0 && (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-strong)',
            border: '1px solid var(--outline)'
          }}
        >
          <h3 style={{ margin: 0 }}>Preview ({includeImages ? 'with' : 'without'} diagrams)</h3>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.75rem' }}>
            {questions.map((question) => (
              <li key={question.id}>
                <div style={{ fontWeight: 600 }}>{question.prompt}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Type: {question.type} • Difficulty: {question.difficulty}/5
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
