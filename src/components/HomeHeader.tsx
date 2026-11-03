import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Phone, Server, Shield, Tv, Wifi, X } from 'lucide-react';
import { FeaturedCategoryKey } from '../types';

interface HomeHeaderProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
  onSelectCategory: (key: FeaturedCategoryKey) => void;
  /** '' on the home page; '/' on other pages so in-page anchors lead back home. */
  linkPrefix?: string;
}

const serviceFamilies = [
  { name: 'Internet connectivity', icon: Wifi, key: 'ftth' as FeaturedCategoryKey },
  { name: 'Networks & Wi-Fi', icon: Server, key: 'business' as FeaturedCategoryKey },
  { name: 'Security & automation', icon: Shield, key: 'security' as FeaturedCategoryKey },
  { name: 'Voice & intercom', icon: Phone, key: 'voice' as FeaturedCategoryKey },
  { name: 'IT & digital services', icon: Server },
  { name: 'Entertainment', icon: Tv },
];

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onOpenEnquiry,
  onSelectCategory,
  linkPrefix = '',
}) => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`home-header ${scrolled ? 'home-header--scrolled' : ''}`}>
      <div className="home-header-inner">
        <a href={`${linkPrefix}#top`} className="home-wordmark" aria-label="Broadway Communication home">
          <span>Broadway</span>
          <small>Communication</small>
        </a>

        <div className="home-header-right">
          <nav className="home-desktop-nav" aria-label="Primary navigation">
            <div
              className="home-services-menu"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="desktop-services-menu"
                onClick={() => setServicesOpen((open) => !open)}
              >
                Services
                <ChevronDown aria-hidden="true" className={servicesOpen ? 'rotate-180' : ''} />
              </button>

              {servicesOpen && (
                <div id="desktop-services-menu" className="home-services-dropdown">
                  <p>Service families</p>
                  {serviceFamilies.map((item) => (
                    <a
                      key={item.name}
                      href={`${linkPrefix}#services`}
                      onClick={(event) => {
                        if (item.key) {
                          event.preventDefault();
                          onSelectCategory(item.key);
                        }
                        setServicesOpen(false);
                      }}
                    >
                      <item.icon aria-hidden="true" />
                      <span>{item.name}</span>
                    </a>
                  ))}
                  <a href={`${linkPrefix}#services`} className="home-services-view-all" onClick={() => setServicesOpen(false)}>
                    View all services
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>

            <a href={`${linkPrefix}#who-we-serve`}>Who we serve</a>
            <a href="/about">About us</a>
            <a href={`${linkPrefix}#support`}>Support</a>
          </nav>

          <button type="button" className="home-header-cta" onClick={() => onOpenEnquiry()}>
            Talk to our team
          </button>

          <button
            type="button"
            className="home-menu-trigger"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="home-mobile-nav" aria-label="Mobile navigation">
          <a href={`${linkPrefix}#services`} onClick={closeMobileMenu}>Services</a>
          <a href={`${linkPrefix}#who-we-serve`} onClick={closeMobileMenu}>Who we serve</a>
          <a href="/about" onClick={closeMobileMenu}>About us</a>
          <a href={`${linkPrefix}#support`} onClick={closeMobileMenu}>Support</a>
          <button
            type="button"
            onClick={() => {
              closeMobileMenu();
              onOpenEnquiry();
            }}
          >
            Talk to our team
            <ArrowRight aria-hidden="true" />
          </button>
        </nav>
      )}
    </header>
  );
};
