/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HomeHeader } from './components/HomeHeader';
import { HomeHero } from './components/HomeHero';
import { ServiceFamilies } from './components/ServiceFamilies';
import { AudienceSolutions } from './components/AudienceSolutions';
import { DeliveryProcess } from './components/DeliveryProcess';
import { TestimonialsPrototype } from './components/TestimonialsPrototype';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { FeaturedCategoryKey } from './types';

// The enquiry form sits below several pinned, scrubbed sections (one with scroll snapping).
// Any animated scroll through them gets cut short by ScrollTrigger, so jump straight to the
// form, let the pins settle, then correct once and put the cursor in the first field.
const scrollToEnquiry = () => {
  const enquiryEl = document.getElementById('enquiry');
  if (!enquiryEl) return;
  const jump = () => {
    const margin = parseFloat(getComputedStyle(enquiryEl).scrollMarginTop) || 0;
    window.scrollTo({ top: enquiryEl.getBoundingClientRect().top + window.scrollY - margin, behavior: 'instant' });
  };
  jump();
  requestAnimationFrame(() => {
    jump();
    enquiryEl.querySelector<HTMLElement>('input, select, textarea')?.focus({ preventScroll: true });
  });
};

export default function App() {
  const [activeDetailCategory, setActiveDetailCategory] = useState<FeaturedCategoryKey | null>(null);
  const [enquiryService, setEnquiryService] = useState<string>('FTTH Gigabit Broadband');
  const [enquiryAudience, setEnquiryAudience] = useState<string>('Apartments & communities');

  const handleOpenEnquiry = (serviceCategory?: string, audienceType?: string) => {
    if (serviceCategory) {
      setEnquiryService(serviceCategory);
    }
    if (audienceType) {
      setEnquiryAudience(audienceType);
    }
    scrollToEnquiry();
  };

  const handleSelectCategory = (key: FeaturedCategoryKey) => {
    setActiveDetailCategory(key);
  };

  const handleModalEnquire = (serviceName: string) => {
    setEnquiryService(serviceName);
    scrollToEnquiry();
  };

  return (
    <div id="top" className="min-h-screen bg-white text-slate-800 flex flex-col font-body selection:bg-[#E3F0FA] selection:text-[#0E2A48]">
      {/* Top Bar Navigation */}
      <HomeHeader
        onOpenEnquiry={() => handleOpenEnquiry()}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Full-screen connected city that dives into the network hub on scroll */}
        <HomeHero onOpenEnquiry={() => handleOpenEnquiry()} onSelectCategory={handleSelectCategory} />

        {/* “One partner. Every technology solution.” - service families on a scroll-driven 3D ring */}
        <ServiceFamilies
          onOpenEnquiry={handleOpenEnquiry}
          onSelectCategory={handleSelectCategory}
        />

        {/* 2. “Technology that fits your world.” - Sector / Audience Solutions */}
        <AudienceSolutions onOpenEnquiry={handleOpenEnquiry} />

        {/* Client experiences - clearly labelled sample feedback */}
        <TestimonialsPrototype onOpenEnquiry={handleOpenEnquiry} />

        {/* Closing call to action */}
        <DeliveryProcess onOpenEnquiry={handleOpenEnquiry} />

        {/* 6. Interactive Enquiry Form with Demo Notice */}
        <EnquirySection
          initialServiceCategory={enquiryService}
          initialAudienceType={enquiryAudience}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Deep Specification Detail View Modal for Featured Categories */}
      <ServiceDetailModal
        categoryKey={activeDetailCategory}
        onClose={() => setActiveDetailCategory(null)}
        onEnquire={handleModalEnquire}
      />
    </div>
  );
}
