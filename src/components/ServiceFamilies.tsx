import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Cloud,
  Globe,
  Network,
  PhoneCall,
  ShieldCheck,
  Tv,
} from 'lucide-react';
import { SERVICE_FAMILIES } from '../data/content';
import { FeaturedCategoryKey } from '../types';
import '../service-ring.css';

gsap.registerPlugin(ScrollTrigger);

interface ServiceFamiliesProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
  onSelectCategory: (key: FeaturedCategoryKey) => void;
}

// Same order as SERVICE_FAMILIES so an index maps to its family data.
const FAMILY_PRESENTATION = [
  {
    icon: Globe,
    title: 'Internet connectivity',
    description: 'Reliable connections for homes and organisations.',
    services: ['Broadband', 'Business internet', 'Leased lines'],
    image: '/images/svc-internet.webp',
  },
  {
    icon: Network,
    title: 'Networks & Wi-Fi',
    description: 'Connected spaces, from a room to a campus.',
    services: ['Managed Wi-Fi', 'Cabling', 'Campus networks'],
    image: '/images/svc-networks.webp',
  },
  {
    icon: ShieldCheck,
    title: 'Security & automation',
    description: 'Protect your people, property and access.',
    services: ['CCTV', 'Access control', 'Automation'],
    image: '/images/svc-security.webp',
  },
  {
    icon: PhoneCall,
    title: 'Voice & intercom',
    description: 'Communication across your premises.',
    services: ['Telephone systems', 'Intercom', 'IP voice'],
    image: '/images/svc-voice.webp',
  },
  {
    icon: Cloud,
    title: 'IT & cloud',
    description: 'Technology for everyday operations.',
    services: ['Servers & cloud', 'IT support', 'Software'],
    image: '/images/svc-it.webp',
  },
  {
    icon: Tv,
    title: 'Entertainment & digital',
    description: 'Connected viewing for homes and communities.',
    services: ['IPTV', 'OTT', 'Community entertainment'],
    image: '/images/svc-entertainment.webp',
  },
] as const;

const STEP = 360 / FAMILY_PRESENTATION.length;

export const ServiceFamilies: React.FC<ServiceFamiliesProps> = ({
  onOpenEnquiry,
  onSelectCategory,
}) => {
  const pinRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  const openFamily = (index: number) => {
    const family = SERVICE_FAMILIES[index];
    const featuredService = family.services.find((service) => service.featuredKey);

    if (featuredService?.featuredKey) {
      onSelectCategory(featuredService.featuredKey);
      return;
    }

    onOpenEnquiry(family.name);
  };

  // With the ring active, a tab scrolls to that family's snap point instead of opening it
  const goTo = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) {
      openFamily(index);
      return;
    }
    const last = FAMILY_PRESENTATION.length - 1;
    window.scrollTo({
      top: trigger.start + (index / last) * (trigger.end - trigger.start),
      behavior: 'smooth',
    });
  };

  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const mm = gsap.matchMedia(pin);

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const ring = pin.querySelector<HTMLElement>('.sr-ring');
      const cards = gsap.utils.toArray<HTMLElement>('.sr-card', pin);
      if (!ring) return;

      const last = cards.length - 1;
      const state = { rotation: 0 };

      // Each card's facing (1 = front, 0 = back) drives its depth styling in CSS
      const render = () => {
        ring.style.setProperty('--sr-rotation', `${state.rotation}deg`);
        cards.forEach((card, i) => {
          const angle = ((((i * STEP + state.rotation) % 360) + 540) % 360) - 180;
          const facing = (Math.cos((angle * Math.PI) / 180) + 1) / 2;
          card.style.setProperty('--sr-facing', facing.toFixed(3));
        });
      };

      const tween = gsap.to(state, {
        rotation: -last * STEP,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: `+=${last * 75}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / last,
            duration: { min: 0.2, max: 0.6 },
            delay: 0.08,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => setActive(Math.round(self.progress * last)),
        },
      });

      triggerRef.current = tween.scrollTrigger ?? null;
      render();

      return () => {
        triggerRef.current = null;
        ring.style.removeProperty('--sr-rotation');
        cards.forEach((card) => card.style.removeProperty('--sr-facing'));
      };
    });

    return () => mm.revert();
  }, []);

  const current = FAMILY_PRESENTATION[active];

  return (
    <section id="services" className="service-ring" aria-labelledby="service-ring-title">
      <div ref={pinRef} className="sr-pin">
        <div className="sr-backdrop" aria-hidden="true" />

        <div className="sr-head">
          <div>
            <p className="sr-eyebrow">Connected expertise. One accountable team.</p>
            <h2 id="service-ring-title" className="sr-title">
              One partner. <span>Every technology solution.</span>
            </h2>
          </div>

          <div className="sr-tabs" role="tablist" aria-label="Service families">
            {FAMILY_PRESENTATION.map((family, index) => {
              const Icon = family.icon;
              return (
                <button
                  key={family.title}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  className="sr-tab"
                  onClick={() => goTo(index)}
                >
                  <Icon aria-hidden="true" />
                  <span>{family.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sr-stage">
          <div className="sr-floor" aria-hidden="true" />
          <ul className="sr-ring">
            {FAMILY_PRESENTATION.map((family, index) => {
              const Icon = family.icon;
              return (
                <li
                  key={family.title}
                  className="sr-card"
                  style={{ '--i': index } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className="sr-card-button"
                    onClick={() => openFamily(index)}
                    aria-label={`Explore ${family.title}`}
                  >
                    <img src={family.image} alt="" width={960} height={720} decoding="async" />
                    <span className="sr-card-shade" aria-hidden="true" />
                    <span className="sr-card-body">
                      <span className="sr-card-icon" aria-hidden="true">
                        <Icon />
                      </span>
                      <span className="sr-card-title">{family.title}</span>
                      <span className="sr-card-description">{family.description}</span>
                      <span className="sr-card-services">{family.services.join(' · ')}</span>
                    </span>
                    <span className="sr-card-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sr-detail" aria-live="polite">
          <div key={active} className="sr-detail-inner">
            <p className="sr-detail-count">
              {String(active + 1).padStart(2, '0')} <span>/ {String(FAMILY_PRESENTATION.length).padStart(2, '0')}</span>
            </p>
            <div className="sr-detail-copy">
              <p className="sr-detail-description">{current.description}</p>
              <ul className="sr-detail-services">
                {current.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
            <button type="button" className="sr-detail-action" onClick={() => openFamily(active)}>
              Explore {current.title.toLowerCase()}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="sr-footer">
        <div className="service-family-accountability">
          <Network aria-hidden="true" />
          <p>
            <strong>One team</strong> for planning, installation and ongoing support.
          </p>
          <button type="button" onClick={() => onOpenEnquiry()}>
            Discuss your requirements
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
