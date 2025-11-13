import { missionHighlights } from '../data/mockData';

export function Hero() {
  return (
    <section id="top" style={{ padding: '8rem 0 6rem', display: 'grid', gap: '4rem' }}>
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          textAlign: 'center',
          maxWidth: 860,
          margin: '0 auto'
        }}
      >
        <span
          style={{
            padding: '0.35rem 1rem',
            borderRadius: '999px',
            background: 'var(--accent-soft)',
            color: 'var(--accent)',
            fontWeight: 600,
            width: 'fit-content',
            margin: '0 auto'
          }}
        >
          100% Free • Web & Mobile Ready • AI Native
        </span>
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            margin: 0
          }}
        >
          Study smarter with <span style={{ color: 'var(--accent)' }}>AetherLearn</span>
        </h1>
        <p className="section-subtitle" style={{ justifySelf: 'center' }}>
          Our mission is to deliver a truly open, AI-powered study companion that keeps every learner motivated, organized, and
          in control. No subscriptions, no surprises—just beautifully crafted tools that adapt to how you learn best.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <a
            href="#create"
            style={{
              padding: '0.9rem 1.8rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.25)'
            }}
          >
            Start creating
          </a>
          <a
            href="#mission"
            style={{
              padding: '0.9rem 1.8rem',
              borderRadius: '999px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)',
              fontWeight: 600
            }}
          >
            See why we built this
          </a>
        </div>
      </div>

      <div
        id="mission"
        style={{
          display: 'grid',
          gap: '1.2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
        }}
      >
        {missionHighlights.map((item) => (
          <article
            key={item.title}
            style={{
              padding: '1.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--outline)',
              boxShadow: 'var(--shadow)'
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '0.65rem', fontSize: '1.15rem' }}>{item.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
