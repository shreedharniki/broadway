import React, { useEffect } from 'react';
import { X, CheckCircle, ArrowRight, Server, Shield, Cpu, ExternalLink } from 'lucide-react';
import { FEATURED_SERVICES } from '../data/content';
import { FeaturedCategoryKey, FeaturedServiceItem } from '../types';
import { getAssetUrl, CustomImageKey } from '../utils/assetManager';

interface ServiceDetailModalProps {
  categoryKey: FeaturedCategoryKey | null;
  onClose: () => void;
  onEnquire: (serviceName: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  categoryKey,
  onClose,
  onEnquire,
}) => {
  const service: FeaturedServiceItem | undefined = FEATURED_SERVICES.find(
    (item) => item.id === categoryKey
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (categoryKey) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [categoryKey, onClose]);

  if (!categoryKey || !service) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-[#F8FAFC]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1D64AE] font-heading block">
              Demonstration Detail View · Broadway Communication
            </span>
            <h2 id="modal-headline" className="text-xl sm:text-2xl font-extrabold text-[#0E2A48] font-heading">
              {service.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close service details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-8">
          
          {/* Hardware Feature Hero */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0E2A48] border border-slate-200 shadow-sm h-64 sm:h-72">
            <img
              src={getAssetUrl(`service-${service.id}` as CustomImageKey, service.image.replace('.png', '.webp'))}
              alt={service.title}
              width={1600}
              height={800}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
              onError={(e) => {
                if (e.currentTarget.src.includes('.webp')) {
                  e.currentTarget.src = e.currentTarget.src.replace('.webp', '.png');
                } else {
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A48] via-[#0E2A48]/50 to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-300 block mb-1">
                  {service.tagline}
                </span>
                <p className="text-sm sm:text-base font-medium text-slate-100 max-w-2xl">
                  {service.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Overview Prose */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0E2A48]">
              Architecture Overview
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {service.overview}
            </p>
          </div>

          {/* Two Columns: Specs & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Key Specifications */}
            <div className="bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4 text-[#1D64AE]">
                <Server className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E2A48]">
                  Technical Specifications
                </h4>
              </div>
              <ul className="space-y-3">
                {service.keySpecs.map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-[#1D64AE] shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hardware & Equipment Scope */}
            <div className="bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 border border-slate-200/80">
              <div className="flex items-center gap-2 mb-4 text-[#1D64AE]">
                <Cpu className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E2A48]">
                  Equipment & Hardware Bill
                </h4>
              </div>
              <ul className="space-y-3">
                {service.equipmentDetails.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Shield className="w-3.5 h-3.5 text-[#1D64AE] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sector Fit & Deployments */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
              <span className="font-bold text-[#0E2A48]">Typical Deployments:</span>
              <span className="text-slate-600">{service.typicalDeployments}</span>
            </div>
            <div>
              <span className="font-bold text-[#0E2A48] block mb-1.5">Ideal For:</span>
              <div className="flex flex-wrap gap-2">
                {service.idealFor.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 sm:px-8 py-5 border-t border-slate-100 bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Enquiring will pre-select <strong>{service.title}</strong> in the enquiry form.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onEnquire(service.title);
                onClose();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#1D64AE] hover:bg-[#0E2A48] rounded-xl transition-colors shadow-sm"
            >
              <span>Enquire for {service.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
