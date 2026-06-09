"use client";
import React, { useState, useEffect } from 'react';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { db } from '@/config/firebase';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { FiLoader, FiLogOut, FiCheck, FiUser, FiEdit3, FiTrash2, FiUpload, FiBookOpen, FiAward, FiShield, FiHeart, FiBookmark, FiMessageSquare } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

export default function ProfileClient({ session: initialSession }) {
    const { update } = useSession();
    const [name, setName] = useState(initialSession?.user?.name || "");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [userTips, setUserTips] = useState([]);
    const [savedTips, setSavedTips] = useState([]);
    const [loadingTips, setLoadingTips] = useState(true);
    const [activeTab, setActiveTab] = useState("published"); // "published" | "saved"

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const fetchUserTips = async () => {
        if (!initialSession?.user?.id) return;
        try {
            setLoadingTips(true);
            const userId = initialSession.user.id;

            // Fetch published tips
            const q = query(collection(db, "health-tips"), where("refId", "==", userId));
            const snap = await getDocs(q);
            const published = [];
            snap.forEach(d => published.push({ postId: d.id, ...d.data() }));
            setUserTips(published);

            // Fetch bookmarked/saved tips
            const allSnap = await getDocs(collection(db, "health-tips"));
            const saved = [];
            allSnap.forEach(d => {
                const data = d.data();
                if ((data.bookmarks || []).includes(userId)) {
                    saved.push({ postId: d.id, ...data });
                }
            });
            setSavedTips(saved);
        } catch (err) {
            console.error("Error fetching user health tips:", err);
        } finally {
            setLoadingTips(false);
        }
    };

    useEffect(() => { fetchUserTips(); }, [initialSession]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError("Name cannot be empty."); return; }
        setSaving(true); setError(""); setSuccess(false);
        try {
            if (initialSession?.user?.id) {
                await updateDoc(doc(db, "users", initialSession.user.id), { name: name.trim() });
            }
            if (update) await update({ name: name.trim() });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3500);
        } catch (err) {
            setError("Update failed. Please retry.");
        } finally {
            setSaving(false);
        }
    };

    const requestDelete = (id) => { setPendingDeleteId(id); setModalOpen(true); };

    const handleDeleteTip = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteDoc(doc(db, "health-tips", pendingDeleteId));
            setUserTips(prev => prev.filter(tip => tip.postId !== pendingDeleteId));
        } catch (err) {
            console.error("Error deleting tip:", err);
        } finally {
            setModalOpen(false);
            setPendingDeleteId(null);
        }
    };

    const stats = [
        { label: "Published", value: userTips.length, icon: FiBookOpen },
        { label: "Saved", value: savedTips.length, icon: FiBookmark },
        { label: "Rank", value: userTips.length >= 10 ? "Senior" : userTips.length >= 5 ? "Fellow" : "Member", icon: FiAward },
    ];

    const displayTips = activeTab === "published" ? userTips : savedTips;

    return (
        <main className="min-h-dvh bg-[#050505] py-24 px-6 text-slate-100 relative">
            <ConfirmModal
                isOpen={modalOpen}
                onConfirm={handleDeleteTip}
                onCancel={() => { setModalOpen(false); setPendingDeleteId(null); }}
                title="Revoke Clinical Record"
                message="You are about to permanently remove this record from the Med-Share Africa network. All associated data will be irretrievably purged."
                confirmLabel="Revoke Record"
            />

            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-900/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto flex flex-col items-center gap-14 relative z-10">

                {/* ===================== PROFILE CARD ===================== */}
                <div className="w-full max-w-2xl">
                    {/* Banner */}
                    <div className="h-44 w-full rounded-t-[2.5rem] relative overflow-hidden bg-gradient-to-br from-emerald-900 via-[#0A3020] to-[#0A0A0A]">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.3) 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
                        <div className="absolute bottom-4 right-6 text-[10px] text-amber-500/50 font-bold uppercase tracking-[0.3em]">Med-Share Africa</div>
                    </div>

                    <div className="glass-panel bg-[#0A0A0A]/90 rounded-b-[2.5rem] border border-t-0 border-amber-500/15 px-8 pb-10 shadow-2xl">
                        <div className="flex items-end justify-between -mt-14 mb-6">
                            <div className="relative">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#0A0A0A] shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-[#050505] flex items-center justify-center">
                                    {initialSession?.user?.image ? (
                                        <img src={initialSession.user.image} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                        <FiUser className="w-12 h-12 text-emerald-500" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#0A0A0A] flex items-center justify-center">
                                    <FiCheck className="text-[#050505] text-xs font-black" />
                                </div>
                            </div>
                            <div className="flex gap-3 mb-2">
                                <Link href="/upload" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider hover:bg-amber-500/20 transition-all">
                                    <FiUpload size={12} /> Publish
                                </Link>
                                <Link href="/tips" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-all">
                                    <FiBookOpen size={12} /> Journal
                                </Link>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-100 font-[family-name:var(--font-playfair)] mb-1">{name || "Specialist"}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-slate-500 text-sm font-medium">{initialSession?.user?.email}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl bg-white/3 border border-white/5">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className="text-center cursor-pointer" onClick={() => { if (stat.label === "Saved") setActiveTab("saved"); else if (stat.label === "Published") setActiveTab("published"); }}>
                                        <Icon className="mx-auto mb-1.5 text-emerald-500" size={16} />
                                        <p className="text-xl font-black text-slate-100">{stat.value}</p>
                                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Edit name form */}
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2 flex items-center gap-1.5">
                                    <FiEdit3 size={11} /> Display Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your authorised display name"
                                    className="w-full px-5 py-4 rounded-2xl border border-white/10 focus:outline-none focus:border-amber-500 focus:bg-white/5 bg-[#050505] text-slate-100 placeholder-slate-600 font-bold transition-all"
                                />
                            </div>
                            {success && (
                                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-sm font-bold">
                                    <FiCheck size={16} className="shrink-0" /> Profile updated.
                                </div>
                            )}
                            {error && <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl text-xs font-bold">{error}</div>}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)] disabled:opacity-60">
                                    {saving ? <FiLoader className="text-xl animate-spin" /> : <><FiCheck size={14} /> Save Changes</>}
                                </button>
                                <button type="button" onClick={() => signOut()} className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-sm uppercase tracking-wider transition-all" title="Sign Out">
                                    <FiLogOut size={14} />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ===================== TABS + RECORDS ===================== */}
                <div className="w-full border-t border-white/10 pt-12">
                    {/* Tab Header */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div className="flex gap-1 p-1 rounded-full bg-white/5 border border-white/10">
                            {[
                                { key: "published", label: "Published", count: userTips.length, icon: FiBookOpen },
                                { key: "saved", label: "Saved", count: savedTips.length, icon: FiBookmark },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-all ${
                                        activeTab === tab.key
                                            ? "bg-emerald-500 text-[#050505] shadow-[0_0_10px_rgba(5,150,105,0.4)]"
                                            : "text-slate-400 hover:text-amber-400"
                                    }`}
                                >
                                    <tab.icon size={13} />
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-[#050505]/30 text-[#050505]" : "bg-white/10 text-slate-500"}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {activeTab === "published" && (
                            <Link href="/upload" className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-[#050505] font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform">
                                <FiUpload size={12} /> New Record
                            </Link>
                        )}
                    </div>

                    {loadingTips ? (
                        <div className="flex justify-center items-center py-16">
                            <FiLoader className="text-4xl animate-spin text-emerald-500" />
                        </div>
                    ) : displayTips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayTips.map((tip) => (
                                <article key={tip.postId} className="glass-panel bg-[#0A0A0A]/60 rounded-[2rem] border border-white/5 hover:border-amber-500/20 transition-all flex flex-col group">
                                    <div className="p-7 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md text-[#050505] bg-emerald-500 whitespace-nowrap">{tip.cat}</span>
                                                <span className="text-xs text-slate-600 font-medium truncate">{tip.timestamp}</span>
                                            </div>
                                            {activeTab === "published" && (
                                                <button onClick={() => requestDelete(tip.postId)} className="ml-2 p-1.5 shrink-0 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Revoke">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <Link href={`/tips/${tip.postId}`}>
                                            <h4 className="text-lg font-bold mb-2 leading-tight text-slate-200 group-hover:text-amber-400 transition-colors cursor-pointer">{tip.tip}</h4>
                                        </Link>
                                        <p className="text-slate-500 line-clamp-3 leading-relaxed font-light text-sm flex-1 mb-4">{tip.desc}</p>

                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                {tip.authorImg ? (
                                                    <img src={tip.authorImg} alt={tip.author} className="w-7 h-7 rounded-full object-cover border border-amber-500/30 grayscale group-hover:grayscale-0 transition-all" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-500/30">
                                                        <FiUser className="text-emerald-500 text-[10px]" />
                                                    </div>
                                                )}
                                                <p className="text-xs font-bold text-slate-400">{tip.author}</p>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-600">
                                                {(tip.likes || []).length > 0 && <span className="flex items-center gap-1"><FiHeart size={11} /> {(tip.likes || []).length}</span>}
                                                {(tip.bookmarks || []).length > 0 && <span className="flex items-center gap-1"><FiBookmark size={11} /> {(tip.bookmarks || []).length}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel bg-[#0A0A0A]/50 rounded-[2rem] p-16 border border-white/5 text-center max-w-lg mx-auto">
                            {activeTab === "published" ? (
                                <>
                                    <FiBookOpen className="mx-auto text-4xl text-slate-600 mb-5" />
                                    <h4 className="text-xl font-black text-slate-300 mb-3 font-[family-name:var(--font-playfair)]">No Records Yet</h4>
                                    <p className="text-slate-500 font-light mb-8 text-sm">Share your clinical expertise with the network.</p>
                                    <Link href="/upload" className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-amber-500 text-[#050505] font-black text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform">
                                        <FiUpload size={14} /> Publish First Record
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <FiBookmark className="mx-auto text-4xl text-slate-600 mb-5" />
                                    <h4 className="text-xl font-black text-slate-300 mb-3 font-[family-name:var(--font-playfair)]">No Saved Records</h4>
                                    <p className="text-slate-500 font-light mb-8 text-sm">Bookmark clinical records from the journal to access them here.</p>
                                    <Link href="/tips" className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-wider hover:bg-emerald-500 transition-all">
                                        <FiBookOpen size={14} /> Browse Journal
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
