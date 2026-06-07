import { auth, signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from 'react';

const SignInPage = async () => {
  const session = await auth()

  if (session) {
    redirect("/tips")
  }
  
  return (
    <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-amber-500/20">

        {/* Header / Branding */}
        <div className="pt-12 pb-8 px-8 text-center border-b border-white/5 bg-[#0A0A0A]/50">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
             <span className="text-amber-400 font-black text-3xl font-[family-name:var(--font-playfair)]">M</span>
          </div>
          <h1 className="text-3xl font-black mb-2 text-slate-100 font-[family-name:var(--font-playfair)]">
            Clinical <span className="text-amber-400">Portal</span>
          </h1>
          <p className="text-slate-400 font-light text-sm">
            Authenticate to access the Med-Share intelligence network.
          </p>
        </div>

        <div className="p-8 pt-10">
          {/* Social Sign In */}
          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <button type="submit" className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/5 py-4 rounded-full hover:bg-white/10 hover:border-amber-500/30 transition-all mb-8 text-slate-200 font-bold shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Authenticate via Google
            </button>
          </form>

          <div className="relative mb-8 text-center">
            <hr className="border-white/10" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] px-4 text-xs text-slate-500 uppercase tracking-widest font-bold">
              Secure Login
            </span>
          </div>

          {/* Sign In Form */}
          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold mb-2 text-emerald-500 uppercase tracking-wider">Clinical ID (Email)</label>
              <input
                type="email"
                placeholder="physician@hospital.org"
                className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/10 bg-[#050505] text-slate-100 placeholder-slate-600 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2 items-end">
                <label className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Passcode</label>
                <Link href="/" className="text-xs font-bold text-amber-400 hover:text-amber-300">
                  Reset Access?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/10 bg-[#050505] text-slate-100 placeholder-slate-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg mt-4 transition-transform active:scale-95 shadow-[0_0_20px_rgba(5,150,105,0.4)]"
            >
              Enter Portal
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            Not registered?{' '}
            <Link href="/" className="font-bold text-amber-400 hover:text-amber-300">
              Request Clinical Access
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;