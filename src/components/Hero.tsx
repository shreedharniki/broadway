import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Check, Upload } from 'lucide-react';
import { FEATURED_SERVICES } from '../data/content';
import { FeaturedCategoryKey } from '../types';
import { getAssetUrl, saveCustomAsset } from '../utils/assetManager';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_CARD_IMAGES: Record<string, string> = {
  ftth: '/images/service-ftth-photoreal.png',
  voice: '/images/service-voice-photoreal.png',
  business: '/images/service-business-photoreal.png',
  security: '/images/service-security-photoreal.png',
};

interface HeroProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
  onSelectCategory: (key: FeaturedCategoryKey) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onSelectCategory }) => {
  const [heroBgUrl, setHeroBgUrl] = useState<string>(() =>
    getAssetUrl('Broadway-home', '/images/broadway-new-home.png')
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // GSAP animation container and element references
  const heroPinSectionRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLElement>(null);
  const cityBgRef = useRef<HTMLDivElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Sync if assets are updated in local storage or events
  useEffect(() => {
    const handleUpdate = () => {
      setHeroBgUrl(getAssetUrl('Broadway-home', '/images/broadway-new-home.png'));
    };
    window.addEventListener('broadway-assets-updated', handleUpdate);
    return () => window.removeEventListener('broadway-assets-updated', handleUpdate);
  }, []);

  // GSAP matchMedia Scroll-driven depth sequence with reduced motion handling
  useEffect(() => {
    const pinSection = heroPinSectionRef.current;
    const heroWrapper = heroWrapperRef.current;
    const cityBg = cityBgRef.current;
    const headline = headlineBlockRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardElementsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!pinSection || !heroWrapper || !cityBg || !headline || !cardsContainer || cards.length === 0) {
      return;
    }

    const mm = gsap.matchMedia();

    // 1. Desktop & Laptop view (min-width: 1024px) AND motion preferred
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      // Opening entrance reveal: restrained, non-blocking, visible immediately with natural flow
      gsap.fromTo(
        headline,
        { opacity: 0.9, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        cards,
        { opacity: 0.85, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: 'power2.out' }
      );

      // Card initial 3D transforms for depth:
      // The cards move forward through shallow perspective with slight rotation (-2.5 deg to +2.5 deg)
      // and settle cleanly flat and readable as scrolling progresses.
      const rotations = [-2.5, -0.8, 0.8, 2.5];
      const initialZ = [-50, -25, -25, -50];
      const initialY = [40, 25, 25, 40];

      // Set initial state of cards for depth entrance
      cards.forEach((card, i) => {
        gsap.set(card, {
          transformPerspective: 1200,
          rotationY: rotations[i] || 0,
          rotationX: 3,
          z: initialZ[i] || -30,
          y: initialY[i] || 30,
          opacity: 0.92,
          transformOrigin: '50% 100%',
        });
      });

      // Pinned ScrollTrigger sequence with ~80vh scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          start: 'top top',
          end: '+=80vh',
          pin: heroWrapper,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // City background: slowly enlarge from 1.00 to 1.06 (keeping clean bounds)
      tl.to(
        cityBg,
        {
          scale: 1.06,
          y: -15,
          ease: 'power1.inOut',
          duration: 1,
        },
        0
      );

      // Headline: moves upward slightly (-35px) and gently fades out (opacity 0) as it exits naturally
      tl.to(
        headline,
        {
          y: -45,
          opacity: 0,
          ease: 'power1.in',
          duration: 0.65,
        },
        0
      );

      // Move the four service panels forward through shallow perspective,
      // subtle rotation settling to 0 (flat & readable), resting squarely in view
      cards.forEach((card) => {
        tl.to(
          card,
          {
            rotationY: 0,
            rotationX: 0,
            z: 0,
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            duration: 0.85,
          },
          0.1
        );
      });

      // Refresh measurements after assets and fonts load
      ScrollTrigger.refresh();
    });

    // 2. Mobile / Tablet view (< 1024px):
    // No pinning, no 3D perspective rotation. Gentle subtle reveal.
    mm.add('(max-width: 1023px)', () => {
      gsap.set(cityBg, { clearProps: 'all' });
      gsap.set(headline, { clearProps: 'all' });
      cards.forEach((card) => gsap.set(card, { clearProps: 'all' }));

      // Soft entrance reveal on load
      gsap.fromTo(
        headline,
        { opacity: 0.9, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(
        cards,
        { opacity: 0.9, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
      );
    });

    // 3. Reduced Motion preference (prefers-reduced-motion: reduce):
    // Remove zoom, parallax, pinning, and tilt. Show complete normal page.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(cityBg, { clearProps: 'all' });
      gsap.set(headline, { clearProps: 'all' });
      cards.forEach((card) => gsap.set(card, { clearProps: 'all' }));
    });

    // Refresh scroll measurements on window load / resize
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
      mm.revert();
    };
  }, []);

  // Drag and drop listener for background or general image drops
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleBackgroundUpload(file);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleBackgroundUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        try {
          const finalUrl = await saveCustomAsset('Broadway-home', dataUrl);
          const activeUrl = finalUrl || dataUrl;
          setHeroBgUrl(activeUrl);
          showToast('Updated home page background image!');
        } catch {
          setHeroBgUrl(dataUrl);
          showToast('Updated home page background image!');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div ref={heroPinSectionRef} className="relative w-full">
      <section
        ref={heroWrapperRef}
        className="relative w-full lg:h-screen lg:min-h-[680px] lg:max-h-[960px] min-h-[780px] overflow-hidden flex flex-col justify-between pt-12 sm:pt-14 lg:pt-14 pb-5 sm:pb-6 lg:pb-6"
      >
        {/* 
          Full-Bleed Photographic Background:
          Displays the daytime Bengaluru connected cityscape with blue fiber optic trails.
          Animated via GSAP to slowly scale from 1.00 to 1.06 on desktop scroll.
        */}
        <div
          ref={cityBgRef}
          className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none will-change-transform origin-center"
        >
          <img
            src={heroBgUrl}
            alt="Broadway Communication Bengaluru connected city background"
            width={2560}
            height={1440}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-top scale-100"
            referrerPolicy="no-referrer"
            onError={() => {
              if (heroBgUrl !== '/images/broadway-new-home.png') {
                setHeroBgUrl('/images/broadway-new-home.png');
              } else {
                setHeroBgUrl('/images/broadway-city.png');
              }
            }}
          />
          {/* Fine atmospheric gradient purely for text contrast at the top without darkening the buildings */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Hidden file input for background */}
        <input
          ref={bgInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleBackgroundUpload(file);
          }}
        />

        {/* Drag & Drop Visual Indicator */}
        {isDragOver && (
          <div className="fixed inset-0 z-50 bg-[#0952e7]/80 backdrop-blur-sm border-4 border-dashed border-white flex items-center justify-center pointer-events-none text-white">
            <div className="text-center">
              <Upload className="w-16 h-16 mx-auto mb-3 animate-bounce" />
              <span className="text-2xl font-bold font-heading">
                Drop image to set as background
              </span>
            </div>
          </div>
        )}

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#0E2A48] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-sky-400 flex items-center gap-2 text-xs font-semibold animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Hero Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between">
          
          {/* 
            Upper Headline Block:
            Positioned in the expansive blue sky area above the Bengaluru cityscape.
            Animated upward slightly and gently fading as it exits on scroll.
          */}
          <div
            ref={headlineBlockRef}
            className="max-w-3xl mx-auto text-center pt-2 sm:pt-4 lg:pt-5 will-change-transform"
          >
            {/* Overline Kicker */}
            <div className="mb-1.5 sm:mb-2">
              <span className="text-xs sm:text-[13px] font-semibold text-[#0952e7] tracking-tight font-heading">
                Bengaluru. Connected since 2000.
              </span>
            </div>

            {/* Headline: 'Connecting lives.' (navy #0E2A48) & 'Powering possibilities.' with 'possibilities.' in #0952e7 */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[45px] font-extrabold tracking-tight leading-[1.12] mb-2.5 sm:mb-3 font-heading">
              <span className="text-[#0E2A48] block">Connecting lives.</span>
              <span className="text-[#0952e7] block">
                Powering possibilities.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[14px] sm:text-[14.5px] leading-[22px] font-normal text-[#0b0d22] text-center no-underline max-w-xl mx-auto mb-4 sm:mb-5">
              Internet, networks, security, IT and entertainment.
              <br className="hidden sm:inline" />
              <span> One partner for homes, communities and organisations.</span>
            </p>

            {/* Action Row */}
            <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Primary Action Button: Box with solid hex #0952e7 - Smooth scroll bypassing opening */}
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('services');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0952e7] hover:bg-[#0742bf] active:bg-[#063499] rounded-full shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0952e7]"
              >
                <span>Explore services</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>

              {/* Secondary Action: Text and Arrow in hex #0952e7 */}
              <button
                onClick={() => onOpenEnquiry()}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0952e7] hover:text-[#0742bf] underline underline-offset-4 decoration-2 transition-colors focus-visible:outline-none"
              >
                <span>Discuss your requirements</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0952e7]" />
              </button>
            </div>
          </div>

          {/* 
            Middle Spatial Band:
            Leaves the central city view clear and unobstructed.
          */}
          <div className="hidden lg:block flex-1 min-h-[40px] pointer-events-none" />

          {/* 
            The Four Translucent Featured Service Panels along the bottom:
            Layered 3D depth experience with subtle rotation settling flat on scroll.
          */}
          <div
            ref={cardsContainerRef}
            className="w-full pt-2 sm:pt-3 lg:pt-0 pb-1 sm:pb-2 perspective-container"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-3.5 preserve-3d">
              {FEATURED_SERVICES.map((service, idx) => {
                const currentImg = SERVICE_CARD_IMAGES[service.id] || service.image;

                return (
                  <div
                    key={service.id}
                    ref={(el) => {
                      cardElementsRef.current[idx] = el;
                    }}
                    onClick={() => onSelectCategory(service.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCategory(service.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${service.title}`}
                    className="group relative h-28 sm:h-[120px] lg:h-[124px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0952e7] border border-white/35 hover:border-white/80 bg-[#07192f]/85 backdrop-blur-md flex will-change-transform"
                  >
                    {/* 
                      Full Card Background Image with Right Alignment & Left Dark Fade
                    */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                      <img
                        src={currentImg}
                        alt={service.title}
                        width={800}
                        height={450}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          if (e.currentTarget.src.includes('.webp')) {
                            e.currentTarget.src = e.currentTarget.src.replace('.webp', '.png');
                          } else if (e.currentTarget.src.includes('/images/')) {
                            e.currentTarget.src = `/${service.image.replace('/images/', '')}`;
                          }
                        }}
                      />
                      {/* Gradient overlay to smoothly blend the left dark side with the image */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#07192f] via-[#07192f]/80 to-transparent pointer-events-none" />
                    </div>

                    {/* Card Content Layer: Title on top-left, Circular Outline Arrow Button on bottom-left */}
                    <div className="relative z-10 w-full h-full p-2.5 sm:p-3 lg:p-3.5 flex flex-col justify-between text-white pointer-events-none">
                      <div className="max-w-[62%] sm:max-w-[60%]">
                        <h3 className="text-[13px] sm:text-[14px] lg:text-[14.5px] font-bold leading-snug tracking-tight text-white drop-shadow-md font-heading">
                          {service.lines.map((line, lineIdx) => (
                            <span key={lineIdx} className="block">
                              {line}
                            </span>
                          ))}
                        </h3>
                      </div>

                      {/* Circular Outline Arrow Button on bottom-left */}
                      <div className="pt-1">
                        <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full border border-white/80 group-hover:border-white group-hover:bg-[#0952e7]/40 flex items-center justify-center text-white transition-all shadow-xs">
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
