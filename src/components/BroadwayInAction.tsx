import React from 'react';
import { MapPin, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import { PROJECT_STORY_PLACEHOLDERS } from '../data/content';

interface BroadwayInActionProps {
  onOpenEnquiry: (serviceCategory?: string) => void;
}

export const BroadwayInAction: React.FC<BroadwayInActionProps> = ({ onOpenEnquiry }) => {
  return (
    <section id="case-studies" className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1D64AE] font-heading block mb-2">
            Infrastructure Engineering
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0E2A48] tracking-tight leading-tight font-heading mb-4">
            Broadway in action.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Real multi-point network topologies engineered across Bengaluru. Below are clearly labelled
            case study prototypes demonstrating the technical scope and architectural rigor of our deployments.
          </p>
        </div>

        {/* Prototype Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PROJECT_STORY_PLACEHOLDERS.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Prototype Disclaimer Badge (Strictly adhering to instructions) */}
                <div className="mb-4">
                  <span className="inline-block text-[11px] font-semibold tracking-wide text-[#1D64AE] bg-[#E3F0FA] px-2.5 py-1 rounded-md">
                    {project.prototypeLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#1D64AE]" />
                  <span>{project.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.clientType}</span>
                </div>

                <h3 className="text-lg font-bold text-[#0E2A48] mb-4 font-heading">
                  {project.clientType} Network Architecture
                </h3>

                {/* Scope points */}
                <div className="space-y-2 mb-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Infrastructure Scope:
                  </span>
                  {project.infrastructureScope.map((scope, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1D64AE] shrink-0 mt-0.5" />
                      <span>{scope}</span>
                    </div>
                  ))}
                </div>

                {/* Technical Approach */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
                  <span className="font-semibold text-[#0E2A48] block mb-1">
                    Technical Approach:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {project.technicalApproach}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Bengaluru Field Deployment
                </span>
                <button
                  onClick={() => onOpenEnquiry(project.clientType)}
                  className="text-xs font-semibold text-[#1D64AE] hover:text-[#0E2A48] flex items-center gap-1 transition-colors"
                >
                  <span>Request similar design</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Prototype Transparency Notice */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-3">
          <Layers className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Note on Case Study Prototypes:</strong> Client project identities, site schematics, and full optical topologies are shared during formal technical feasibility discussions under non-disclosure.
          </span>
        </div>

      </div>
    </section>
  );
};
