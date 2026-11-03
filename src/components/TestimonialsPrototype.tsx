import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Globe, MessageSquareText, Quote, Settings, ShieldCheck } from 'lucide-react';
import '../testimonials.css';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsPrototypeProps {
  onOpenEnquiry?: (serviceCategory?: string) => void;
}

const FEATURED = {
  topic: 'Service & support',
  quote: 'One team to coordinate the work, with clear communication from installation through ongoing support.',
  tags: [
    { label: 'Connectivity', icon: Globe },
    { label: 'Security', icon: ShieldCheck },
    { label: 'Ongoing support', icon: Settings },
  ],
} as const;

const SIDE_QUOTES = [
  {
    topic: 'Installation experience',
    quote: 'An organised installation and a clear handover made the whole process easier.',
  },
  {
    topic: 'Connected solutions',
    quote: 'A single point of contact for our connectivity and technology requirements.',
  },
] as const;

export const TestimonialsPrototype: React.FC<TestimonialsPrototypeProps> = ({ onOpenEnquiry }) => {
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const mm = gsap.matchMedia(pin);

    // Vertical scroll drives the track sideways; cards tilt as they pass the centre
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const track = pin.querySelector<HTMLElement>('.tm-track');
      const progress = pin.querySelector<HTMLElement>('.tm-progress-bar');
      const cards = gsap.utils.toArray<HTMLElement>('.tm-card', pin);
      if (!track || !progress) return;

      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      const tiltCards = () => {
        const centre = window.innerWidth / 2;
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const offset = gsap.utils.clamp(-1, 1, (rect.left + rect.width / 2 - centre) / centre);
          gsap.set(card, {
            rotationY: offset * -16,
            scale: 1 - Math.abs(offset) * 0.06,
            opacity: 0.5 + (1 - Math.abs(offset)) * 0.5,
          });
        });
      };

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          // a little more scroll than travel, so the gallery doesn't rush past
          end: () => `+=${distance() * 1.5}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progress.style.transform = `scaleX(${self.progress})`;
            tiltCards();
          },
          onRefresh: tiltCards,
        },
      });

      tiltCards();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="testimonials" className="tm-section" aria-labelledby="testimonials-title">
      <div ref={pinRef} className="tm-pin">
        <div className="tm-head">
          <div>
            <p className="tm-eyebrow">Client experiences</p>
            <h2 id="testimonials-title">What one accountable team feels like.</h2>
          </div>
          <div className="tm-head-side">
            <p>Experiences across connectivity, security and managed technology.</p>
            <div className="tm-progress" aria-hidden="true">
              <span className="tm-progress-bar" />
            </div>
          </div>
        </div>

        <div className="tm-viewport">
          <div className="tm-track">
            <article className="tm-card tm-card--featured">
              <Quote className="tm-glyph" aria-hidden="true" />
              <span className="tm-pill">{FEATURED.topic}</span>
              <blockquote>&ldquo;{FEATURED.quote}&rdquo;</blockquote>
              <ul className="tm-tags">
                {FEATURED.tags.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <Icon aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </article>

            {SIDE_QUOTES.map((item) => (
              <article key={item.topic} className="tm-card">
                <Quote className="tm-glyph" aria-hidden="true" />
                <span className="tm-pill">{item.topic}</span>
                <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              </article>
            ))}

            <article className="tm-card tm-card--cta">
              <span className="tm-cta-icon" aria-hidden="true">
                <MessageSquareText />
              </span>
              <h3>References for your requirements</h3>
              <p>Discuss relevant project experience with our team.</p>
              <button type="button" onClick={() => onOpenEnquiry?.()}>
                Discuss your requirements
                <ArrowRight aria-hidden="true" />
              </button>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
