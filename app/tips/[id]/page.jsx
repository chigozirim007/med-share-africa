"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from '@/config/firebase';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowLeft, FiUser, FiCalendar, FiBookOpen, FiAlertTriangle, FiLoader, FiHeart, FiBookmark, FiSend, FiMessageSquare } from "react-icons/fi";

export default function TipDetailsPage() {
    const params = useParams();
    const id = params?.id;
    const { data: session } = useSession();

    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const commentInputRef = useRef(null);

    useEffect(() => {
        if (!id) return;
        const fetchTip = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "health-tips", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTip({ postId: docSnap.id, ...docSnap.data() });
                } else {
                    setTip(null);
                }
            } catch (err) {
                setError(`Retrieval failed: ${err.message || err.toString()}`);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [id]);

    // Real-time comments subscription
    useEffect(() => {
        if (!id) return;
        const q = query(
            collection(db, "health-tips", id, "comments"),
            orderBy("createdAt", "asc")
        );
        const unsub = onSnapshot(q, (snap) => {
            setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [id]);

    const handleLike = async () => {
        if (!session?.user?.id || !tip) return;
        const userId = session.user.id;
        const tipRef = doc(db, "health-tips", id);
        const likes = tip.likes || [];
        const alreadyLiked = likes.includes(userId);
        await updateDoc(tipRef, { likes: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId) });
        setTip(prev => ({
            ...prev,
            likes: alreadyLiked ? likes.filter(l => l !== userId) : [...likes, userId]
        }));
    };

    const handleBookmark = async () => {
        if (!session?.user?.id || !tip) return;
        const userId = session.user.id;
        const tipRef = doc(db, "health-tips", id);
        const bookmarks = tip.bookmarks || [];
        const already = bookmarks.includes(userId);
        await updateDoc(tipRef, { bookmarks: already ? arrayRemove(userId) : arrayUnion(userId) });
        setTip(prev => ({
            ...prev,
            bookmarks: already ? bookmarks.filter(b => b !== userId) : [...bookmarks, userId]
        }));
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !session?.user?.id) return;
        setSubmittingComment(true);
        try {
            await addDoc(collection(db, "health-tips", id, "comments"), {
                text: commentText.trim(),
                authorId: session.user.id,
                authorName: session.user.name,
                authorImg: session.user.image || null,
                createdAt: serverTimestamp(),
            });
            setCommentText("");
        } catch (err) {
            console.error("Comment error:", err);
        } finally {
            setSubmittingComment(false);
        }
    };

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

    if (error || !tip) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6">
                <div className="max-w-md w-full glass-panel rounded-[2rem] p-8 border border-white/10 text-center">
                    <FiBookOpen className="mx-auto text-4xl text-slate-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-slate-100">{error ? "Retrieval Error" : "Record Not Found"}</h1>
                    <p className="text-slate-400 mb-6 text-sm">{error || "This record does not exist or has been revoked."}</p>
                    <Link href="/tips" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
                        <FiArrowLeft /> Return to Journal
                    </Link>
                </div>
            </main>
        );
    }

    const isLiked = (tip.likes || []).includes(session?.user?.id);
    const isBookmarked = (tip.bookmarks || []).includes(session?.user?.id);

    return (
        <main className="min-h-dvh bg-[#050505] text-slate-100 pb-24 relative">
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-900/8 rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Article Header */}
            <section className="bg-[#0A0A0A]/80 border-b border-white/5 pt-28 pb-12 px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <Link href="/tips" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-10 font-bold text-sm uppercase tracking-widest transition-all group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Clinical Journal
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md text-[#050505] bg-emerald-500">
                            {tip.cat}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <FiCalendar className="text-xs" /> {tip.timestamp}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black mb-10 leading-tight font-[family-name:var(--font-playfair)] text-slate-100">
                        {tip.tip}
                    </h1>

                    {/* Author + Engagement */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6 flex-wrap gap-4">
                        <Link href={`/u/${tip.refId}`} className="flex items-center gap-4 group/author hover:bg-white/5 p-2 -ml-2 rounded-2xl transition-colors">
                            {tip.authorImg ? (
                                <img src={tip.authorImg} alt={tip.author} className="w-12 h-12 rounded-full object-cover border border-amber-500/30 grayscale group-hover/author:grayscale-0 transition-all" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/30 group-hover/author:border-amber-500/50 transition-colors">
                                    <FiUser className="w-6 h-6 text-emerald-500 group-hover/author:text-amber-400 transition-colors" />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-bold text-slate-200 group-hover/author:text-amber-400 transition-colors">{tip.author}</p>
                                <p className="text-xs text-emerald-500 uppercase tracking-widest font-bold">Verified Specialist</p>
                            </div>
                        </Link>

                        {/* Like & Bookmark */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-bold ${
                                    isLiked
                                        ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                                        : "border-white/10 text-slate-400 hover:border-rose-500/30 hover:text-rose-400 hover:bg-rose-500/10"
                                }`}
                            >
                                <FiHeart size={15} className={isLiked ? "fill-rose-400" : ""} />
                                {(tip.likes || []).length > 0 && <span>{(tip.likes || []).length}</span>}
                                Like
                            </button>
                            <button
                                onClick={handleBookmark}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-bold ${
                                    isBookmarked
                                        ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                        : "border-white/10 text-slate-400 hover:border-amber-500/30 hover:text-amber-400 hover:bg-amber-500/10"
                                }`}
                            >
                                <FiBookmark size={15} className={isBookmarked ? "fill-amber-400" : ""} />
                                {isBookmarked ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-6 relative z-10">
                <div className="max-w-3xl mx-auto flex flex-col gap-8">
                    <div className="glass-panel bg-[#0A0A0A]/60 rounded-[2rem] p-8 md:p-12 border border-white/5">
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light">
                            {tip.desc}
                        </p>
                    </div>

                    {tip.references && (
                        <div className="glass-panel bg-[#0A0A0A]/40 rounded-2xl p-6 border border-amber-500/10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-amber-500/70 mb-3 flex items-center gap-1.5">
                                <FiBookOpen className="text-sm" /> References
                            </h3>
                            <p className="text-sm text-slate-400 italic break-words">{tip.references}</p>
                        </div>
                    )}

                    {/* Medical Disclaimer */}
                    <div className="glass-panel bg-amber-500/5 rounded-2xl p-5 border border-amber-500/20 flex gap-4 items-start">
                        <FiAlertTriangle className="text-amber-500 text-xl shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-400 mb-1 uppercase tracking-wider">Medical Disclaimer</h4>
                            <p className="text-xs text-amber-300/70 leading-relaxed font-medium">
                                For educational purposes only. Does not substitute professional medical advice, diagnosis, or treatment.
                            </p>
                        </div>
                    </div>

                    {/* ===================== COMMENTS ===================== */}
                    <div className="mt-4">
                        <h3 className="text-xl font-black text-slate-100 mb-8 flex items-center gap-3">
                            <FiMessageSquare className="text-emerald-500" />
                            Clinical Discussion
                            {comments.length > 0 && (
                                <span className="text-sm font-bold text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                    {comments.length}
                                </span>
                            )}
                        </h3>

                        {/* Comment Input */}
                        {session ? (
                            <form onSubmit={handleSubmitComment} className="glass-panel bg-[#0A0A0A]/60 rounded-2xl p-5 border border-white/5 mb-8 flex gap-4 items-start">
                                {session.user?.image ? (
                                    <img src={session.user.image} alt="" className="w-10 h-10 rounded-full border border-amber-500/30 shrink-0 mt-1" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/30 shrink-0 mt-1">
                                        <FiUser className="text-emerald-500" />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col gap-3">
                                    <textarea
                                        ref={commentInputRef}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows={3}
                                        placeholder="Share your clinical insight or peer review..."
                                        className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/40 resize-none transition-colors"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !commentText.trim()}
                                            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all disabled:opacity-50 shadow-[0_0_10px_rgba(5,150,105,0.2)]"
                                        >
                                            {submittingComment ? <FiLoader className="animate-spin text-sm" /> : <FiSend size={13} />}
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="glass-panel bg-[#0A0A0A]/40 rounded-2xl p-5 border border-white/5 mb-8 text-center">
                                <p className="text-slate-500 text-sm mb-3">Join the discussion</p>
                                <Link href="/signin" className="text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors">
                                    Sign in to comment →
                                </Link>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="flex flex-col gap-4">
                            {comments.length === 0 ? (
                                <div className="text-center py-10 text-slate-600">
                                    <FiMessageSquare className="mx-auto text-3xl mb-3 opacity-50" />
                                    <p className="text-sm font-medium">No discussion yet. Be the first to share your insight.</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="glass-panel bg-[#0A0A0A]/40 rounded-2xl p-5 border border-white/5 flex gap-4">
                                        {comment.authorImg ? (
                                            <img src={comment.authorImg} alt={comment.authorName} className="w-9 h-9 rounded-full border border-amber-500/20 shrink-0 mt-0.5" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 shrink-0 mt-0.5">
                                                <FiUser className="text-emerald-500 text-xs" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-sm font-bold text-slate-200">{comment.authorName}</span>
                                                {comment.createdAt?.toDate && (
                                                    <span className="text-[10px] text-slate-600 font-medium">
                                                        {comment.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-4 text-center">
                        <Link href="/tips" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 font-bold text-sm uppercase tracking-widest transition-all">
                            <FiArrowLeft /> Back to Journal
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
