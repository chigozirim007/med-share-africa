import Link from "next/link";
import { Theme } from "@/components/Theme";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#050505] text-slate-100 font-[family-name:var(--font-inter)]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-screen"
          style={{ backgroundImage: `url('/premium-bg-emerald.png')` }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#050505]/30 via-[#050505]/70 to-[#050505]" />

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-24">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Exclusive Clinical Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight font-[family-name:var(--font-playfair)]">
            Elevating Healthcare Through <br />
            <span className="text-gradient-emerald">Elite Expertise.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            Med-Share Africa is the premier destination for verified medical insights. Connect with top-tier healthcare professionals in a secure, high-end environment dedicated to uncompromising wellness.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg shadow-[0_0_30px_rgba(5,150,105,0.4)] transition-all duration-300 hover:scale-105"
            >
              Request Access
            </Link>
            <Link 
              href="/tips" 
              className="w-full sm:w-auto px-10 py-4 rounded-full glass-panel text-amber-400 font-bold text-lg hover:border-amber-500/50 transition-all duration-300 hover:bg-white/5"
            >
              Explore Journal
            </Link>
          </div>
        </div>
      </section>

      {/* --- PREMIUM FEATURES SECTION --- */}
      <section className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-white">The Standard of Care</h2>
            <p className="text-amber-400/80 text-lg uppercase tracking-widest font-semibold">Pristine. Secure. Authoritative.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Rigorous Verification", 
                desc: "Every article is stringently vetted by our board of leading physicians and clinical researchers to ensure absolute medical accuracy.",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              { 
                title: "Confidentiality First", 
                desc: "Share your health journey within fully encrypted, anonymized clinical forums designed to protect your privacy at all times.",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"
              },
              { 
                title: "Global Reach", 
                desc: "Optimized for seamless performance, our platform ensures high-end medical intelligence reaches every corner of the continent without compromise.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              }
            ].map((feature, i) => (
              <div key={i} className="glass-panel glass-panel-hover p-10 rounded-3xl transition-all duration-500 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/40 transition-all duration-500">
                  <svg className="w-7 h-7 text-emerald-400 group-hover:text-amber-400 transition-colors duration-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-100">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INTELLIGENCE PREVIEW --- */}
      <section className="py-24 bg-[#080c10] border-y border-white/5 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Exclusive Directory
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-playfair)] text-slate-100 leading-tight">
              Consult with Elite <br />
              <span className="text-gradient-gold">Medical Specialists.</span>
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-light">
              Gain unparalleled access to a continent-wide network of distinguished healthcare providers. Whether seeking a second opinion or specialized care, our directory connects you with the absolute best in medicine.
            </p>
            <ul className="space-y-4">
              {['Private, encrypted consultations', 'Strict physician credentialing', 'Concierge-level specialist booking'].map((list, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {list}
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link href="/profile" className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-amber-400 transition-colors">
                View the Directory 
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="relative aspect-square md:aspect-[4/3] rounded-[2rem] glass-panel overflow-hidden p-2 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-amber-600/10" />
              <div className="relative h-full w-full rounded-[1.5rem] bg-[#050505]/90 border border-white/5 p-6 flex flex-col gap-4">
                 {[1, 2, 3].map((item, idx) => (
                   <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5" style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="w-12 h-12 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700/50 rounded w-1/3" />
                        <div className="h-3 bg-slate-800/50 rounded w-1/2" />
                      </div>
                      <div className="w-20 h-8 rounded-full bg-amber-500/10 border border-amber-500/30" />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD STATS SECTION --- */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Elite Specialists", value: "2.4k+" },
              { label: "Clinical Journals", value: "15k+" },
              { label: "Positive Outcomes", value: "50k+" },
              { label: "Countries Served", value: "24" }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-8 rounded-3xl text-center border-t-2 border-t-amber-500/40">
                <div className="text-4xl md:text-5xl font-black mb-2 text-gradient-emerald">{stat.value}</div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-emerald-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 font-[family-name:var(--font-playfair)]">Advance Your Practice.</h2>
          <p className="text-xl text-slate-400 mb-10 font-light">Join the vanguard of African healthcare. Subscribe to receive high-value clinical insights and exclusive networking opportunities securely to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your professional email" 
              className="flex-1 bg-white/5 border border-amber-500/20 rounded-full px-6 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-colors" 
            />
            <button className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-[#050505] font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}