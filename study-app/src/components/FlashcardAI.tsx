import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { getBackendReadiness } from '../api/config';
import { ensureStudyFolder, uploadFolderAssets } from '../api/folders';
import { generateFlashcardsWithOpenAI, requestFlashcards } from '../api/generation';
import { isOpenAIConfigured } from '../api/openai';

type UploadState = 'idle' | 'processing' | 'complete';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  tag: string;
}

const tags = ['Key idea', 'Formula', 'Case study', 'Mnemonic', 'Follow-up'];
const NOTES_PLACEHOLDER = 'Paste extra context or lecture takeaways...';

export function FlashcardAI() {
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState(NOTES_PLACEHOLDER);
  const [state, setState] = useState<UploadState>('idle');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState('');
  const [folderName, setFolderName] = useState('Neural Networks Sprint');
  const [folderId, setFolderId] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const uploaded = Array.from(event.target.files ?? []);
    setFiles(uploaded);
  };

  const prepareMaterials = async (selectedFiles: File[]) => {
    const materialPromises = selectedFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result !== 'string') {
              resolve('');
              return;
            }

            const preview = reader.result.slice(0, 2000);

            if (file.type.startsWith('text/') || /\.(md|txt|csv)$/i.test(file.name)) {
              resolve(`Text file ${file.name}: ${preview}`);
              return;
            }

            if (file.type === 'application/pdf') {
              resolve(`PDF document ${file.name} (base64 preview): ${preview}`);
              return;
            }

            if (file.type.startsWith('image/')) {
              resolve(`Image ${file.name} encoded as data URL: ${preview}`);
              return;
            }

            resolve(`File ${file.name} encoded as data URL: ${preview}`);
          };

          if (file.type.startsWith('text/') || /\.(md|txt|csv)$/i.test(file.name)) {
            reader.readAsText(file);
          } else {
            reader.readAsDataURL(file);
          }
        })
    );

    const materials = await Promise.all(materialPromises);
    return materials.filter(Boolean);
  };

  const generateFlashcards = async () => {
    try {
      setError(null);
      setState('processing');
      const notePayload = notes === NOTES_PLACEHOLDER ? '' : notes.trim();

      if (backendReady) {
        const folder = await ensureStudyFolder(folderName);
        setFolderId(folder.id);

        if (files.length > 0) {
          await uploadFolderAssets(folder.id, files);
        }

        const { flashcards, summary: backendSummary } = await requestFlashcards({
          folderId: folder.id,
          notes: notePayload || undefined
        });

        const normalized = flashcards.map((card, index) => ({
          id: Number(card.id ?? index + 1),
          front: card.front,
          back: card.back,
          tag: card.tag ?? tags[index % tags.length]
        }));

        setCards(normalized);
        setSummary(backendSummary);
        setState('complete');
        return;
      }

      if (openAIReady) {
        const materials = await prepareMaterials(files);
        const { flashcards: aiCards, summary: aiSummary } = await generateFlashcardsWithOpenAI({
          focus: folderName,
          notes: notePayload,
          materials,
          cardCount: Math.max(4, Math.min(10, files.length * 2 || 6))
        });

        const normalized = aiCards.map((card, index) => ({
          id: index + 1,
          front: card.front,
          back: card.back,
          tag: card.tag ?? tags[index % tags.length]
        }));

        setCards(normalized);
        setFolderId('openai-session');
        setSummary(aiSummary);
        setState('complete');
        return;
      }

      const aggregateText = await Promise.all(files.map((file) => prepareMaterials([file])));
      const flattened = aggregateText.flat();
      const base = `${notePayload}\n${flattened.join('\n')}`.trim();
      const insightSeed = base.slice(0, 280) || 'Your study materials';

      const generated: Flashcard[] = Array.from({ length: 4 }, (_, idx) => ({
        id: idx + 1,
        front: `Essential concept ${idx + 1}`,
        back: `AI summary of "${insightSeed}" focusing on insight ${idx + 1}.`,
        tag: tags[idx % tags.length]
      }));

      setCards(generated);
      setFolderId('local-preview');
      setSummary(
        `Focus on ${generated
          .map((card) => card.tag.toLowerCase())
          .slice(0, 3)
          .join(', ')}. Schedule your next review in ${(generated.length + 1) * 3} hours.`
      );
      setTimeout(() => setState('complete'), 600);
    } catch (generationError) {
      console.error(generationError);
      setError(generationError instanceof Error ? generationError.message : 'Unable to generate flashcards right now.');
      setState('idle');
    }
  };

  const previewNames = useMemo(() => files.map((file) => file.name).join(', '), [files]);

  return (
    <section id="flashcards" style={{ padding: '5rem 0', display: 'grid', gap: '2rem' }}>
      <div style={{ display: 'grid', gap: '0.7rem' }}>
        <h2 className="section-title">AI Flashcard Creator</h2>
        <p className="section-subtitle">
          Drop any document or snapshot—textbook pages, whiteboard scribbles, exam reviews. AetherLearn extracts key knowledge,
          drafts flashcards, and assembles a structured study guide in seconds.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          padding: '2.2rem',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface)',
          border: '1px solid var(--outline)'
        }}
      >
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
          {folderId && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last folder: {folderId}</span>
          )}
        </div>

        <label
          style={{
            padding: '1.5rem',
            border: '1px dashed var(--outline)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            display: 'grid',
            gap: '0.45rem',
            background: 'rgba(59, 130, 246, 0.08)'
          }}
        >
          <span style={{ fontWeight: 700 }}>Upload images or documents</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Supports PNG, JPG, PDF, Markdown, and more. We even love messy handwriting.
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
            onChange={handleFileUpload}
            style={{ opacity: 0, height: 0, width: 0 }}
          />
          {previewNames && (
            <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Selected: {previewNames}</span>
          )}
        </label>

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

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ fontWeight: 600 }}>Add learning goals or tricky bits</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={4}
            style={{
              padding: '1rem 1.1rem',
              borderRadius: '18px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)',
              fontFamily: 'inherit'
            }}
          />
        </label>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={generateFlashcards}
            disabled={state === 'processing'}
            style={{
              padding: '0.95rem 2.3rem',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #14b8a6, #2563eb)',
              color: '#fff',
              fontWeight: 700
            }}
          >
            {state === 'processing' ? 'Generating...' : 'Create flashcards'}
          </button>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            The AI aligns difficulty with your quiz settings for seamless review flows.
          </span>
        </div>

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

        {state !== 'idle' && (
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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Flashcard deck</h3>
              <span
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '999px',
                  background: state === 'complete' ? 'rgba(34, 197, 94, 0.18)' : 'rgba(147, 197, 253, 0.2)',
                  color: state === 'complete' ? '#16a34a' : '#1d4ed8',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                {state === 'processing' ? 'Processing' : 'Ready to review'}
              </span>
            </header>

            {cards.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gap: '1rem',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
                }}
              >
                {cards.map((card) => (
                  <article
                    key={card.id}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-soft)',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      display: 'grid',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-strong)' }}>{card.tag}</span>
                    <strong>{card.front}</strong>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{card.back}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Analyzing uploads and generating cards…</p>
            )}

            {summary && <p style={{ margin: 0, fontWeight: 500 }}>{summary}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
