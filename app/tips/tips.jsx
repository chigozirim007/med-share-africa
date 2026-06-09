"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import { FiTrash2, FiUser, FiLoader, FiSearch, FiX, FiHeart, FiBookmark, FiFilter } from "react-icons/fi";
import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '@/config/firebase';
import ConfirmModal from "@/components/ConfirmModal";

const CATEGORIES = ["All", "Cardiology", "Neurology", "Dermatology", "Otolaryngology", "Radiography", "Dentistry", "Haematology", "General", "Oncology", "Pediatrics", "Psychiatry", "Surgery", "Other"];

const MedicalResources = ({ session }) => {
    const [allTips, setAllTips] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search & filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [filteredTips, setFilteredTips] = useState([]);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const handleFetch = async () => {
        const ideas = [];
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "health-tips"));
            querySnapshot.forEach((d) => ideas.push({ postId: d.id, ...d.data() }));
            setAllTips(ideas);
        } catch (error) {
            console.error("An error occurred", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { handleFetch(); }, []);

    // Filter logic
    useEffect(() => {
        let results = [...allTips];
        if (activeCategory !== "All") {
            results = results.filter(t => t.cat?.toLowerCase() === activeCategory.toLowerCase());
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(t =>
                t.tip?.toLowerCase().includes(q) ||
                t.desc?.toLowerCase().includes(q) ||
                t.author?.toLowerCase().includes(q) ||
                t.cat?.toLowerCase().includes(q)
            );
        }
        setFilteredTips(results);
    }, [allTips, activeCategory, searchQuery]);

    const requestDelete = (id) => { setPendingDeleteId(id); setModalOpen(true); };

    const handleDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteDoc(doc(db, "health-tips", pendingDeleteId));
            setAllTips(prev => prev.filter(tip => tip.postId !== pendingDeleteId));
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setModalOpen(false);
            setPendingDeleteId(null);
        }
    };

    const handleLike = async (tip) => {
        if (!session?.user?.id) return;
        const userId = session.user.id;
        const tipRef = doc(db, "health-tips", tip.postId);
        const likes = tip.likes || [];
        const alreadyLiked = likes.includes(userId);
        try {
            await updateDoc(tipRef, {
                likes: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
            });
            setAllTips(prev => prev.map(t =>
                t.postId === tip.postId
                    ? { ...t, likes: alreadyLiked ? likes.filter(id => id !== userId) : [...likes, userId] }
                    : t
            ));
        } catch (err) { console.error("Like error:", err); }
    };

    const handleBookmark = async (tip) => {
        if (!session?.user?.id) return;
        const userId = session.user.id;
        const tipRef = doc(db, "health-tips", tip.postId);
        const bookmarks = tip.bookmarks || [];
        const alreadyBookmarked = bookmarks.includes(userId);
        try {
            await updateDoc(tipRef, {
                bookmarks: alreadyBookmarked ? arrayRemove(userId) : arrayUnion(userId),
            });
            setAllTips(prev => prev.map(t =>
                t.postId === tip.postId
                    ? { ...t, bookmarks: alreadyBookmarked ? bookmarks.filter(id => id !== userId) : [...bookmarks, userId] }
                    : t
            ));
        } catch (err) { console.error("Bookmark error:", err); }
    };

    return (
        <main className="min-h-dvh bg-[#050505] text-slate-100 pb-24 relative">
            <ConfirmModal
                isOpen={modalOpen}
                onConfirm={handleDelete}
                onCancel={() => { setModalOpen(false); setPendingDeleteId(null); }}
                title="Revoke Clinical Record"
                message="You are about to permanently remove this record from the Med-Share Africa network. All associated data will be irretrievably purged."
                confirmLabel="Revoke Record"
            />

            {/* Hero Header */}
            <section className="border-b border-white/5 pt-32 pb-16 px-6 relative overflow-hidden bg-[#0A0A0A]/40">
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(5,150,105,0.12) 0%, transparent 70%)" }} />
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Network · {allTips.length} Records Published
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-5 font-[family-name:var(--font-playfair)]">
                        Clinical <span className="text-amber-400">Journal</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto font-light mb-10">
                        Verified medical intelligence from Africa's elite healthcare network.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search records, specialties, authors..."
                            className="w-full pl-13 pr-12 py-4 rounded-full border border-white/10 bg-[#0A0A0A] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/5 transition-all font-medium shadow-lg text-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors">
                                <FiX size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Category Filter Tabs */}
            <div className="sticky top-[73px] z-30 border-b border-white/5 bg-[#050505]/95 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 py-3">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        <FiFilter className="text-slate-500 text-sm shrink-0 mr-1" />
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                                    activeCategory === cat
                                        ? "bg-emerald-500 text-[#050505] shadow-[0_0_10px_rgba(5,150,105,0.4)]"
                                        : "border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-6xl mx-auto px-6 py-14">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <FiLoader className="text-4xl animate-spin text-emerald-500" />
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold animate-pulse">Loading network data...</p>
                    </div>
                ) : filteredTips.length === 0 ? (
                    <div className="text-center py-24">
                        <FiSearch className="mx-auto text-5xl text-slate-700 mb-4" />
                        <h3 className="text-xl font-black text-slate-400 mb-2">No records found</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            {searchQuery ? `No results for "${searchQuery}"` : `No records in "${activeCategory}" yet.`}
                        </p>
                        <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors underline underline-offset-4">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Result count */}
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">
                            {filteredTips.length} {filteredTips.length === 1 ? "record" : "records"}
                            {activeCategory !== "All" && <span className="text-emerald-500"> · {activeCategory}</span>}
                            {searchQuery && <span className="text-amber-400"> · "{searchQuery}"</span>}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTips.map((tip) => {
                                const isLiked = (tip.likes || []).includes(session?.user?.id);
                                const isBookmarked = (tip.bookmarks || []).includes(session?.user?.id);
                                const isOwner = session?.user?.id === tip.refId;
                                return (
                                    <article
                                        key={tip.postId}
                                        className="glass-panel bg-[#0A0A0A]/60 rounded-[2rem] border border-white/5 hover:border-amber-500/25 hover:bg-[#0A0A0A]/90 transition-all duration-500 flex flex-col group"
                                    >
                                        <div className="p-7 flex flex-col h-full">
                                            {/* Category, date, owner delete */}
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md text-[#050505] bg-emerald-500 whitespace-nowrap">
                                                        {tip.cat}
                                                    </span>
                                                    <span className="text-xs text-slate-600 font-medium truncate">{tip.timestamp}</span>
                                                </div>
                                                {isOwner && (
                                                    <button
                                                        onClick={() => requestDelete(tip.postId)}
                                                        className="ml-2 p-1.5 shrink-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Revoke Record"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <Link href={`/tips/${tip.postId}`}>
                                                <h2 className="text-xl font-bold mb-3 leading-snug text-slate-100 group-hover:text-amber-400 transition-colors cursor-pointer">
                                                    {tip.tip}
                                                </h2>
                                            </Link>

                                            {/* Snippet */}
                                            <p className="text-slate-400 line-clamp-3 leading-relaxed font-light text-sm flex-1 mb-6">
                                                {tip.desc}
                                            </p>

                                            {/* Footer: author + actions */}
                                            <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                                                <Link href={`/u/${tip.refId}`} className="flex items-center gap-2.5 group/author">
                                                    {tip.authorImg ? (
                                                        <img src={tip.authorImg} alt={tip.author} className="w-8 h-8 rounded-full object-cover border border-amber-500/20 grayscale group-hover/author:grayscale-0 transition-all" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 group-hover/author:border-amber-500/50 transition-all">
                                                            <FiUser className="text-emerald-500 text-xs group-hover/author:text-amber-400 transition-colors" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-300 leading-tight group-hover/author:text-amber-400 transition-colors">{tip.author}</p>
                                                        <p className="text-[9px] text-emerald-500 uppercase tracking-widest font-bold">Verified</p>
                                                    </div>
                                                </Link>

                                                {/* Like + Bookmark */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleLike(tip)}
                                                        title={session ? (isLiked ? "Unlike" : "Like") : "Sign in to like"}
                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all text-xs font-bold ${
                                                            isLiked
                                                                ? "text-rose-400 bg-rose-500/10"
                                                                : "text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                                                        }`}
                                                    >
                                                        <FiHeart size={13} className={isLiked ? "fill-rose-400" : ""} />
                                                        {(tip.likes || []).length > 0 && <span>{(tip.likes || []).length}</span>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleBookmark(tip)}
                                                        title={session ? (isBookmarked ? "Remove bookmark" : "Bookmark") : "Sign in to bookmark"}
                                                        className={`p-1.5 rounded-lg transition-all ${
                                                            isBookmarked
                                                                ? "text-amber-400 bg-amber-500/10"
                                                                : "text-slate-500 hover:text-amber-400 hover:bg-amber-500/10"
                                                        }`}
                                                    >
                                                        <FiBookmark size={13} className={isBookmarked ? "fill-amber-400" : ""} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default MedicalResources;