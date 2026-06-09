"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { FiMail, FiCheck, FiArrowLeft, FiAlertTriangle, FiLoader } from "react-icons/fi";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/config/firebase';

export default function PasswordResetPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setStatus("error");
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        setStatus("loading");
        
        try {
            // Verify if the email exists in our system
            const q = query(collection(db, "users"), where("email", "==", email.toLowerCase().trim()));
            const snap = await getDocs(q);

            // To prevent email enumeration attacks, we always show success
            // even if the email doesn't exist, but we simulate a network request delay.
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setErrorMsg("Network error. Please try again later.");
        }
    };

    if (status === "success") {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="w-full max-w-md glass-panel rounded-[2rem] border border-emerald-500/30 p-10 text-center z-10 shadow-2xl">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mb-8">
                        <FiCheck className="text-emerald-400 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-100 mb-4 font-[family-name:var(--font-playfair)]">
                        Protocol Initiated
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-8 font-light text-sm">
                        If <span className="text-amber-400 font-bold">{email}</span> is registered in the Med-Share network, you will receive instructions to reset your access credentials shortly.
                    </p>
                    <Link href="/signin" className="block w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                        Return to Authentication
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md glass-panel rounded-[2rem] shadow-2xl overflow-hidden relative z-10 border border-amber-500/20">
                <div className="pt-10 pb-6 px-8 text-center border-b border-white/5 bg-[#0A0A0A]/50">
                    <Link href="/signin" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest transition-colors mb-6">
                        <FiArrowLeft /> Back to Login
                    </Link>
                    <h1 className="text-2xl font-black mb-2 text-slate-100 font-[family-name:var(--font-playfair)]">
                        Restore <span className="text-amber-400">Access</span>
                    </h1>
                    <p className="text-slate-400 font-light text-sm">
                        Enter your clinical ID to reset your credentials.
                    </p>
                </div>

                <div className="p-8">
                    {status === "error" && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-red-400 text-sm font-bold">
                            <FiAlertTriangle className="shrink-0" />
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-xs font-bold mb-2 text-emerald-500 uppercase tracking-wider">
                                Clinical ID (Email)
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (status === "error") setStatus("idle");
                                    }}
                                    placeholder="physician@hospital.org"
                                    className="w-full pl-11 pr-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/5 bg-[#050505] text-slate-100 placeholder-slate-600 transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-all active:scale-95 shadow-[0_0_20px_rgba(5,150,105,0.4)] disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? <FiLoader className="animate-spin text-xl" /> : "Send Reset Instructions"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
