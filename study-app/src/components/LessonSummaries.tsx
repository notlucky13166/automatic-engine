import { lessonSnippets } from '../data/mockData';

export function LessonSummaries() {
  return (
    <section id="learn" style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="section-title">Bite-sized lessons & summaries</h2>
        <p className="section-subtitle">
          Never sift through pages again. AetherLearn distills your uploads into compact lessons, highlight reels, and revision
          prompts that sync with your available time.
        </p>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
      >
        {lessonSnippets.map((snippet) => (
          <article
            key={snippet.title}
            style={{
              padding: '1.9rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--outline)',
              display: 'grid',
              gap: '0.7rem'
            }}
          >
            <h3 style={{ margin: 0 }}>{snippet.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{snippet.summary}</p>
            <button
              style={{
                justifySelf: 'flex-start',
                padding: '0.65rem 1.4rem',
                borderRadius: '999px',
                border: '1px solid rgba(148, 163, 184, 0.4)',
                background: 'transparent',
                color: 'var(--accent)',
                fontWeight: 600
              }}
            >
              Expand mini-lesson
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
