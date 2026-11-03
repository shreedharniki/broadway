import React from 'react';
import { Award, Compass, LifeBuoy, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Column Layout: Brand Heritage & Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heritage & Origin Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1D64AE] font-heading block mb-2">
                Company Heritage
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E2A48] tracking-tight leading-tight font-heading">
                Bengaluru roots. Connected since 2000.
              </h2>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">
              Established at the turn of the millennium, <strong>Broadway Communication Pvt. Ltd.</strong> began
              with a clear observation: as Bengaluru emerged as India’s Silicon Valley, buildings and
              communities were being choked by unmanaged, hazardous copper wiring from dozens of competing vendors.
            </p>

            <p className="text-base text-slate-700 leading-relaxed">
              Broadway pioneered the <em>Unified Optical Backbone</em> model in Bengaluru. We build a single,
              neatly engineered fiber ring throughout a property—and over that single physical highway, we deliver
              gigabit resident broadband, corporate leased lines, video intercoms, CCTV surveillance, access
              automation, and high-definition TV.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <span className="text-2xl font-black text-[#0E2A48] font-mono block">2000</span>
                <span className="text-xs text-slate-600 font-medium">Established in Bengaluru</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                <span className="text-2xl font-black text-[#1D64AE] font-mono block">6 in 1</span>
                <span className="text-xs text-slate-600 font-medium">Unified Infrastructure Stack</span>
              </div>
            </div>
          </div>

          {/* Right Column: Support Framework (Section Anchor #support) */}
          <div id="support" className="lg:col-span-6 bg-[#F8FAFC] rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E3F0FA] text-[#1D64AE] flex items-center justify-center">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0E2A48] font-heading">
                  Support & Engineering Operations
                </h3>
                <span className="text-xs text-slate-500">
                  Bengaluru-based Network Operations Center (NOC)
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Clock className="w-4 h-4 text-[#1D64AE]" />
                  <span>24/7 Optical Path Supervision</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  Continuous automated ping tests and optical power monitoring from our Bengaluru core.
                  Cuts or link degradation are flagged before users report an interruption.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Compass className="w-4 h-4 text-[#1D64AE]" />
                  <span>Mobile Fusion Splicing Units</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  Dedicated field vans equipped with precision Fujikura fusion splicers, OTDR meters,
                  and replacement hardware dispatched directly across Bengaluru sectors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#1D64AE]" />
                  <span>Single-Point Helpdesk Ticketing</span>
                </div>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  No bouncing between telecom providers and intercom vendors. Whether your issue is
                  broadband speed or a gatekeeper video phone, one ticket resolves it.
                </p>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Direct field teams stationed in Whitefield, Electronic City, and North Bengaluru.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
