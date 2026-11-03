import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react';
import { FeaturedCategoryKey } from '../types';
import '../footer.css';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onSelectCategory: (key: FeaturedCategoryKey) => void;
  onOpenEnquiry: (serviceCategory?: string) => void;
  /** '' on the home page; '/' on other pages so in-page anchors lead back home. */
  linkPrefix?: string;
}

const SERVICE_LINKS: { label: string; key: FeaturedCategoryKey }[] = [
  { label: 'FTTH broadband', key: 'ftth' },
  { label: 'Telephone & intercom', key: 'voice' },
  { label: 'Business broadband & leased lines', key: 'business' },
  { label: 'CCTV & automation', key: 'security' },
];

const AUDIENCE_LINKS = [
  'Individual homes & villas',
  'Apartments & communities',
  'Enterprises & BPOs',
  'Educational & hospital campuses',
];

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenEnquiry,
  linkPrefix = '',
}) => {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const mm = gsap.matchMedia(footer);

    // The giant wordmark rises out of the floor as the page reaches its end
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        footer.querySelector('.ft-wordmark'),
        { yPercent: 55, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: footer, start: 'top 85%', end: 'bottom bottom', scrub: 0.6 },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <footer ref={footerRef} className="ft">
      <div className="ft-glow" aria-hidden="true" />

      <div className="ft-inner">
        <div className="ft-grid">
          <div className="ft-brand">
            <a href={`${linkPrefix}#top`} className="ft-logo" aria-label="Broadway Communication home">
              <span>Broadway</span>
              <small>Communication</small>
            </a>
            <p className="ft-summary">
              Broadway Communication Pvt. Ltd., Bengaluru. Established in 2000. Unified optical infrastructure,
              high-speed broadband, enterprise networks, intercom, security surveillance and digital entertainment.
            </p>
            <ul className="ft-contact">
              <li>
                <MapPin aria-hidden="true" />
                Bengaluru, Karnataka 560001, India
              </li>
              <li>
                <Phone aria-hidden="true" />
                +91 80 4000 BROADWAY / +91 80 2550 2000
              </li>
              <li>
                <Mail aria-hidden="true" />
                enquiry@broadwaycommunication.com
              </li>
            </ul>
          </div>

          <nav className="ft-col" aria-label="Featured services">
            <h4>Featured services</h4>
            <ul>
              {SERVICE_LINKS.map((link) => (
                <li key={link.key}>
                  <button type="button" onClick={() => onSelectCategory(link.key)}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ft-col" aria-label="Who we serve">
            <h4>Who we serve</h4>
            <ul>
              {AUDIENCE_LINKS.map((label) => (
                <li key={label}>
                  <a href={`${linkPrefix}#who-we-serve`}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ft-col" aria-label="Support and company">
            <h4>Support &amp; company</h4>
            <ul>
              <li>
                <a href={`${linkPrefix}#process`}>Survey &amp; deployment process</a>
              </li>
              <li>
                <a href="/about">Company heritage (Est. 2000)</a>
              </li>
              <li>
                <a href={`${linkPrefix}#support`}>24/7 Bengaluru helpdesk</a>
              </li>
              <li>
                <button type="button" className="ft-accent-link" onClick={() => onOpenEnquiry()}>
                  Request technical feasibility
                  <ArrowUpRight aria-hidden="true" />
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="ft-signal" aria-hidden="true">
          <span />
        </div>

        <div className="ft-bottom">
          <div>
            <p>© 2000–2026 Broadway Communication Pvt. Ltd. Bengaluru, Karnataka, India. All rights reserved.</p>
            <p className="ft-demo">
              Demo notice: this is a responsive marketing website prototype. No customer data is permanently stored
              or sent over external networks.
            </p>
          </div>
          <button type="button" className="ft-top" onClick={scrollToTop}>
            Back to top
            <ArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="ft-wordmark-wrap" aria-hidden="true">
        <p className="ft-wordmark">Broadway</p>
      </div>
    </footer>
  );
};
