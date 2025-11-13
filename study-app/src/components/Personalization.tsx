import { useState } from 'react';

export function Personalization() {
  const [path, setPath] = useState('Exam sprint');
  const [flashcardPace, setFlashcardPace] = useState('Balanced');
  const [aiFeedback, setAiFeedback] = useState(true);

  return (
    <section style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="section-title">Personalize every journey</h2>
        <p className="section-subtitle">
          Choose study paths, calibrate flashcard intensity, and tune AI coaching. Every interaction teaches the model how to
          support you better next time.
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
          <span style={{ fontWeight: 600 }}>Study path</span>
          <select
            value={path}
            onChange={(event) => setPath(event.target.value)}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '18px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)'
            }}
          >
            <option>Exam sprint</option>
            <option>Deep mastery</option>
            <option>Portfolio builder</option>
            <option>Skill refresher</option>
          </select>
        </label>

        <label style={{ display: 'grid', gap: '0.45rem' }}>
          <span style={{ fontWeight: 600 }}>Flashcard pacing</span>
          <select
            value={flashcardPace}
            onChange={(event) => setFlashcardPace(event.target.value)}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '18px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)'
            }}
          >
            <option>Gentle</option>
            <option>Balanced</option>
            <option>Challenging</option>
            <option>Lightning mode</option>
          </select>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontWeight: 600 }}>
          <input type="checkbox" checked={aiFeedback} onChange={(event) => setAiFeedback(event.target.checked)} /> Enable AI
          feedback loops
        </label>
      </div>

      <div
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--outline)',
          background: 'var(--surface)',
          display: 'grid',
          gap: '1rem'
        }}
      >
        <h3 style={{ margin: 0 }}>Your personalized plan</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          <strong>{path}</strong> mode keeps your flashcards at a <strong>{flashcardPace.toLowerCase()}</strong> pace with
          AI feedback {aiFeedback ? 'enabled' : 'paused'}.
        </p>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          The tutor adapts every 3 sessions. Share reactions, mark confusion, or celebrate wins to continuously refine your AI
          coach.
        </p>
      </div>
    </section>
  );
}
