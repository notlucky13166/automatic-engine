import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const links = [
  { label: 'Mission', href: '#mission' },
  { label: 'Create', href: '#create' },
  { label: 'Learn', href: '#learn' },
  { label: 'Insights', href: '#insights' },
  { label: 'Community', href: '#community' }
];

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(18px)',
        background: 'color-mix(in srgb, var(--surface) 94%, transparent)',
        borderBottom: '1px solid var(--outline)'
      }}
    >
      <nav
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem'
        }}
      >
        <a
          href="#top"
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.1rem'
          }}
        >
          <img src="/logo.svg" alt="AetherLearn" width={36} height={36} />
          <span>AetherLearn</span>
        </a>

        <div className="nav-links" style={{ display: 'none', gap: '1.5rem' }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{
              height: 40,
              width: 40,
              borderRadius: '50%',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--text)'
            }}
          >
            {theme === 'light' ? <MoonIcon width={20} /> : <SunIcon width={20} />}
          </button>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="menu-toggle"
            style={{
              height: 44,
              width: 44,
              borderRadius: '999px',
              border: '1px solid var(--outline)',
              background: 'var(--surface-strong)',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <Bars3Icon width={22} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          style={{
            padding: '0 1.5rem 1.5rem',
            display: 'grid',
            gap: '0.75rem',
            background: 'var(--surface-strong)',
            borderBottom: '1px solid var(--outline)'
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={() => setOpen(false)}
              style={{
                padding: '0.9rem 1rem',
                borderRadius: '18px',
                background: 'var(--accent-soft)'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>
        {`
          @media (min-width: 960px) {
            .nav-links {
              display: flex !important;
            }
            .menu-toggle {
              display: none !important;
            }
          }
          .nav-link {
            font-size: 0.95rem;
            color: var(--text-secondary);
            font-weight: 500;
            transition: color 0.2s ease;
          }
          .nav-link:hover {
            color: var(--accent);
          }
        `}
      </style>
    </header>
  );
}
