"use client";
import React, { useState, useEffect } from 'react';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { db } from '@/config/firebase';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { FiLoader, FiLogOut, FiCheck, FiUser, FiEdit3, FiTrash2 } from "react-icons/fi";

export default function ProfileClient({ session: initialSession }) {
    const { update } = useSession();
    const [name, setName] = useState(initialSession?.user?.name || "");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [userTips, setUserTips] = useState([]);
    const [loadingTips, setLoadingTips] = useState(true);

    const fetchUserTips = async () => {
        if (!initialSession?.user?.id) return;
        try {
            setLoadingTips(true);
            const q = query(
                collection(db, "health-tips"),
                where("refId", "==", initialSession.user.id)
            );
            const querySnapshot = await getDocs(q);
            const tips = [];
            querySnapshot.forEach((doc) => {
                tips.push({
                    postId: doc.id,
                    ...doc.data()
                });
            });
            setUserTips(tips);
        } catch (err) {
            console.error("Error fetching user health tips:", err);
        } finally {
            setLoadingTips(false);
        }
    };

    useEffect(() => {
        fetchUserTips();
    }, [initialSession]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Identification cannot be empty.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess(false);

        try {
            if (initialSession?.user?.id) {
                const userRef = doc(db, "users", initialSession.user.id);
                await updateDoc(userRef, { name: name.trim() });
            }
            if (update) {
                await update({ name: name.trim() });
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error updating profile name:", err);
            setError("Secure update failed. Please retry.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTip = async (id) => {
        try {
            if (confirm("Verify deletion of this clinical record?")) {
                await deleteDoc(doc(db, "health-tips", id));
                setUserTips(prev => prev.filter(tip => tip.postId !== id));
            }
        } catch (err) {
            console.error("Error deleting tip:", err);
            alert("Deletion protocol failed.");
        }
    };

    return (
        <main className="min-h-dvh bg-[#050505] py-24 px-6 text-slate-100 relative">
            {/* Background ambient glow */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto flex flex-col items-center gap-16 relative z-10">
                
                {/* Profile Card */}
                <div className="w-full max-w-lg glass-panel bg-[#0A0A0A]/80 rounded-[2.5rem] shadow-2xl border border-amber-500/20 overflow-hidden">
                    
                    {/* Visual Header */}
                    <div className="h-40 w-full relative flex items-center justify-center bg-gradient-to-br from-emerald-900/80 to-[#0A0A0A] border-b border-amber-500/20">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h2 className="text-amber-400 text-sm font-black tracking-[0.2em] uppercase z-10">Clinical Profile</h2>
                    </div>

                    {/* Profile Form / Content */}
                    <div className="px-8 pb-12 pt-0 flex flex-col items-center -mt-16 relative z-20">
                        {/* User Avatar Circle */}
                        <div className="relative group mb-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden border border-amber-500/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] bg-[#050505] flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                                {initialSession?.user?.image ? (
                                    <img
                                        src={initialSession.user.image}
                                        alt={name}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <FiUser className="w-14 h-14 text-emerald-500" />
                                )}
                            </div>
                        </div>

                        {/* Email display */}
                        <div className="flex items-center gap-2 mb-8">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
                                {initialSession?.user?.email}
                            </p>
                        </div>

                        <form onSubmit={handleSave} className="w-full flex flex-col gap-6">
                            {/* Name Input Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 ml-1 flex items-center gap-1.5">
                                    <FiEdit3 className="text-sm" /> Authorized Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter authorization name"
                                    className="w-full px-5 py-4 rounded-2xl border border-white/10 transition-all focus:outline-none focus:border-amber-500 focus:bg-white/10 bg-[#050505] text-slate-100 placeholder-slate-600 font-bold"
                                />
                            </div>

                            {/* Success / Error Messages */}
                            {success && (
                                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-sm font-bold">
                                    <FiCheck className="text-lg shrink-0" />
                                    <span>Profile security updated.</span>
                                </div>
                            )}
                            {error && (
                                <div className="text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-xs font-bold">
                                    {error}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full flex items-center justify-center gap-3 py-4 px-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                                >
                                    {saving ? <FiLoader className="text-2xl animate-spin" /> : "Update Record"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className="w-full flex items-center justify-center gap-3 py-4 px-10 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold text-sm uppercase tracking-wider transition-all"
                                >
                                    <FiLogOut className="text-lg" />
                                    <span>Terminate Session</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* User's Created Tips Portfolio Grid */}
                <div className="w-full border-t border-white/10 pt-16">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-black mb-3 text-slate-100 font-[family-name:var(--font-playfair)]">
                            My Published <span className="text-amber-400">Intelligence</span>
                        </h3>
                        <p className="text-slate-400 font-light max-w-xl mx-auto">
                            The clinical records and medical insights you have authorized on the Med-Share Africa network.
                        </p>
                    </div>

                    {loadingTips ? (
                        <div className="flex justify-center items-center py-16">
                            <FiLoader className="text-4xl animate-spin text-emerald-500" />
                        </div>
                    ) : userTips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {userTips.map((tip) => (
                                <article
                                    key={tip.postId}
                                    className="glass-panel bg-[#0A0A0A]/60 rounded-[2rem] border border-amber-500/10 hover:border-amber-500/30 transition-all flex flex-col group relative"
                                >
                                    <div className="p-8 flex flex-col h-full">
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteTip(tip.postId)}
                                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                            title="Revoke Record"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>

                                        {/* Category & Date */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-[#050505] bg-emerald-500">
                                                {tip.cat}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">{tip.timestamp}</span>
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-xl font-bold mb-3 leading-tight text-slate-200">
                                            {tip.tip}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-slate-400 line-clamp-3 leading-relaxed mb-6 font-light">
                                            {tip.desc}
                                        </p>

                                        {/* Footer */}
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {tip.authorImg ? (
                                                    <img src={tip.authorImg} alt={tip.author} className="w-8 h-8 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-amber-500/30" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-500/30"><FiUser className="text-emerald-500 text-xs" /></div>
                                                )}
                                                <p className="text-xs font-bold text-slate-300">{tip.author}</p>
                                            </div>
                                            <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel bg-[#0A0A0A]/50 rounded-[2rem] p-12 border border-white/10 text-center max-w-md mx-auto">
                            <p className="text-slate-400 font-light mb-6">
                                No clinical records found in your directory.
                            </p>
                            <Link
                                href="/upload"
                                className="inline-block py-3 px-8 rounded-full bg-amber-500 text-[#050505] font-black text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform"
                            >
                                Publish First Record
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
