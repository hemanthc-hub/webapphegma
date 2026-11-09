import React from "react";
import { BadgeCheck, TrendingUp, RefreshCw, Star } from "lucide-react";

interface StatItem {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}

interface TrustSectionProps {
  className?: string;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ className = "" }) => {
  const stats: StatItem[] = [
    {
      icon: BadgeCheck,
      label: "Verified Installations & Setups",
      value: "1,250+",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Monthly Clinical Orders",
      value: "15,000+",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: RefreshCw,
      label: "Repeat Healthcare Buyers",
      value: "8,500+",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Star,
      label: "Doctor Satisfaction Rate",
      value: "99.4%",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className={`w-full max-w-[95%] mx-auto mb-12 mt-4 ${className}`}>
      {/* <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl border border-blue-600/30">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <h2
            className="text-white font-extrabold text-2xl md:text-3xl m-0 tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Trusted by India's Healthcare Professionals
          </h2>
          <p className="text-blue-200 text-sm md:text-base mt-2 m-0 max-w-2xl mx-auto font-medium">
            Delivering precision dental instruments, clinical equipment, and sterilization essentials with verified speed & reliability.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {stats.map(({ icon: Icon, label, value, color, bg }, idx) => (
            <div
              key={idx}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-5 text-center shadow-lg hover:translate-y-[-4px] transition-all duration-300 border border-white/20 flex flex-col items-center justify-center"
            >
              <div
                className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner`}
              >
                <Icon size={24} className={color} />
              </div>
              <div
                className={`text-2xl md:text-3xl font-black ${color} tracking-tight m-0`}
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {value}
              </div>
              <div className="text-xs md:text-sm font-bold text-slate-600 mt-1 leading-tight m-0">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default TrustSection;
