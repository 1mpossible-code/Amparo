'use client';

import { useEffect, useState } from 'react';

import { OnboardingFlow } from '@/app/_components/onboarding-flow';

const INTRO_DURATION_MS = 3000;
const INTRO_FADE_MS = 500;
const INTRO_SEEN_KEY = 'amparo:intro-seen';

export default function OnboardingPage() {
  const [showIntro, setShowIntro] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let hasSeenIntro = false;

    try {
      hasSeenIntro = window.localStorage.getItem(INTRO_SEEN_KEY) === 'true';
      if (!hasSeenIntro) window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch (error) {
      console.warn('Unable to persist intro screen state.', error);
    }

    if (hasSeenIntro) {
      const readyTimer = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(readyTimer);
    }

    const startTimer = window.setTimeout(() => setShowIntro(true), 0);
    const fadeTimer = window.setTimeout(() => setIntroFading(true), INTRO_DURATION_MS - INTRO_FADE_MS);
    const doneTimer = window.setTimeout(() => {
      setShowIntro(false);
      setReady(true);
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--lemon-chiffon)]">
      <div className={`transition-opacity duration-500 ${ready || !showIntro ? 'opacity-100' : 'opacity-0'}`}>
        <OnboardingFlow />
      </div>

      {showIntro ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--lemon-chiffon)] px-6 transition-opacity duration-500 ${
            introFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center text-[var(--regal-navy)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--sandy-brown)]">Welcome</p>
            <h1 className="mt-4 text-6xl font-black tracking-[-0.06em] md:text-8xl">Amparo</h1>
          </div>
        </div>
      ) : null}
    </main>
  );
}
