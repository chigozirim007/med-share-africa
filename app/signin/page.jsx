import { auth, signIn } from "@/auth";
import { Theme } from "@/components/Theme";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from 'react';

const SignInPage = async () => {
  const session = await auth()
  // console.log(session);

  // redirect
  if (session) {
    redirect("/tips")
  }
  
  return (
    <main className="min-h-dvh bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

        {/* Header / Branding */}
        <div className="pt-10 pb-6 px-8 text-center">
          <h1 className="text-3xl font-black mb-2">
            Welcome <span style={{ color: Theme.primaryGreen }}>Back</span>
          </h1>
          <p className="text-slate-500 font-light">
            Sign in to continue to Med-Share Africa
          </p>
        </div>

        <div className="p-8 pt-0">
          {/* Social Sign In */}

          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <button type="submit" className="w-full flex items-center justify-center gap-3 border border-slate-300 py-3 rounded-full hover:bg-slate-50 transition-colors mb-6 text-slate-700 font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="relative mb-8 text-center">
            <hr className="border-slate-200" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-slate-400 uppercase tracking-widest">
              or use email
            </span>
          </div>

          {/* Sign In Form */}
          <form className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-slate-50"
                style={{ '--tw-ring-color': Theme.primaryGreen }}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link href="/" className="text-sm font-medium hover:underline" style={{ color: Theme.primaryGreen }}>
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 bg-slate-50"
                style={{ '--tw-ring-color': Theme.primaryGreen }}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-full text-white font-bold text-lg mt-2 transition-transform active:scale-95 shadow-lg"
              style={{ backgroundColor: Theme.primaryGreen }}
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/" className="font-bold hover:underline" style={{ color: Theme.primaryGreen }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;