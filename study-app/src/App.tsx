import { Collaboration } from './components/Collaboration';
import { FeatureHighlights } from './components/FeatureHighlights';
import { FlashcardAI } from './components/FlashcardAI';
import { Footer } from './components/Footer';
import { Gamification } from './components/Gamification';
import { Hero } from './components/Hero';
import { LessonSummaries } from './components/LessonSummaries';
import { Navigation } from './components/Navigation';
import { Personalization } from './components/Personalization';
import { ProgressInsights } from './components/ProgressInsights';
import { QuizBuilder } from './components/QuizBuilder';
import { ToolSuite } from './components/ToolSuite';

function DecorativeGlow() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(600px at 20% 20%, rgba(96, 165, 250, 0.16), transparent 55%), radial-gradient(600px at 80% 10%, rgba(129, 140, 248, 0.14), transparent 55%)',
        opacity: 0.9,
        zIndex: 0
      }}
    />
  );
}

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <DecorativeGlow />
      <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 0 }}>
        <Navigation />
        <main style={{ display: 'grid', gap: '2rem' }}>
          <Hero />
          <FeatureHighlights />
          <QuizBuilder />
          <FlashcardAI />
          <LessonSummaries />
          <ProgressInsights />
          <Gamification />
          <Personalization />
          <Collaboration />
          <ToolSuite />
        </main>
        <Footer />
      </div>
    </div>
  );
}
