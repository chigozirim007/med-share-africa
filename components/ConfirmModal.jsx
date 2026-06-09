"use client";
import React from "react";
import { FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";

/**
 * Reusable luxury confirmation modal.
 * Props:
 *  - isOpen: boolean
 *  - onConfirm: () => void
 *  - onCancel: () => void
 *  - title: string
 *  - message: string
 *  - confirmLabel: string (default "Delete")
 *  - type: "danger" | "warning" (default "danger")
 */
export default function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    title = "Confirm Action",
    message = "Are you sure you want to proceed? This action cannot be undone.",
    confirmLabel = "Delete",
    type = "danger",
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            onClick={onCancel}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-md glass-panel bg-[#0A0A0A]/95 rounded-[2rem] border border-red-500/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] p-8 flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onCancel}
                    className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
                >
                    <FiX size={18} />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <FiTrash2 className="text-red-400 text-2xl" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-slate-100 mb-3 font-[family-name:var(--font-playfair)]">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-slate-400 leading-relaxed mb-8 font-light text-sm">
                    {message}
                </p>

                {/* Disclaimer line */}
                <div className="flex items-center gap-2 text-amber-500/70 text-xs font-bold uppercase tracking-widest mb-8 bg-amber-500/5 border border-amber-500/10 rounded-full px-4 py-2">
                    <FiAlertTriangle size={12} />
                    This action is permanent and irreversible
                </div>

                {/* Buttons */}
                <div className="flex gap-4 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3.5 rounded-full border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 font-bold text-sm uppercase tracking-widest transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2"
                    >
                        <FiTrash2 size={14} />
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
