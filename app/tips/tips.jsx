"use client"
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { FiTrash2, FiUser } from "react-icons/fi";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '@/config/firebase';

const MedicalResources = ({ session }) => {
    const [initialTips, setInitialTips] = useState([])

    const handleFetch = async () => {
        const ideas = []
        try {
            const querySnapshot = await getDocs(collection(db, "health-tips"));
            querySnapshot.forEach((doc) => {
                const data = {
                    postId: doc.id,
                    ...doc.data()
                }
                ideas.push(data)
            });
            setInitialTips(ideas)
        } catch (error) {
            console.error("An error occurred", error)
            alert("Database synchronization failed.")
        }
    }

    useEffect(() => {
        handleFetch()
    }, [])

    const handleDelete = async (id) => {
        try {
            if (confirm("Revoke this clinical record from the network?")) {
                await deleteDoc(doc(db, "health-tips", id));
                setInitialTips(prev => prev.filter(tip => tip.postId !== id));
            }
        } catch (error) {
            console.error("An error occurred", error)
            alert("Revocation failed.")
        }
    };

    return (
        <main className="min-h-dvh bg-[#050505] text-slate-100 pb-20 relative">
            {/* Header Area */}
            <section className="border-b border-white/5 py-24 px-6 mb-16 relative overflow-hidden bg-[#0A0A0A]/50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 font-[family-name:var(--font-playfair)]">
                        Clinical <span className="text-amber-400">Journal</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                        Explore the centralized repository of verified medical records and health intelligence submitted by our elite network.
                    </p>
                </div>
            </section>

            {/* Grid Container */}
            <div className="max-w-7xl mx-auto px-6 z-10 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initialTips.map((tip) => (
                        <article
                            key={tip.postId}
                            className="glass-panel bg-[#0A0A0A]/60 rounded-[2rem] border border-white/5 hover:border-amber-500/30 hover:bg-[#0A0A0A]/90 transition-all duration-500 flex flex-col group shadow-lg"
                        >
                            <div className="p-8 flex flex-col h-full relative">

                                {/* Delete Button - Top Right */}
                                {session?.user?.id === tip.refId && (
                                    <button
                                        onClick={() => handleDelete(tip.postId)}
                                        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Revoke Record"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                )}

                                {/* Category & Date */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md text-[#050505] bg-emerald-500 border border-emerald-400">
                                        {tip.cat}
                                    </span>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{tip.timestamp}</span>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-4 leading-snug text-slate-100 group-hover:text-amber-400 transition-colors">
                                    {tip.tip}
                                </h2>

                                {/* Content Snippet */}
                                <div className="mb-8">
                                    <p className="text-slate-400 line-clamp-4 leading-relaxed font-light">
                                        {tip.desc}
                                    </p>
                                    {tip.desc && (tip.desc.split('\n').length > 4 || tip.desc.length > 250) && (
                                        <Link
                                            href={`/tips/${tip.postId}`}
                                            className="text-xs font-bold uppercase tracking-widest mt-4 inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                                        >
                                            Access Full Record <span className="text-lg">→</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Author Info */}
                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {tip.authorImg ? (
                                            <img
                                                src={tip.authorImg}
                                                alt={tip.author}
                                                className="w-10 h-10 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-amber-500/20"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20"><FiUser className="text-emerald-500" /></div>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-xs font-bold text-slate-300">{tip.author}</p>
                                            <p className="text-[9px] text-emerald-500 uppercase tracking-widest">Verified</p>
                                        </div>
                                    </div>
                                    {tip.references && (
                                        <span className="text-[10px] text-slate-500 italic">Ref: {tip.references.split(' ')[0]}...</span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default MedicalResources;