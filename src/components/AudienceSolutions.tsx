import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, Building2, Briefcase, GraduationCap, Check, ArrowRight } from 'lucide-react';
import { AUDIENCE_SOLUTIONS } from '../data/content';
import { AudienceKey } from '../types';
import '../audience.css';

gsap.registerPlugin(ScrollTrigger);

interface AudienceSolutionsProps {
  onOpenEnquiry: (serviceCategory?: string, audienceType?: string) => void;
}

const AUDIENCE_ICONS: Record<AudienceKey, React.ElementType> = {
  homes: Home,
  communities: Building2,
  businesses: Briefcase,
  institutions: GraduationCap,
};

const AUDIENCE_IMAGES: Record<AudienceKey, { src: string; alt: string }> = {
  homes: {
    src: '/images/aud-homes.webp',
    alt: 'A fibre-connected Wi-Fi router linking the TV, laptop and camera in a modern home',
  },
  communities: {
    src: '/images/aud-communities.webp',
    alt: 'A gated apartment community with fibre, CCTV and gate access connected on one network',
  },
  businesses: {
    src: '/images/aud-businesses.webp',
    alt: 'Broadway engineers working on network racks beside a connected office floor',
  },
  institutions: {
    src: '/images/aud-institutions.webp',
    alt: 'A connected campus with its sports ground, linked to the city by glowing fibre routes',
  },
};

export const AudienceSolutions: React.FC<AudienceSolutionsProps> = ({ onOpenEnquiry }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const [activeAudienceKey, setActiveAudienceKey] = useState<AudienceKey>(AUDIENCE_SOLUTIONS[0].id);

  const jumpTo = (key: AudienceKey) => {
    document.getElementById(`audience-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const mm = gsap.matchMedia(stack);

    // Track which panel is in front, for the jump pills
    mm.add('(min-width: 0px)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('.aud-panel', stack);
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setActiveAudienceKey(AUDIENCE_SOLUTIONS[i].id);
          },
        });
      });
    });

    // Stacking cards: as the next panel slides over, the one beneath recedes and dims
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('.aud-panel', stack);
      panels.slice(0, -1).forEach((panel, i) => {
        const next = panels[i + 1];
        gsap
          .timeline({
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top top+=120',
              scrub: true,
            },
          })
          .to(panel.querySelector('.aud-panel-card'), { scale: 0.92, ease: 'none' }, 0)
          .to(panel.querySelector('.aud-panel-dim'), { opacity: 0.55, ease: 'none' }, 0);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="who-we-serve" className="audience-section" aria-labelledby="audience-title">
      <div className="audience-glow" aria-hidden="true" />

      <div className="audience-inner">
        <div className="audience-head">
          <div className="audience-heading">
            <p>Who we serve</p>
            <h2 id="audience-title">Technology that fits your world.</h2>
            <span>Solutions shaped around your home, community or organisation.</span>
          </div>

          <nav className="audience-pills" aria-label="Jump to an audience">
            {AUDIENCE_SOLUTIONS.map((aud) => {
              const Icon = AUDIENCE_ICONS[aud.id];
              return (
                <a
                  key={aud.id}
                  href={`#audience-${aud.id}`}
                  className="audience-pill"
                  aria-current={aud.id === activeAudienceKey ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    jumpTo(aud.id);
                  }}
                >
                  <Icon aria-hidden="true" />
                  {aud.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div ref={stackRef} className="aud-stack">
          {AUDIENCE_SOLUTIONS.map((aud, index) => {
            const Icon = AUDIENCE_ICONS[aud.id];
            const image = AUDIENCE_IMAGES[aud.id];

            return (
              <article
                key={aud.id}
                id={`audience-${aud.id}`}
                className="aud-panel"
                style={{ '--i': index } as React.CSSProperties}
                aria-labelledby={`audience-${aud.id}-title`}
              >
                <div className="aud-panel-card">
                  <div className="aud-panel-copy">
                    <p className="aud-panel-label">
                      <span className="aud-panel-index">{String(index + 1).padStart(2, '0')}</span>
                      <Icon aria-hidden="true" />
                      {aud.label}
                    </p>
                    <h3 id={`audience-${aud.id}-title`}>{aud.headline}</h3>
                    <p className="aud-panel-description">{aud.description}</p>

                    <ul className="aud-checklist" aria-label="Recommended service combination">
                      {aud.recommendedStack.map((item) => (
                        <li key={item}>
                          <span aria-hidden="true">
                            <Check />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="aud-panel-footer">
                      <p className="aud-outcome">
                        <strong>Key outcome</strong>
                        {aud.primaryBenefit}
                      </p>
                      <button
                        type="button"
                        className="aud-cta"
                        onClick={() => onOpenEnquiry(undefined, aud.label)}
                      >
                        Discuss {aud.label.toLowerCase()}
                        <ArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="aud-panel-media">
                    <img src={image.src} alt={image.alt} width={1200} height={900} loading="lazy" decoding="async" />
                  </div>

                  <div className="aud-panel-dim" aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
