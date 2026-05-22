"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/config/firebase';
import { Theme } from "@/components/Theme";
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
                    setTip({
                        postId: docSnap.id,
                        ...docSnap.data()
                    });
                } else {
                    setTip(null);
                }
            } catch (err) {
                console.error("Error fetching tip details:", err);
                setError(`Failed to load health tip details. Error: ${err.message || err.toString()}`);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-dvh bg-slate-50 flex items-center justify-center p-6 text-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="text-4xl animate-spin" style={{ color: Theme.primaryGreen }} />
                    <p className="text-slate-500 font-medium animate-pulse">Loading tip details...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-dvh bg-slate-50 flex items-center justify-center p-6 text-slate-900">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center">
                    <FiAlertTriangle className="mx-auto text-4xl text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Error Loading Tip</h1>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <Link href="/tips" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all active:scale-95" style={{ backgroundColor: Theme.primaryGreen }}>
                        <FiArrowLeft /> Back to Health Tips
                    </Link>
                </div>
            </main>
        );
    }

    if (!tip) {
        return (
            <main className="min-h-dvh bg-slate-50 flex items-center justify-center p-6 text-slate-900">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-md border border-slate-200 text-center">
                    <FiBookOpen className="mx-auto text-4xl text-slate-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Tip Not Found</h1>
                    <p className="text-slate-500 mb-6">The health resource you are looking for does not exist or has been deleted.</p>
                    <Link href="/tips" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all active:scale-95" style={{ backgroundColor: Theme.primaryGreen }}>
                        <FiArrowLeft /> Back to Health Tips
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-dvh bg-slate-50 text-slate-900 pb-20">
            {/* Header / Premium Visual Banner */}
            <section className="bg-white border-b border-slate-200/80 pt-10 pb-12 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Back Navigation Button */}
                    <Link 
                        href="/tips" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-medium transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Health Tips</span>
                    </Link>

                    {/* Category Tag */}
                    <div className="flex items-center gap-3 mb-6">
                        <span 
                            className="text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full text-white"
                            style={{ backgroundColor: Theme.primaryGreen }}
                        >
                            {tip.cat}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                            <FiCalendar className="text-xs" /> {tip.timestamp}
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight text-slate-900">
                        {tip.tip}
                    </h1>

                    {/* Author Premium Info Card */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-4">
                            {tip.authorImg ? (
                                <img 
                                    src={tip.authorImg} 
                                    alt={tip.author} 
                                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <FiUser className="w-6 h-6 text-slate-400" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-bold text-slate-800">{tip.author}</p>
                                <p className="text-xs text-slate-400 font-medium">Community Contributor</p>
                            </div>
                        </div>
                        <div className="text-right max-md:hidden">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Verification Status</p>
                            <p className="text-xs font-black text-emerald-600 flex items-center gap-1 mt-1 justify-end">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Verified Health Information
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Body */}
            <section className="py-12 px-6">
                <div className="max-w-3xl mx-auto flex flex-col gap-10">
                    
                    {/* Main Text Content */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80">
                        <p className="text-slate-700 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                            {tip.desc}
                        </p>
                    </div>

                    {/* References & Disclaimers block */}
                    {tip.references && (
                        <div className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200">
                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                                <FiBookOpen className="text-sm" /> References & External Sources
                            </h3>
                            <p className="text-sm text-slate-600 italic break-words">
                                {tip.references}
                            </p>
                        </div>
                    )}

                    {/* Professional Health Notice Disclaimer */}
                    <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-200/80 flex gap-4 items-start">
                        <FiAlertTriangle className="text-amber-600 text-xl shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-900 mb-1">Medical Disclaimer</h4>
                            <p className="text-xs text-amber-800/85 leading-relaxed font-medium">
                                The information provided above is shared by members of the community for educational and literacy enhancement purposes only. It does not substitute professional medical advice, diagnosis, or treatment. Always consult with a qualified physician or healthcare provider regarding any health condition or concerns.
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}

