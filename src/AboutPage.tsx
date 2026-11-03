import React, { useEffect, useState } from 'react';
import { HomeHeader } from './components/HomeHeader';
import { BroadwayInAction } from './components/BroadwayInAction';
import { AboutSection } from './components/AboutSection';
import { EnquirySection } from './components/EnquirySection';
import { Footer } from './components/Footer';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { FeaturedCategoryKey } from './types';

export function AboutPage() {
  const [activeDetailCategory, setActiveDetailCategory] = useState<FeaturedCategoryKey | null>(null);
  const [enquiryService, setEnquiryService] = useState<string>('FTTH Gigabit Broadband');
  const [enquiryAudience, setEnquiryAudience] = useState<string>('Apartments & communities');

  useEffect(() => {
    document.title = 'About us | Broadway Communication';
  }, []);

  const scrollToEnquiry = () => {
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenEnquiry = (serviceCategory?: string, audienceType?: string) => {
    if (serviceCategory) setEnquiryService(serviceCategory);
    if (audienceType) setEnquiryAudience(audienceType);
    scrollToEnquiry();
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-white text-slate-800 flex flex-col font-body selection:bg-[#E3F0FA] selection:text-[#0E2A48]"
    >
      <HomeHeader
        linkPrefix="/"
        onOpenEnquiry={() => handleOpenEnquiry()}
        onSelectCategory={setActiveDetailCategory}
      />

      <main className="flex-1 pt-[78px]">
        {/* Infrastructure engineering stories */}
        <BroadwayInAction onOpenEnquiry={handleOpenEnquiry} />

        {/* Company heritage */}
        <AboutSection />

        <EnquirySection initialServiceCategory={enquiryService} initialAudienceType={enquiryAudience} />
      </main>

      <Footer
        linkPrefix="/"
        onSelectCategory={setActiveDetailCategory}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      <ServiceDetailModal
        categoryKey={activeDetailCategory}
        onClose={() => setActiveDetailCategory(null)}
        onEnquire={(serviceName) => {
          setEnquiryService(serviceName);
          scrollToEnquiry();
        }}
      />
    </div>
  );
}
