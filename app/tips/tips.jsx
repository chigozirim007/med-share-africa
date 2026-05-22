"use client"
import React, { useEffect, useState } from 'react';
import { Theme } from "@/components/Theme";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/config/firebase';
import { doc, deleteDoc } from "firebase/firestore";

const MedicalResources = ({session}) => {

    const [initialTips, setInitialTips] = useState([])

    const handleFetch = async () => {
        const ideas = []
        try {
            const querySnapshot = await getDocs(collection(db, "health-tips"));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
                const data = {
                    postId: doc.id,
                    ...doc.data()
                }
                // console.log(data);

                ideas.push(data)
                // console.log(ideas);                
            });
            setInitialTips(ideas)
            // console.log(initialTips);
            
        } catch (error) {
            console.error("An error occurred", error)
            alert("Something went wrong")
        }
    }

    useEffect(()=>{
        handleFetch()
    }, [])


    // const [tips, setTips] = useState(initialTips);
    // console.log(tips);
    

    const handleDelete = async (id) => {
        try {
            if (confirm("Are you sure you want to delete this tip?")) {
                await deleteDoc(doc(db, "health-tips", id));
                setInitialTips(prev => prev.filter(tip => tip.postId !== id));
            }
        } catch (error) {
            console.error("An error occurred", error)
            alert("Oops Something went wrong")
        }
    };

    return (
        <main className="min-h-dvh bg-slate-50 text-slate-900 pb-20">
            {/* Header Area */}
            <section className="bg-white border-b border-slate-200 py-16 px-6 mb-12">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Health <span style={{ color: Theme.primaryGreen }}>Resources</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Browse verified medical tips and health advice submitted by our community.
                    </p>
                </div>
            </section>

            {/* Grid Container */}
            <div className="max-w-6xl mx-auto px-6 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initialTips.map((tip) => (
                        <article
                            key={tip.postId}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group"
                        >
                            <div className="p-8 flex flex-col h-full relative">

                                {/* Delete Button - Top Right */}
                                {
                                    session?.user?.id == tip.refId ? <button
                                    onClick={() => handleDelete(tip.postId)}
                                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Tip"
                                >
                                    <FiTrash2 size={20} />
                                </button>  : null
                                }
                               

                                {/* Category & Date */}
                                <div className="flex items-center gap-3 mb-5">
                                    <span
                                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
                                        style={{ backgroundColor: Theme.primaryGreen }}
                                    >
                                        {tip.cat}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">{tip.timestamp}</span>
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold mb-4 leading-tight">
                                    {tip.tip}
                                </h2>

                                {/* Content Snippet */}
                                <div className="mb-6">
                                    <p className="text-slate-600 line-clamp-4 leading-relaxed">
                                        {tip.desc}
                                    </p>
                                    {tip.desc && (tip.desc.split('\n').length > 4 || tip.desc.length > 250) && (
                                        <Link
                                            href={`/tips/${tip.postId}`}
                                            className="text-sm font-bold mt-2 inline-block hover:opacity-70 transition-opacity"
                                            style={{ color: Theme.primaryGreen }}
                                        >
                                            Read more →
                                        </Link>
                                    )}
                                </div>

                                {/* Preventive Advice Box */}
                                {/* <div className="bg-slate-50 p-4 rounded-2xl mb-6 border-l-4" style={{ borderLeftColor: Theme.secondaryGreen }}>
                                    <h4 className="text-[10px] font-black mb-1 uppercase text-slate-400 tracking-tighter">Quick Tip:</h4>
                                    <p className="text-sm text-slate-700 leading-snug">{tip.preventiveAdvice}</p>
                                </div> */}

                                {/* Author Info */}
                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={tip.authorImg}
                                            alt={tip.author}
                                            className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                        />
                                        <p className="text-xs font-bold text-slate-800">{tip.author}</p>
                                    </div>
                                    {tip.references && (
                                        <span className="text-[10px] text-slate-400 italic">Ref: {tip.references.split(' ')[0]}...</span>
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