import { collaborativeSpaces } from '../data/mockData';

export function Collaboration() {
  return (
    <section id="community" style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="section-title">Collaborate in real time</h2>
        <p className="section-subtitle">
          Host shared decks, co-author quizzes, and annotate study materials live. Built-in chat and reactions keep the energy
          high.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
        }}
      >
        {collaborativeSpaces.map((space) => (
          <article
            key={space.name}
            style={{
              padding: '1.9rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface)',
              border: '1px solid var(--outline)',
              display: 'grid',
              gap: '0.6rem'
            }}
          >
            <h3 style={{ margin: 0 }}>{space.name}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{space.activity}</p>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>{space.members} learners</span>
            <button
              style={{
                justifySelf: 'flex-start',
                padding: '0.65rem 1.6rem',
                borderRadius: '999px',
                border: '1px solid rgba(148, 163, 184, 0.35)',
                background: 'transparent',
                color: 'var(--accent)',
                fontWeight: 600
              }}
            >
              Join room
            </button>
          </article>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1rem',
          padding: '1.8rem',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(150deg, rgba(59, 130, 246, 0.12), rgba(96, 165, 250, 0.08))',
          border: '1px solid rgba(59, 130, 246, 0.25)'
        }}
      >
        <h3 style={{ margin: 0 }}>Live chat</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ padding: '0.9rem', borderRadius: '16px', background: 'var(--surface-strong)' }}>
            <strong>Maya</strong>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Uploading the cardiology diagrams now—can the AI highlight blood flow steps?
            </p>
          </div>
          <div style={{ padding: '0.9rem', borderRadius: '16px', background: 'var(--surface-strong)' }}>
            <strong>Devon (AI Tutor)</strong>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Absolutely! I will annotate the diagram and add a quick quiz to reinforce each step.
            </p>
          </div>
        </div>
        <textarea
          placeholder="Share an insight or ask the AI for help..."
          rows={3}
          style={{
            padding: '0.85rem 1rem',
            borderRadius: '18px',
            border: '1px solid var(--outline)',
            background: 'var(--surface-strong)',
            fontFamily: 'inherit'
          }}
        />
        <button
          style={{
            justifySelf: 'flex-end',
            padding: '0.7rem 1.6rem',
            borderRadius: '999px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: '#fff',
            fontWeight: 700
          }}
        >
          Send
        </button>
      </div>
    </section>
  );
}
