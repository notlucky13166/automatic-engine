import { badges } from '../data/mockData';

export function Gamification() {
  return (
    <section style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="section-title">Gamified motivation</h2>
        <p className="section-subtitle">
          Streaks, badges, and community leaderboards keep you energized. Earn recognition for healthy learning habits, not just
          cramming.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
        }}
      >
        <article
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(160deg, rgba(236, 72, 153, 0.15), rgba(37, 99, 235, 0.12))',
            border: '1px solid rgba(216, 180, 254, 0.45)',
            display: 'grid',
            gap: '1.2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <h3 style={{ margin: 0 }}>Your streak</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Consistency unlocks smarter recommendations.</p>
            </div>
            <strong style={{ fontSize: '2.5rem' }}>21🔥</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Keep up the momentum to climb the all-time leaderboard. Invite friends to form a learning crew and cheer each other
            on in real time.
          </p>
          <button
            style={{
              justifySelf: 'flex-start',
              padding: '0.75rem 1.8rem',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--surface-strong)',
              color: 'var(--accent)',
              fontWeight: 700
            }}
          >
            View leaderboard
          </button>
        </article>

        <article
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface)',
            border: '1px solid var(--outline)',
            display: 'grid',
            gap: '1.2rem'
          }}
        >
          <h3 style={{ margin: 0 }}>Badges in progress</h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.65rem', color: 'var(--text-secondary)' }}>
            {badges.map((badge) => (
              <li key={badge.name}>
                <strong style={{ color: 'var(--text)' }}>{badge.name}</strong> — {badge.description}
              </li>
            ))}
          </ul>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--accent)' }}>
            Tip: log feedback on flashcards to boost your Insight Architect progress.
          </p>
        </article>
      </div>
    </section>
  );
}
