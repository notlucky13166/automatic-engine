import { featureCards } from '../data/mockData';

export function FeatureHighlights() {
  return (
    <section id="create" style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.65rem' }}>
        <h2 className="section-title">Everything you need to create magic</h2>
        <p className="section-subtitle">
          Tailor every session with quiz generation, flashcard drafting, and smart scheduling. Upload anything—PDFs, slides,
          handwritten notes—and the AI will extract just what you need.
        </p>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}
      >
        {featureCards.map((card) => (
          <article
            key={card.id}
            style={{
              padding: '2.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--outline)',
              display: 'grid',
              gap: '0.85rem',
              position: 'relative'
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: -18,
                right: 24,
                fontSize: '2.5rem'
              }}
            >
              {card.icon}
            </span>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{card.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{card.description}</p>
            <a
              href={`#${card.id}`}
              style={{
                marginTop: 'auto',
                fontWeight: 600,
                color: 'var(--accent)'
              }}
            >
              Explore workflows →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
