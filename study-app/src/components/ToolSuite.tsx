import { aiTools } from '../data/mockData';

export function ToolSuite() {
  return (
    <section style={{ padding: '0 0 5rem', display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        <h2 className="section-title">Bonus AI superpowers</h2>
        <p className="section-subtitle">
          AetherLearn ships with optional copilots so you can draft essays, scout research, solve equations, and debug code
          without leaving your workspace.
        </p>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
      >
        {aiTools.map((tool) => (
          <article
            key={tool.name}
            style={{
              padding: '1.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface)',
              border: '1px solid var(--outline)',
              display: 'grid',
              gap: '0.7rem'
            }}
          >
            <h3 style={{ margin: 0 }}>{tool.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tool.description}</p>
            <button
              style={{
                justifySelf: 'flex-start',
                padding: '0.6rem 1.4rem',
                borderRadius: '999px',
                border: '1px solid rgba(148, 163, 184, 0.35)',
                background: 'transparent',
                color: 'var(--accent)',
                fontWeight: 600
              }}
            >
              Launch tool
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
