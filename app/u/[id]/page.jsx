"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from '@/config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FiLoader, FiUser, FiCheck, FiBookOpen, FiArrowLeft, FiHeart, FiBookmark, FiAward, FiShield } from "react-icons/fi";

export default function PublicProfilePage() {
    const params = useParams();
    const id = params?.id;

    const [userProfile, setUserProfile] = useState(null);
    const [practitionerDetails, setPractitionerDetails] = useState(null);
    const [publishedTips, setPublishedTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // Fetch user auth document
                const userDocRef = doc(db, "users", id);
                const userDocSnap = await getDoc(userDocRef);
                
                let profileData = null;

                if (userDocSnap.exists()) {
                    profileData = userDocSnap.data();
                    setUserProfile({ id: userDocSnap.id, ...profileData });
                } else {
                    // It's possible we only have a refId in a tip without a corresponding user document (e.g. anonymous)
                    setUserProfile({ id, name: "Specialist", email: "", image: null });
                }

                // If we found an email, try to find a practitioner profile
                if (profileData && profileData.email) {
                    const pracQuery = query(collection(db, "practitioners"), where("email", "==", profileData.email.toLowerCase()));
                    const pracSnap = await getDocs(pracQuery);
                    if (!pracSnap.empty) {
                        setPractitionerDetails({ id: pracSnap.docs[0].id, ...pracSnap.docs[0].data() });
                    }
                }

                // Fetch published tips by this user
                const tipsQuery = query(collection(db, "health-tips"), where("refId", "==", id));
                const tipsSnap = await getDocs(tipsQuery);
                const tipsList = [];
                tipsSnap.forEach(d => tipsList.push({ postId: d.id, ...d.data() }));
                setPublishedTips(tipsList);

            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to retrieve practitioner profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <FiLoader className="text-4xl animate-spin text-emerald-500" />
                    <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-xs">Retrieving practitioner dossier...</p>
                </div>
            </main>
        );
    }

    if (error && !userProfile) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6">
                <div className="max-w-md w-full glass-panel rounded-[2rem] p-8 border border-white/10 text-center">
                    <FiUser className="mx-auto text-4xl text-slate-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2 text-slate-100">Profile Not Found</h1>
                    <p className="text-slate-400 mb-6 text-sm">{error || "This practitioner could not be found in the network."}</p>
                    <Link href="/tips" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
                        <FiArrowLeft /> Return to Journal
                    </Link>
                </div>
            </main>
        );
    }

    const displayName = practitionerDetails?.fullName || userProfile?.name || "Verified Specialist";
    const displayImage = userProfile?.image || null;
    const rank = publishedTips.length >= 10 ? "Senior Fellow" : publishedTips.length >= 5 ? "Fellow" : "Verified Member";

    return (
        <main className="min-h-dvh bg-[#050505] py-24 px-6 text-slate-100 relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-14 relative z-10">

                <div className="w-full self-start mb-[-2rem]">
                    <Link href="/tips" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 font-bold text-sm uppercase tracking-widest transition-all group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Clinical Journal
                    </Link>
                </div>

                {/* ===================== PROFILE HEADER ===================== */}
                <div className="w-full">
                    {/* Banner */}
                    <div className="h-44 w-full rounded-t-[2.5rem] relative overflow-hidden bg-gradient-to-tr from-[#050505] via-[#0A3020] to-emerald-900">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.3) 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
                        {practitionerDetails?.specialty && (
                            <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-[#050505]/50 border border-white/10 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-widest">
                                {practitionerDetails.specialty}
                            </div>
                        )}
                    </div>

                    <div className="glass-panel bg-[#0A0A0A]/90 rounded-b-[2.5rem] border border-t-0 border-white/5 px-8 pb-10 shadow-2xl">
                        <div className="flex flex-col md:flex-row md:items-end justify-between -mt-14 mb-6 gap-6">
                            <div className="relative inline-block w-max">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#0A0A0A] bg-[#050505] flex items-center justify-center">
                                    {displayImage ? (
                                        <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <FiUser className="w-12 h-12 text-emerald-500" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#0A0A0A] flex items-center justify-center" title="Verified Practitioner">
                                    <FiCheck className="text-[#050505] text-xs font-black" />
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                                    <p className="text-xl font-black text-slate-100">{publishedTips.length}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Records</p>
                                </div>
                                <div className="text-center px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-xl font-black text-amber-400 flex justify-center items-center h-[30px]"><FiAward size={20} /></p>
                                    <p className="text-[10px] text-amber-500/70 uppercase tracking-widest font-bold">Rank</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-black text-slate-100 font-[family-name:var(--font-playfair)] mb-1">{displayName}</h1>
                            <div className="flex items-center gap-3 mb-6 flex-wrap">
                                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    <FiShield size={12} /> {rank}
                                </span>
                                {practitionerDetails?.institution && (
                                    <span className="text-slate-400 text-sm font-medium border-l border-white/20 pl-3">
                                        {practitionerDetails.institution}
                                    </span>
                                )}
                            </div>

                            {practitionerDetails?.bio && (
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Professional Biography</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed font-light max-w-3xl">
                                        {practitionerDetails.bio}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===================== PUBLISHED RECORDS ===================== */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
                            <FiBookOpen className="text-emerald-500" />
                            Clinical Contributions
                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400 ml-2">{publishedTips.length}</span>
                        </h2>
                    </div>

                    {publishedTips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {publishedTips.map((tip) => (
                                <article key={tip.postId} className="glass-panel bg-[#0A0A0A]/40 rounded-[2rem] border border-white/5 hover:border-amber-500/20 transition-all flex flex-col group p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md text-[#050505] bg-emerald-500 whitespace-nowrap">
                                            {tip.cat}
                                        </span>
                                        <span className="text-xs text-slate-600 font-medium">{tip.timestamp}</span>
                                    </div>
                                    <Link href={`/tips/${tip.postId}`}>
                                        <h4 className="text-lg font-bold mb-2 leading-tight text-slate-200 group-hover:text-amber-400 transition-colors cursor-pointer">{tip.tip}</h4>
                                    </Link>
                                    <p className="text-slate-500 line-clamp-2 leading-relaxed font-light text-sm flex-1 mb-4">{tip.desc}</p>
                                    
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-600 font-bold">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5"><FiHeart size={13} className={(tip.likes || []).length > 0 ? "text-rose-400" : ""} /> {(tip.likes || []).length}</span>
                                            <span className="flex items-center gap-1.5"><FiBookmark size={13} className={(tip.bookmarks || []).length > 0 ? "text-amber-400" : ""} /> {(tip.bookmarks || []).length}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel bg-[#0A0A0A]/40 rounded-[2rem] p-12 border border-white/5 text-center">
                            <FiBookOpen className="mx-auto text-3xl text-slate-600 mb-4" />
                            <h4 className="text-lg font-black text-slate-300 mb-2">No Records Published</h4>
                            <p className="text-slate-500 font-light text-sm">This practitioner has not yet shared any clinical insights with the network.</p>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
