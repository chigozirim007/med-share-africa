"use client";
import React, { useState } from 'react';
import { Theme } from "@/components/Theme";
import { signOut, useSession } from "next-auth/react";
import { db } from '@/config/firebase';
import { doc, updateDoc } from "firebase/firestore";
import { FiLoader, FiLogOut, FiCheck, FiUser, FiEdit3 } from "react-icons/fi";

export default function ProfileClient({ session: initialSession }) {
    const { update } = useSession();
    const [name, setName] = useState(initialSession?.user?.name || "");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Name cannot be empty.");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess(false);

        try {
            // Update Firestore
            if (initialSession?.user?.id) {
                const userRef = doc(db, "users", initialSession.user.id);
                await updateDoc(userRef, { name: name.trim() });
            }

            // Update NextAuth Session
            if (update) {
                await update({ name: name.trim() });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Error updating profile name:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-16 px-6 text-slate-900">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                
                {/* Visual Header / Brand Color Background Card */}
                <div 
                    style={{ background: `linear-gradient(135deg, ${Theme.primaryGreen} 0%, ${Theme.secondaryGreen} 100%)` }}
                    className="h-36 w-full relative flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <h2 className="text-white text-2xl font-black tracking-wide uppercase z-10">My Profile</h2>
                </div>

                {/* Profile Form / Content */}
                <div className="px-8 pb-12 pt-0 flex flex-col items-center -mt-16">
                    {/* User Avatar Circle */}
                    <div className="relative group mb-6 z-20">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4 ring-offset-2 ring-slate-100/50 bg-slate-200 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                            {initialSession?.user?.image ? (
                                <img
                                    src={initialSession.user.image}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <FiUser className="w-14 h-14 text-slate-400" />
                            )}
                        </div>
                    </div>

                    {/* Email display */}
                    <p className="text-slate-400 text-sm font-medium mb-8">
                        {initialSession?.user?.email}
                    </p>

                    <form onSubmit={handleSave} className="w-full flex flex-col gap-6">
                        {/* Name Input Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5">
                                <FiEdit3 className="text-sm" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 bg-slate-50 font-medium text-slate-800"
                                style={{ '--tw-ring-color': Theme.primaryGreen }}
                            />
                        </div>

                        {/* Success / Error Messages */}
                        {success && (
                            <div className="flex items-center gap-2 text-[#468432] bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-sm font-bold animate-fadeIn">
                                <FiCheck className="text-lg shrink-0" />
                                <span>Changes saved successfully!</span>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 bg-red-50 border border-red-100 p-4 rounded-2xl text-xs font-bold">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mt-4">
                            {/* Save Button */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-3 py-4 px-10 rounded-full text-white font-black text-lg transition-all active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
                                style={{ 
                                    backgroundColor: Theme.primaryGreen,
                                    opacity: saving ? 0.8 : 1
                                }}
                            >
                                {saving ? (
                                    <FiLoader className="text-2xl animate-spin" />
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                            {/* Logout Button */}
                            <button
                                type="button"
                                onClick={() => signOut()}
                                className="w-full flex items-center justify-center gap-3 py-4 px-10 rounded-full border-2 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 font-bold text-lg transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <FiLogOut className="text-lg" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
