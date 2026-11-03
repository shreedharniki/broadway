import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Shield, Wifi, Server, Phone, Tv } from 'lucide-react';
import { FeaturedCategoryKey } from '../types';

interface HeaderProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
  onSelectCategory: (key: FeaturedCategoryKey) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry, onSelectCategory }) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceFamilies = [
    { name: 'Internet connectivity', href: '#services', icon: Wifi, key: 'ftth' as FeaturedCategoryKey },
    { name: 'Networks & Wi-Fi', href: '#services', icon: Server, key: 'business' as FeaturedCategoryKey },
    { name: 'Security & automation', href: '#services', icon: Shield, key: 'security' as FeaturedCategoryKey },
    { name: 'Voice & intercom', href: '#services', icon: Phone, key: 'voice' as FeaturedCategoryKey },
    { name: 'IT & digital services', href: '#services', icon: Server },
    { name: 'Entertainment', href: '#services', icon: Tv },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 h-[65px] flex items-center ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between gap-6">
          
          {/* Brand Wordmark (Aligned to the left) */}
          <a
            href="#"
            className="flex flex-col group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D64AE] rounded"
            aria-label="Broadway Communication Home"
          >
            <span className="text-[26px] sm:text-[28px] font-extrabold tracking-tight text-[#0E2A48] leading-tight font-heading">
              Broadway
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#0E2A48]/85 -mt-1 font-heading">
              Communication
            </span>
          </a>

          {/* Right Group: Nav Links + Talk to our team button */}
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-9">
            {/* Nav Links: Services ∨, Who we serve, About us, Support */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-medium text-[#0E2A48]">
              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center gap-1.5 py-1 text-[#0E2A48] hover:text-[#1D64AE] transition-colors whitespace-nowrap focus-visible:outline-none"
                  aria-expanded={servicesOpen}
                >
                  <span className="font-semibold">Services</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#0E2A48] transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 w-80 pt-2 z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Core Infrastructure Families
                      </div>
                      {serviceFamilies.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => {
                            if (item.key) {
                              e.preventDefault();
                              onSelectCategory(item.key);
                            }
                            setServicesOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#E3F0FA] hover:text-[#0E2A48] transition-colors"
                        >
                          <item.icon className="w-4 h-4 text-[#1D64AE] shrink-0" />
                          <span>{item.name}</span>
                        </a>
                      ))}
                      <div className="pt-2 border-t border-slate-100 mt-2 px-3 pb-1">
                        <a
                          href="#services"
                          onClick={() => setServicesOpen(false)}
                          className="text-xs font-semibold text-[#1D64AE] hover:underline flex items-center justify-between"
                        >
                          <span>Explore full service directory</span>
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#who-we-serve"
                className="hover:text-[#1D64AE] font-semibold transition-colors whitespace-nowrap"
              >
                Who we serve
              </a>

              <a
                href="#about"
                className="hover:text-[#1D64AE] font-semibold transition-colors whitespace-nowrap"
              >
                About us
              </a>

              <a
                href="#support"
                className="hover:text-[#1D64AE] font-semibold transition-colors whitespace-nowrap"
              >
                Support
              </a>
            </nav>

            {/* Primary Action Button (Exact design: Rounded pill with subtle border 'Talk to our team') */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenEnquiry()}
                className="hidden sm:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-[#0E2A48] hover:text-[#0E2A48] bg-transparent hover:bg-white/40 active:bg-white/60 border border-[#0E2A48]/35 hover:border-[#0E2A48] rounded-full transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D64AE] whitespace-nowrap"
              >
                <span>Talk to our team</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#0E2A48] rounded-lg border border-[#0E2A48]/20 bg-white/50 backdrop-blur-sm"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-5 pt-3 pb-6 mt-3 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Navigation</div>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-[#E3F0FA]"
          >
            Services & Solutions
          </a>
          <a
            href="#who-we-serve"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-[#E3F0FA]"
          >
            Who we serve (Homes, Communities, Businesses)
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-[#E3F0FA]"
          >
            About Broadway (Est. 2000 Bengaluru)
          </a>
          <a
            href="#support"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-[#E3F0FA]"
          >
            Support & Helpdesk
          </a>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1464B4] text-white rounded-full text-sm font-semibold"
            >
              <span>Talk to our team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
