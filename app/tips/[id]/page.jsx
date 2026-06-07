"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/config/firebase';
import Link from "next/link";
import { FiArrowLeft, FiUser, FiCalendar, FiBookOpen, FiAlertTriangle, FiLoader } from "react-icons/fi";

export default function TipDetailsPage() {
    const params = useParams();
    const id = params?.id;

    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchTip = async () => {
            try {
                setLoading(true);
                setError(null);
                const docRef = doc(db, "health-tips", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTip({ postId: docSnap.id, ...docSnap.data() });
                } else {
                    setTip(null);
                }
            } catch (err) {
                console.error("Error fetching tip details:", err);
                setError(`Retrieval failed: ${err.message || err.toString()}`);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="text-4xl animate-spin text-emerald-500" />
                    <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Retrieving clinical record...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6">
                <div className="max-w-md w-full glass-panel rounded-[2rem] p-8 border border-red-500/20 text-center">
                    <FiAlertTriangle className="mx-auto text-4xl text-red-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-slate-100">Retrieval Error</h1>
                    <p className="text-slate-400 mb-6 text-sm">{error}</p>
                    <Link href="/tips" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
                        <FiArrowLeft /> Return to Journal
                    </Link>
                </div>
            </main>
        );
    }

    if (!tip) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6">
                <div className="max-w-md w-full glass-panel rounded-[2rem] p-8 border border-white/10 text-center">
                    <FiBookOpen className="mx-auto text-4xl text-slate-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-slate-100">Record Not Found</h1>
                    <p className="text-slate-400 mb-6 text-sm">This clinical record does not exist or has been revoked from the network.</p>
                    <Link href="/tips" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
                        <FiArrowLeft /> Return to Journal
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-dvh bg-[#050505] text-slate-100 pb-20 relative">
            {/* Ambient glow */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Header / Article Banner */}
            <section className="bg-[#0A0A0A]/80 border-b border-white/5 pt-28 pb-14 px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    {/* Back Navigation */}
                    <Link
                        href="/tips"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-10 font-bold text-sm uppercase tracking-widest transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Clinical Journal
                    </Link>

                    {/* Category Tag & Date */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md text-[#050505] bg-emerald-500">
                            {tip.cat}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <FiCalendar className="text-xs" /> {tip.timestamp}
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl md:text-5xl font-black mb-10 leading-tight font-[family-name:var(--font-playfair)] text-slate-100">
                        {tip.tip}
                    </h1>

                    {/* Author Info */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex items-center gap-4">
                            {tip.authorImg ? (
                                <img
                                    src={tip.authorImg}
                                    alt={tip.author}
                                    className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/30">
                                    <FiUser className="w-6 h-6 text-emerald-500" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-bold text-slate-200">{tip.author}</p>
                                <p className="text-xs text-emerald-500 uppercase tracking-widest font-bold">Verified Specialist</p>
                            </div>
                        </div>
                        <div className="text-right max-md:hidden">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Status</p>
                            <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5 mt-1 justify-end">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Verified & Authenticated
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <section className="py-14 px-6 relative z-10">
                <div className="max-w-3xl mx-auto flex flex-col gap-8">

                    {/* Main Text Content */}
                    <div className="glass-panel bg-[#0A0A0A]/60 rounded-[2rem] p-8 md:p-12 border border-white/5">
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                            {tip.desc}
                        </p>
                    </div>

                    {/* References */}
                    {tip.references && (
                        <div className="glass-panel bg-[#0A0A0A]/40 rounded-2xl p-6 border border-amber-500/10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-amber-500/70 mb-3 flex items-center gap-1.5">
                                <FiBookOpen className="text-sm" /> References & External Sources
                            </h3>
                            <p className="text-sm text-slate-400 italic break-words">{tip.references}</p>
                        </div>
                    )}

                    {/* Medical Disclaimer */}
                    <div className="glass-panel bg-amber-500/5 rounded-2xl p-6 border border-amber-500/20 flex gap-4 items-start">
                        <FiAlertTriangle className="text-amber-500 text-xl shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-400 mb-1 uppercase tracking-wider">Medical Disclaimer</h4>
                            <p className="text-xs text-amber-300/70 leading-relaxed font-medium">
                                The information provided here is shared for educational and literacy enhancement purposes only. It does not substitute professional medical advice, diagnosis, or treatment. Always consult with a qualified physician or healthcare provider regarding any health condition.
                            </p>
                        </div>
                    </div>

                    {/* Back CTA */}
                    <div className="pt-4 text-center">
                        <Link href="/tips" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 font-bold text-sm uppercase tracking-widest transition-all">
                            <FiArrowLeft /> Back to Clinical Journal
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
