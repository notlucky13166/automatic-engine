export function Footer() {
  return (
    <footer
      style={{
        padding: '3rem 1.5rem 4rem',
        borderTop: '1px solid var(--outline)',
        background: 'var(--surface)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gap: '1.5rem',
          maxWidth: 1100,
          margin: '0 auto'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
          <img src="/logo.svg" alt="AetherLearn" width={36} height={36} />
          <span>AetherLearn</span>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: 520 }}>
          AetherLearn is built for students, educators, and lifelong learners who deserve AI tools without paywalls. Open source,
          privacy-first, accessible everywhere.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.9rem' }}>
          <a href="#mission">Mission</a>
          <a href="#quizzes">Create</a>
          <a href="#insights">Insights</a>
          <a href="#community">Community</a>
          <a href="mailto:hello@aetherlearn.io">Contact</a>
          <span>Made with care for the global classroom.</span>
        </div>
      </div>
    </footer>
  );
}
