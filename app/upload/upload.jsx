"use client";
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaRegPaperPlane } from "react-icons/fa";
import * as Yup from 'yup';
import { collection, addDoc } from "firebase/firestore";
import { db } from '@/config/firebase';
import { FiLoader, FiCheck } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";

// Success Modal - shown after successful upload
function SuccessModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6" onClick={onClose}>
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />
            <div
                className="relative z-10 w-full max-w-md glass-panel bg-[#0A0A0A]/95 rounded-[2rem] border border-emerald-500/25 shadow-[0_0_80px_rgba(0,0,0,0.8)] p-10 flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Animated success ring */}
                <div className="relative mb-8">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.2)]">
                        <FiCheck className="text-emerald-400 text-3xl" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 scale-110 animate-ping" />
                </div>

                <h3 className="text-2xl font-black text-slate-100 mb-3 font-[family-name:var(--font-playfair)]">
                    Record Published
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 font-light">
                    Your clinical record has been successfully transmitted to the Med-Share Africa network and is now available to the community.
                </p>
                <div className="flex items-center gap-2 text-emerald-500/70 text-[10px] font-bold uppercase tracking-widest mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Awaiting board verification
                </div>
                <div className="flex gap-3 w-full">
                    <button onClick={onClose} className="flex-1 py-3.5 rounded-full border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 font-bold text-sm uppercase tracking-widest transition-all">
                        Publish Another
                    </button>
                    <a href="/tips" className="flex-1 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest transition-all text-center shadow-[0_0_15px_rgba(5,150,105,0.3)]">
                        View Journal
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function UploadClient({ session }) {
    const [processing, setProcessing] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false);

    const iv = { tip: "", desc: "", cat: "" };

    const valSchema = Yup.object({
        tip: Yup.string().required("Clinical title is required"),
        desc: Yup.string().required("Provide comprehensive clinical details"),
        cat: Yup.string().required("Select a medical category")
    });

    return (
        <main className="min-h-dvh bg-[#050505] py-24 px-6 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Success Modal */}
            <SuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header Text */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black mb-3 text-slate-100 font-[family-name:var(--font-playfair)]">
                        Publish Clinical <span className="text-amber-400">Intelligence</span>
                    </h1>
                    <p className="text-slate-400 font-light text-lg">
                        Disseminate verified medical knowledge to the elite network.
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-amber-500/20 bg-[#0A0A0A]/80">
                    <Formik
                        initialValues={iv}
                        validationSchema={valSchema}
                        onSubmit={async (values, { resetForm }) => {
                            try {
                                setProcessing(true)
                                const dbObject = {
                                    ...values,
                                    author: session?.user?.name || "Verified Specialist",
                                    authorImg: session?.user?.image || "",
                                    refId: session?.user?.id || "anonymous",
                                    timestamp: new Date().toLocaleDateString()
                                }
                                await addDoc(collection(db, "health-tips"), dbObject)
                                resetForm()
                                setSuccessOpen(true)
                            } catch (error) {
                                console.error("An error occurred", error)
                                alert("Transmission failed.")
                            } finally {
                                setProcessing(false)
                            }
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="flex flex-col gap-8">
                                {/* Tip Title */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest ml-1">Research / Entry Title</label>
                                    <Field
                                        name="tip"
                                        placeholder="e.g. Neurological Impacts of Vitamin D Synthesis"
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:border-amber-500 focus:bg-white/5 bg-[#050505] text-slate-100 placeholder-slate-600 ${errors.tip && touched.tip ? 'border-red-500/50' : 'border-white/10'}`}
                                    />
                                    <ErrorMessage component="p" className="text-red-400 text-xs font-bold ml-1" name="tip" />
                                </div>

                                {/* Category Select */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest ml-1">Specialty</label>
                                    <div className="relative">
                                        <Field
                                            name="cat"
                                            as="select"
                                            className={`w-full px-5 py-4 rounded-2xl border focus:outline-none focus:border-amber-500 focus:bg-white/5 bg-[#050505] text-slate-100 appearance-none cursor-pointer ${errors.cat && touched.cat ? 'border-red-500/50' : 'border-white/10'}`}
                                        >
                                            <option value="" disabled>Select clinical specialty</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Otolaryngology">Otolaryngology (ENT)</option>
                                            <option value="Radiography">Radiography</option>
                                            <option value="Dentistry">Dentistry</option>
                                            <option value="Haematology">Haematology</option>
                                            <option value="General">General Practice</option>
                                        </Field>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-amber-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                    <ErrorMessage component="p" className="text-red-400 text-xs font-bold ml-1" name="cat" />
                                </div>

                                {/* Description Textarea */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-emerald-500 uppercase tracking-widest ml-1">Clinical Abstract</label>
                                    <Field
                                        name="desc"
                                        as="textarea"
                                        rows="6"
                                        placeholder="Detail the clinical findings, procedure, or health intelligence..."
                                        className={`w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:border-amber-500 focus:bg-white/5 bg-[#050505] text-slate-100 placeholder-slate-600 resize-none ${errors.desc && touched.desc ? 'border-red-500/50' : 'border-white/10'}`}
                                    />
                                    <ErrorMessage component="p" className="text-red-400 text-xs font-bold ml-1" name="desc" />
                                </div>

                                {/* Submit Button */}
                                <button
                                    disabled={processing}
                                    type="submit"
                                    className="w-full md:w-max md:self-end flex items-center justify-center gap-3 py-4 px-10 rounded-full bg-amber-500 text-[#050505] font-black text-lg transition-transform active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-amber-400 mt-4 disabled:opacity-60"
                                >
                                    {processing ? <FiLoader className="text-2xl animate-spin text-[#050505]" /> : (
                                        <span className="flex items-center gap-3">
                                            Publish Record <FaRegPaperPlane className="text-sm" />
                                        </span>
                                    )}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                <p className="text-center mt-10 text-slate-500 text-sm font-medium">
                    All transmissions are securely verified by the medical board.
                    <button className="ml-2 font-bold text-emerald-500 hover:text-emerald-400">Review Protocol</button>
                </p>
            </div>
        </main>
    );
}