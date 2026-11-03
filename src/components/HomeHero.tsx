import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Building2,
  Cctv,
  ChevronsDown,
  CloudCog,
  HousePlug,
  MonitorPlay,
  ShieldCheck,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { FeaturedCategoryKey } from '../types';
import '../hero-dive.css';

gsap.registerPlugin(ScrollTrigger);

interface NetworkNode {
  label: string;
  icon: LucideIcon;
  /** Anchor point on the hero image, in % of the image box. */
  x: number;
  y: number;
  /** Stem length between the anchor and the icon, in % of the image height. */
  stem: number;
  category?: FeaturedCategoryKey;
}

// Anchors sit on lit rooftop nodes of /images/hero-city-*.webp (desktop composition).
const NETWORK_NODES: NetworkNode[] = [
  { label: 'Home broadband', icon: Wifi, x: 15.9, y: 53.8, stem: 11, category: 'ftth' },
  { label: 'CCTV surveillance', icon: Cctv, x: 24, y: 61.5, stem: 11, category: 'security' },
  { label: 'Entertainment & OTT', icon: MonitorPlay, x: 34.6, y: 55.2, stem: 11 },
  { label: 'IT & cloud', icon: CloudCog, x: 57.3, y: 65, stem: 13 },
  { label: 'Network security', icon: ShieldCheck, x: 72.1, y: 56.4, stem: 11, category: 'security' },
  { label: 'Enterprise leased lines', icon: Building2, x: 80.2, y: 43, stem: 21, category: 'business' },
  { label: 'Home automation', icon: HousePlug, x: 16.1, y: 79.3, stem: 9, category: 'security' },
];

const SERVICE_CARD_IMAGES: Record<FeaturedCategoryKey, string> = {
  ftth: '/images/service-ftth-photoreal.png',
  voice: '/images/service-voice-photoreal.png',
  business: '/images/service-business-photoreal.png',
  security: '/images/service-security-photoreal.png',
};

interface HomeHeroProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
  onSelectCategory: (key: FeaturedCategoryKey) => void;
}

const HeroImage: React.FC<{ priority?: boolean }> = ({ priority }) => (
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
      alt={priority ? 'A connected Bengaluru skyline at dawn, every home, office and campus linked by glowing fibre routes' : ''}
      width={5504}
      height={3072}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  </picture>
);

export const HomeHero: React.FC<HomeHeroProps> = ({ onOpenEnquiry, onSelectCategory }) => {
  const rootRef = useRef<HTMLElement>(null);

  const scrollToServices = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNodeClick = (node: NetworkNode) => {
    if (node.category) {
      onSelectCategory(node.category);
    } else {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 768px) and (min-aspect-ratio: 1/1)',
        finePointer: '(pointer: fine)',
      },
      (context) => {
        const { motion, desktop, finePointer } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        const q = gsap.utils.selector(root);
        const nodes = q('.hd-node');

        gsap.set(nodes, { autoAlpha: 0 });
        gsap.set(q('.hd-node-stem'), { scaleY: 0 });
        gsap.set(q('.hd-node-pop'), { scale: 0.6, y: 12 });
        gsap.set(q('.hd-caption > *'), { autoAlpha: 0, y: 24 });

        const pinLength = desktop ? 2.6 : 1.8; // in viewport heights
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: `+=${pinLength * 100}%`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. The sky drifts slower than the city (parallax); the headline is handled below
        tl.to(q('.hd-cue'), { autoAlpha: 0, duration: 0.6 }, 0)
          .to(q('.hd-sky .hd-zoom'), { yPercent: 4, duration: 4.5 }, 0)
          .to(q('.hd-city .hd-zoom'), { scale: 1.03, duration: 4.5, ease: 'power1.inOut' }, 0);

        // 2. The caption takes over once the headline has scrolled away...
        const copyTravel = desktop ? 2 : 3;
        const captionAt = desktop ? 1.6 : copyTravel + 0.2;
        tl.to(q('.hd-caption > *'), { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.9 }, captionAt);

        // 3. ...then the services rise out of the network, one rooftop at a time
        if (desktop) {
          nodes.forEach((node, i) => {
            const at = captionAt + 1 + i * 0.22;
            tl.to(node, { autoAlpha: 1, duration: 0.3 }, at)
              .to(node.querySelector('.hd-node-stem'), { scaleY: 1, duration: 0.6, ease: 'power2.out' }, at)
              .to(
                node.querySelector('.hd-node-pop'),
                { scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' },
                at + 0.25,
              );
          });
        }

        // 4. After a short hold on the full network, dive into the hub: the city rushes in,
        //    services scatter and the core floods the screen with light
        const dive = 6;
        tl.to(q('.hd-caption > *'), { autoAlpha: 0, y: -30, stagger: 0.08, duration: 0.8 }, dive);
        if (desktop) {
          tl.to(
            nodes,
            { autoAlpha: 0, y: -40, duration: 0.9, stagger: { each: 0.05, from: 'center' } },
            dive,
          );
        }
        tl.to(q('.hd-city .hd-zoom'), { scale: 4.4, duration: 4.8, ease: 'power2.in' }, dive)
          .to(q('.hd-sky .hd-zoom'), { scale: 1.6, yPercent: -6, duration: 4.8, ease: 'power2.in' }, dive)
          .to(q('.hd-sky-wash'), { opacity: 0, duration: 1.6 }, dive)
          .to(q('.hd-hub-inner'), { scale: 3.2, duration: 4.8, ease: 'power2.in' }, dive)
          .to(q('.hd-hub-flare'), { opacity: 1, duration: 2.6, ease: 'power1.in' }, dive + 1.6)
          .to(q('.hd-fade'), { opacity: 1, duration: 1.4, ease: 'power1.in' }, dive + 3.4);

        // The headline and buttons scroll away like normal page content (no fade), so they stay
        // clickable until they slide under the header. On desktop they move 1:1 with the scroll;
        // phones need them gone sooner, as the copy card sits at the bottom of the screen.
        const total = tl.duration();
        tl.to(
          q('.home-hero-copy .hd-copy-item, .hd-lower'),
          {
            y: () => -(desktop ? (pinLength * window.innerHeight * copyTravel) / total : window.innerHeight),
            duration: copyTravel,
          },
          0,
        ).set(q('.home-hero-copy .hd-copy-item, .hd-lower'), { autoAlpha: 0 }, copyTravel);

        // 5. Once the full network is on screen, one scroll plays the whole dive and lands on the
        //    "One partner" scene; scrolling back up from there returns to the network.
        const cleanups: Array<() => void> = [];
        const networkShown = desktop
          ? captionAt + 1 + (nodes.length - 1) * 0.22 + 0.95
          : captionAt + 0.3 + 0.9;
        const heroTrigger = tl.scrollTrigger;
        const holdScroll = () =>
          heroTrigger ? heroTrigger.start + (networkShown / total) * (heroTrigger.end - heroTrigger.start) : 0;
        const nextScroll = () => {
          const next = document.getElementById('services');
          return next ? next.getBoundingClientRect().top + window.scrollY : 0;
        };

        let gliding = false;
        let glide: gsap.core.Tween | undefined;
        cleanups.push(() => glide?.kill());
        const glideTo = (top: number) => {
          gliding = true;
          const proxy = { y: window.scrollY };
          glide = gsap.to(proxy, {
            y: top,
            duration: 1.8,
            ease: 'power1.inOut',
            onUpdate: () => window.scrollTo({ top: proxy.y, behavior: 'instant' }),
            onComplete: () => {
              gliding = false;
            },
          });
        };

        let lastY = window.scrollY;
        const onScroll = () => {
          const y = window.scrollY;
          const direction = y - lastY;
          lastY = y;
          if (gliding || direction === 0) return;
          const hold = holdScroll();
          const next = nextScroll();
          if (y <= hold + 2 || y >= next - 2) return;
          glideTo(direction > 0 ? next : hold);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', onScroll));

        // Swallow wheel/touch input mid-glide so it can't fight the animation
        const blockWhileGliding = (event: Event) => {
          if (gliding) event.preventDefault();
        };
        window.addEventListener('wheel', blockWhileGliding, { passive: false });
        window.addEventListener('touchmove', blockWhileGliding, { passive: false });
        cleanups.push(() => {
          window.removeEventListener('wheel', blockWhileGliding);
          window.removeEventListener('touchmove', blockWhileGliding);
        });

        // Subtle pointer depth on desktop: sky moves least, nodes most
        if (desktop && finePointer) {
          const layers = [
            { el: q('.hd-sky')[0], depth: 8 },
            { el: q('.hd-city')[0], depth: 18 },
            { el: q('.hd-content')[0], depth: -6 },
          ].map(({ el, depth }) => ({
            depth,
            x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
            y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
          }));

          const onPointerMove = (event: PointerEvent) => {
            const nx = event.clientX / window.innerWidth - 0.5;
            const ny = event.clientY / window.innerHeight - 0.5;
            layers.forEach((layer) => {
              layer.x(-nx * layer.depth);
              layer.y(-ny * layer.depth);
            });
          };

          window.addEventListener('pointermove', onPointerMove, { passive: true });
          cleanups.push(() => window.removeEventListener('pointermove', onPointerMove));
        }

        return () => cleanups.forEach((cleanup) => cleanup());
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero-dive" aria-labelledby="home-hero-title">
      <div className="hd-viewport">
        <div className="hd-layer hd-sky" aria-hidden="true">
          <div className="hd-stage">
            <div className="hd-zoom">
              <HeroImage />
            </div>
          </div>
        </div>

        <div className="hd-layer hd-city">
          <div className="hd-stage">
            <div className="hd-zoom">
              <HeroImage priority />

              <div className="hd-hub" aria-hidden="true">
                <div className="hd-hub-inner">
                  <span className="hd-hub-ring" />
                  <span className="hd-hub-ring" />
                  <span className="hd-hub-ring" />
                  <span className="hd-hub-core" />
                  <span className="hd-hub-flare" />
                </div>
              </div>

              <ul className="hd-nodes" aria-label="Broadway services across the city">
                {NETWORK_NODES.map((node) => {
                  const Icon = node.icon;
                  return (
                    <li
                      key={node.label}
                      className="hd-node"
                      style={
                        {
                          '--x': `${node.x}%`,
                          '--y': `${node.y}%`,
                          '--stem': `${node.stem}%`,
                        } as React.CSSProperties
                      }
                    >
                      <div className="hd-node-pop">
                        <button type="button" className="hd-node-badge" onClick={() => handleNodeClick(node)}>
                          <span className="hd-node-icon">
                            <Icon aria-hidden="true" strokeWidth={1.6} />
                          </span>
                          <span className="hd-node-label">{node.label}</span>
                        </button>
                      </div>
                      <span className="hd-node-stem" aria-hidden="true" />
                      <span className="hd-node-dot" aria-hidden="true" />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="hd-sky-wash" aria-hidden="true" />

        <div className="hd-content">
          <div className="home-hero-copy">
            <p className="home-hero-intro hd-copy-item">Fibre • Networking • Security • IT</p>
            <h1 id="home-hero-title" className="home-hero-title hd-copy-item">
              <span>Connecting lives.</span>
              <span>Powering possibilities.</span>
            </h1>
          </div>
          <div className="hd-lower">
            <p className="home-hero-description hd-copy-item">
              Internet, networks, security, IT and entertainment.
              <br />
              One partner for homes, communities and organisations.
            </p>
            <div className="home-hero-actions hd-copy-item">
              <a href="#services" onClick={scrollToServices} className="home-primary-action">
                Explore services
                <ArrowRight aria-hidden="true" />
              </a>
              <button type="button" onClick={() => onOpenEnquiry()} className="home-secondary-action">
                Discuss your requirements
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="hd-caption" aria-hidden="true">
          <p className="hd-caption-eyebrow">One partner. One network.</p>
          <p className="hd-caption-title">Every service your world runs on.</p>
          <p className="hd-caption-list">
            Broadband · Leased lines · CCTV · Entertainment · Smart homes · IT &amp; cloud
          </p>
        </div>

        <div className="hd-cue" aria-hidden="true">
          <span>Scroll to explore the network</span>
          <ChevronsDown />
        </div>

        <div className="hd-fade" aria-hidden="true" />
      </div>
    </section>
  );
};
