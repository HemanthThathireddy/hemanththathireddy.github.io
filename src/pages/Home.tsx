// portfolio/src/pages/Home.tsx
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Experience } from '../components/sections/Experience';
import { Projects } from '../components/sections/Projects';
import { Skills } from '../components/sections/Skills';
import { Contact } from '../components/sections/Contact';

/**
 * Home page — composes every section in scroll order.
 * Sticky chrome (Navbar, ScrollProgress, CustomCursor) lives in App.tsx
 * so it stays mounted across route transitions.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
