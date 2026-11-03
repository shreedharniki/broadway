import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ClipboardList, DraftingCompass, Headset, Wrench, type LucideIcon } from 'lucide-react';
import { PROCESS_STEPS } from '../data/content';
import '../process.css';

gsap.registerPlugin(ScrollTrigger);

interface DeliveryProcessProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
}

const STEP_ICONS: LucideIcon[] = [ClipboardList, DraftingCompass, Wrench, Headset];

const FINALE_WORDS = ['Let’s', 'connect', 'your', 'next', 'possibility.'];

export const DeliveryProcess: React.FC<DeliveryProcessProps> = ({ onOpenEnquiry }) => {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      // both keys so the callback runs either way (it only fires when a condition matches)
      { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
      (context) => {
        const q = gsap.utils.selector(root);
        const stepsEl = q('.dp-steps')[0] as HTMLElement;
        const steps = q('.dp-step') as HTMLElement[];
        const last = steps.length - 1;

        const lightSteps = (progress: number) => {
          steps.forEach((step, i) => step.classList.toggle('is-lit', progress >= (i / last) * 0.96));
        };

        if (!context.conditions?.motion) {
          stepsEl.style.setProperty('--dp-progress', '1');
          lightSteps(1);
          return;
        }

        // The fibre line draws through the steps, lighting each one as it arrives
        gsap.fromTo(
          stepsEl,
          { '--dp-progress': 0 },
          {
            '--dp-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: stepsEl,
              start: 'top 72%',
              end: 'bottom 52%',
              scrub: 0.5,
              onUpdate: (self) => lightSteps(self.progress),
            },
          },
        );

        // Finale: the city settles into frame while the headline resolves word by word
        const finale = q('.dp-finale')[0];
        gsap.fromTo(
          q('.dp-finale-zoom'),
          { scale: 1.22 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: finale, start: 'top bottom', end: 'top top', scrub: true },
          },
        );
        gsap
          .timeline({
            scrollTrigger: { trigger: finale, start: 'top 70%', end: 'top 15%', scrub: 0.5 },
          })
          .fromTo(
            q('.dp-word'),
            { opacity: 0.12, y: 28 },
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out' },
          )
          .fromTo(
            q('.dp-finale-sub, .dp-finale-actions'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
            '-=0.2',
          );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="process" className="dp" aria-labelledby="process-title">
      <div className="dp-steps-wrap">
        <div className="dp-head">
          <p className="dp-eyebrow">How we deliver</p>
          <h2 id="process-title">
            From first survey to <span>ongoing support.</span>
          </h2>
          <p className="dp-intro">One accountable team at every stage, from your first call to everyday operations.</p>
        </div>

        <div className="dp-steps">
          <div className="dp-line" aria-hidden="true">
            <span className="dp-line-fill" />
          </div>

          <ol className="dp-step-list">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <li key={step.step} className="dp-step">
                  <span className="dp-node" aria-hidden="true">
                    <Icon />
                  </span>
                  <div className="dp-step-body">
                    <p className="dp-step-meta">
                      <span>{step.step}</span>
                      {step.durationHint}
                    </p>
                    <h3>{step.title}</h3>
                    <p className="dp-step-focus">{step.focus}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="dp-finale" aria-labelledby="process-cta-title">
        <div className="dp-finale-media" aria-hidden="true">
          <div className="dp-finale-stage">
            <div className="dp-finale-zoom">
              <picture>
                <source
                  media="(max-width: 767px), (max-aspect-ratio: 1/1)"
                  srcSet="/images/hero-city-mobile-900.webp 900w, /images/hero-city-mobile-1440.webp 1440w"
                  sizes="100vw"
                />
                <img
                  src="/images/hero-city-1920.webp"
                  srcSet="/images/hero-city-1920.webp 1920w, /images/hero-city-3200.webp 3200w"
                  sizes="(max-width: 767px) 100vw, max(100vw, 179vh)"
                  alt=""
                  width={5504}
                  height={3072}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <span className="dp-pulse">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        </div>
        <div className="dp-finale-shade" aria-hidden="true" />

        <div className="dp-finale-content">
          <h2 id="process-cta-title" className="dp-finale-title">
            {FINALE_WORDS.map((word) => (
              <span key={word} className="dp-word">
                {word}
              </span>
            ))}
          </h2>
          <p className="dp-finale-sub">Tell us what you need. We’ll help you plan the right solution.</p>
          <div className="dp-finale-actions">
            <button type="button" className="process-cta-primary" onClick={() => onOpenEnquiry()}>
              Discuss your requirements
              <ArrowRight aria-hidden="true" />
            </button>
            <button type="button" className="process-cta-link" onClick={() => onOpenEnquiry()}>
              Contact our team
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
