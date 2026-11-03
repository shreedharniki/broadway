import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Send,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { BENGALURU_ZONES } from '../data/content';
import { EnquiryFormData } from '../types';
import '../enquiry.css';

gsap.registerPlugin(ScrollTrigger);

// Points on /images/one-partner-map.webp (in % of the image) and the service each one pre-selects
const MAP_HOTSPOTS = [
  { label: 'IT & cloud', service: 'IT & digital server room fit-out', x: 70, y: 13 },
  { label: 'Apartments & societies', service: 'Comprehensive multi-service society package', x: 46.8, y: 24 },
  { label: 'Business leased lines', service: '1:1 Internet Leased Lines', x: 74, y: 37 },
  { label: 'Fibre broadband', service: 'FTTH Gigabit Broadband', x: 38.6, y: 61 },
  { label: 'Networks & Wi-Fi', service: 'Networks & Wi-Fi infrastructure', x: 51, y: 72 },
  { label: 'Voice & intercom', service: 'Telephone & intercom systems', x: 63.6, y: 62 },
  { label: 'CCTV & automation', service: 'CCTV & automation systems', x: 80.5, y: 59.5 },
] as const;

interface EnquirySectionProps {
  initialServiceCategory?: string;
  initialAudienceType?: string;
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({
  initialServiceCategory = '',
  initialAudienceType = '',
}) => {
  const [formData, setFormData] = useState<EnquiryFormData>({
    fullName: '',
    organization: '',
    email: '',
    phone: '',
    bengaluruZone: 'Whitefield & ITPL',
    serviceCategory: initialServiceCategory || 'FTTH Gigabit Broadband',
    audienceType: initialAudienceType || 'Apartments & communities',
    requirements: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<EnquiryFormData | null>(null);

  // Sync when props change from cards or external triggers
  useEffect(() => {
    if (initialServiceCategory) {
      setFormData((prev) => ({ ...prev, serviceCategory: initialServiceCategory }));
      setSubmitted(false);
    }
  }, [initialServiceCategory]);

  useEffect(() => {
    if (initialAudienceType) {
      setFormData((prev) => ({ ...prev, audienceType: initialAudienceType }));
      setSubmitted(false);
    }
  }, [initialAudienceType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData({ ...formData });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      organization: '',
      email: '',
      phone: '',
      bengaluruZone: 'Whitefield & ITPL',
      serviceCategory: 'FTTH Gigabit Broadband',
      audienceType: 'Apartments & communities',
      requirements: '',
    });
  };

  // Compile list of all selectable services
  const allServicesList = [
    'FTTH Gigabit Broadband',
    '1:1 Internet Leased Lines',
    'Telephone & intercom systems',
    'CCTV & automation systems',
    'Networks & Wi-Fi infrastructure',
    'IT & digital server room fit-out',
    'Entertainment & IPTV headends',
    'Comprehensive multi-service society package',
  ];

  const rootRef = useRef<HTMLElement>(null);

  const selectService = (service: string) => {
    setFormData((prev) => ({ ...prev, serviceCategory: service }));
    setSubmitted(false);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        finePointer: '(pointer: fine) and (min-width: 1024px)',
      },
      (context) => {
        const { motion, finePointer } = context.conditions as Record<string, boolean>;
        if (!motion) return;

        const q = gsap.utils.selector(root);

        // The network map lies flat and tilts up into place as the section arrives
        gsap.fromTo(
          q('.eq-map-stage'),
          { rotationX: 32, y: 80, opacity: 0.4 },
          {
            rotationX: 0,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: q('.eq-map')[0], start: 'top bottom', end: 'top 35%', scrub: 0.6 },
          },
        );

        gsap.from(q('.eq-form-card'), {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('.eq-form-card')[0], start: 'top 85%', once: true },
        });

        // Gentle pointer tilt on the map (an inner box, so it never fights the scroll tween)
        if (finePointer) {
          const map = q('.eq-map')[0] as HTMLElement;
          const tilt = q('.eq-map-tilt')[0];
          const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' });
          const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' });

          const onMove = (event: PointerEvent) => {
            const rect = map.getBoundingClientRect();
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;
            rx(-ny * 8);
            ry(nx * 10);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };

          map.addEventListener('pointermove', onMove);
          map.addEventListener('pointerleave', onLeave);
          return () => {
            map.removeEventListener('pointermove', onMove);
            map.removeEventListener('pointerleave', onLeave);
          };
        }
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="enquiry" className="eq-section" aria-labelledby="enquiry-title">
      <div className="eq-inner">
        <div className="eq-head">
          <p className="eq-eyebrow">Start a conversation</p>
          <h2 id="enquiry-title">
            Discuss your <span>requirements.</span>
          </h2>
          <p className="eq-intro">
            Whether connecting a high-density apartment society, establishing dedicated enterprise leased lines,
            or securing a multi-acre institution, our engineers are ready to assist.
          </p>
        </div>

        <div className="eq-grid">
          <div className="eq-visual">
            <div className="eq-map">
              <div className="eq-map-stage">
                <div className="eq-map-tilt">
                  <img
                    src="/images/one-partner-map.webp"
                    alt="Homes, an apartment block and an office on one Broadway network with a router, switch, desk phone, intercom, CCTV camera and cloud"
                    width={1600}
                    height={893}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="eq-map-core" aria-hidden="true" />
                  {MAP_HOTSPOTS.map((spot) => {
                    const isActive = formData.serviceCategory === spot.service;
                    return (
                      <button
                        key={spot.label}
                        type="button"
                        className="eq-spot"
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        aria-pressed={isActive}
                        onClick={() => selectService(spot.service)}
                      >
                        <span className="eq-spot-dot" aria-hidden="true" />
                        <span className="eq-spot-label">{spot.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="eq-map-hint">
              <strong>One partner, one network.</strong> Tap any part of it to add that service to your enquiry.
            </p>

            <div className="eq-contact">
              <div className="eq-contact-head">
                <span>Established 2000 in Bengaluru</span>
                <h3>Broadway Communication Pvt. Ltd.</h3>
              </div>
              <ul className="eq-contact-list">
                <li>
                  <MapPin aria-hidden="true" />
                  <div>
                    <strong>Registered tech hub</strong>
                    Broadway Communication Towers, Bengaluru, Karnataka 560001, India
                  </div>
                </li>
                <li>
                  <Phone aria-hidden="true" />
                  <div>
                    <strong>Enquiries &amp; helpdesk</strong>
                    +91 80 4000 BROADWAY / +91 80 2550 2000
                  </div>
                </li>
                <li>
                  <Mail aria-hidden="true" />
                  <div>
                    <strong>Email</strong>
                    enquiry@broadwaycommunication.com
                  </div>
                </li>
                <li>
                  <Clock aria-hidden="true" />
                  <div>
                    <strong>Field &amp; NOC operations</strong>
                    NOC 24/7/365 · Field dispatch 8:00 AM – 9:00 PM
                  </div>
                </li>
              </ul>
              <p className="eq-contact-note">
                <Shield aria-hidden="true" />
                Licensed Category ISP &amp; unified infrastructure partner. TRAI/DoT compliant operations.
              </p>
              <p className="eq-corridors">
                <strong>Key service corridors:</strong> Whitefield, Electronic City, Bellandur, Marathahalli, Manyata
                Tech Park, Hebbal, Koramangala, Indiranagar and Sarjapur Road.
              </p>
            </div>
          </div>

          <div className="eq-form-card">
            <div className="eq-demo-note">
              <AlertCircle aria-hidden="true" />
              <div>
                <strong>Website demonstration mode</strong>
                This form is a client demonstration prototype. Submissions simulate an enquiry acknowledgement
                locally without transmitting data to external servers.
              </div>
            </div>

            {submitted && submittedData ? (
              <div className="eq-success">
                <h3>
                  <CheckCircle aria-hidden="true" />
                  Demo enquiry simulated successfully
                </h3>

                <dl className="eq-summary">
                  <div>
                    <dt>Contact name</dt>
                    <dd>{submittedData.fullName || 'Prospective client'}</dd>
                  </div>
                  <div>
                    <dt>Selected service</dt>
                    <dd className="eq-summary-accent">{submittedData.serviceCategory}</dd>
                  </div>
                  <div>
                    <dt>Sector / scale</dt>
                    <dd>{submittedData.audienceType}</dd>
                  </div>
                  <div>
                    <dt>Bengaluru region</dt>
                    <dd>{submittedData.bengaluruZone}</dd>
                  </div>
                  <div>
                    <dt>Contact details</dt>
                    <dd>
                      {submittedData.email} · {submittedData.phone}
                    </dd>
                  </div>
                </dl>

                <p className="eq-success-note">
                  <strong>Notice:</strong> this is a demonstration website and no enquiry was actually sent to
                  Broadway Communication servers.
                </p>

                <button type="button" onClick={handleReset} className="eq-reset">
                  <RotateCcw aria-hidden="true" />
                  Submit another demonstration enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="eq-form">
                <div className="eq-row">
                  <div className="eq-field">
                    <label htmlFor="fullName">
                      Your name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="eq-field">
                    <label htmlFor="organization">Organisation / society / residence</label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="e.g. Prestige Enclave RWA / Tech Corp"
                      value={formData.organization}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="eq-row">
                  <div className="eq-field">
                    <label htmlFor="email">
                      Email address <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@organisation.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="eq-field">
                    <label htmlFor="phone">
                      Phone number <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+91 98450 XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="eq-row">
                  <div className="eq-field">
                    <label htmlFor="serviceCategory">
                      Service requirement <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="serviceCategory"
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                    >
                      {allServicesList.map((svc) => (
                        <option key={svc} value={svc}>
                          {svc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="eq-field">
                    <label htmlFor="audienceType">
                      Deployment sector <span aria-hidden="true">*</span>
                    </label>
                    <select id="audienceType" name="audienceType" value={formData.audienceType} onChange={handleChange}>
                      <option value="Homes">Individual home / villa</option>
                      <option value="Apartments & communities">Apartments &amp; gated community</option>
                      <option value="Businesses">Corporate office / enterprise</option>
                      <option value="Institutions & campuses">Institutional / hospital campus</option>
                    </select>
                  </div>
                </div>

                <div className="eq-field">
                  <label htmlFor="bengaluruZone">
                    Bengaluru location / zone <span aria-hidden="true">*</span>
                  </label>
                  <select id="bengaluruZone" name="bengaluruZone" value={formData.bengaluruZone} onChange={handleChange}>
                    {BENGALURU_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="eq-field">
                  <label htmlFor="requirements">Specific requirements or site context (optional)</label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={3}
                    placeholder="Number of units, required bandwidth, existing infrastructure or target date…"
                    value={formData.requirements}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="eq-submit">
                  <Send aria-hidden="true" />
                  Send demonstration enquiry
                </button>
                <p className="eq-submit-note">Simulated enquiry will acknowledge immediately on click.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

