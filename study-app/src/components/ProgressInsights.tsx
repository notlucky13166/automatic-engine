import { useMemo } from 'react';

const categories = [
  { label: 'Retention', score: 84 },
  { label: 'Confidence', score: 72 },
  { label: 'Speed', score: 63 },
  { label: 'Mastery', score: 91 }
];

const masteryTimeline = [65, 72, 78, 84, 88, 93];

export function ProgressInsights() {
  const gradientStops = useMemo(
    () =>
      masteryTimeline
        .map((value, index) => `${Math.min(100, value + 5)}% ${Math.round((index / (masteryTimeline.length - 1)) * 100)}%`)
        .join(', '),
    []
  );

  return (
    <section id="insights" style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="section-title">Progress tracking & insights</h2>
        <p className="section-subtitle">
          Visualize your growth with intuitive dashboards. Our insight engine highlights weak spots, celebrates wins, and feeds
          the adaptive scheduler with actionable next steps.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
        }}
      >
        <article
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface)',
            border: '1px solid var(--outline)',
            display: 'grid',
            gap: '1.25rem'
          }}
        >
          <header>
            <h3 style={{ margin: 0 }}>Mastery dashboard</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Track how each learning sprint improves your retention and focus streak.
            </p>
          </header>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {categories.map((category) => (
              <div key={category.label} style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>{category.label}</span>
                  <span>{category.score}%</span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: 'rgba(148, 163, 184, 0.16)',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${category.score}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #22d3ee, #6366f1)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(160deg, rgba(14, 165, 233, 0.15), rgba(59, 130, 246, 0.08))',
            border: '1px solid rgba(96, 165, 250, 0.35)',
            display: 'grid',
            gap: '1.25rem'
          }}
        >
          <header>
            <h3 style={{ margin: 0 }}>Momentum highlights</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Weekly snapshot of your AI-personalized study rhythm.
            </p>
          </header>
          <div style={{ position: 'relative', height: 160, borderRadius: '18px', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, ${gradientStops})`,
                opacity: 0.25
              }}
            />
            <svg viewBox="0 0 240 120" preserveAspectRatio="none" role="img" aria-label="Mastery over time">
              <polyline
                points={masteryTimeline.map((value, index) => `${(index / (masteryTimeline.length - 1)) * 240},${120 - value}`).join(' ')}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={3}
              />
              {masteryTimeline.map((value, index) => (
                <circle
                  key={value + index}
                  cx={(index / (masteryTimeline.length - 1)) * 240}
                  cy={120 - value}
                  r={4.5}
                  fill="var(--surface-strong)"
                  stroke="var(--accent)"
                  strokeWidth={2}
                />
              ))}
            </svg>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'grid', gap: '0.45rem' }}>
            <li>AI recommends focusing on Concept Capsules 3 & 4 this week.</li>
            <li>Schedule: two 20-minute review bursts, one collaborative quiz night.</li>
            <li>Streak tip: you are 2 sessions away from the Insight Architect badge.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
