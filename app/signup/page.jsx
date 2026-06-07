"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { db } from "@/config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { FiLoader, FiCheck, FiAlertTriangle, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiChevronRight, FiChevronLeft } from "react-icons/fi";

const SPECIALTIES = [
    "Cardiology", "Neurology", "Dermatology", "Pediatrics", "Oncology",
    "Orthopaedics", "Radiology", "Psychiatry", "Gynaecology", "General Practice",
    "Surgery", "Dentistry", "Haematology", "Ophthalmology", "Emergency Medicine",
    "Otolaryngology (ENT)", "Gastroenterology", "Urology", "Endocrinology", "Nephrology",
    "Infectious Disease", "Anaesthesiology", "Pathology", "Pharmacology", "Other"
];

const COUNTRIES = [
    "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia", "Tanzania", "Uganda",
    "Rwanda", "Senegal", "Ivory Coast", "Cameroon", "Zimbabwe", "Zambia", "Mozambique",
    "Angola", "Algeria", "Morocco", "Egypt", "Sudan", "Somalia", "Mali", "Other"
];

const STEPS = [
    { label: "Identity", icon: FiUser },
    { label: "Specialisation", icon: FiBriefcase },
    { label: "Credentials", icon: FiCheck },
];

const INITIAL_FORM = {
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    specialty: "",
    role: "",
    yearsOfExperience: "",
    institution: "",
    licenseNumber: "",
    bio: "",
    agreeToTerms: false,
};

const ROLES = [
    "Physician / Medical Doctor",
    "Specialist / Consultant",
    "Nurse / Midwife",
    "Pharmacist",
    "Medical Researcher",
    "Public Health Officer",
    "Allied Health Professional",
    "Medical Student / Intern",
    "Healthcare Administrator",
    "Patient / Health Enthusiast",
];

export default function SignUpPage() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 0) {
            if (!form.fullName.trim() || form.fullName.trim().length < 3) newErrors.fullName = "Full name must be at least 3 characters.";
            if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "A valid email address is required.";
            if (!form.phone.trim() || !/^[+0-9\s\-()]{7,}$/.test(form.phone)) newErrors.phone = "A valid phone number is required.";
            if (!form.country) newErrors.country = "Please select your country.";
            if (!form.city.trim()) newErrors.city = "City is required.";
        }
        if (step === 1) {
            if (!form.specialty) newErrors.specialty = "Please select your clinical specialty.";
            if (!form.role) newErrors.role = "Please select your professional role.";
            if (!form.yearsOfExperience || isNaN(form.yearsOfExperience) || form.yearsOfExperience < 0) newErrors.yearsOfExperience = "Please enter valid years of experience.";
            if (!form.institution.trim()) newErrors.institution = "Institution or hospital name is required.";
        }
        if (step === 2) {
            if (!form.bio.trim() || form.bio.trim().length < 50) newErrors.bio = "Please write at least 50 characters for your professional bio.";
            if (!form.agreeToTerms) newErrors.agreeToTerms = "You must agree to the clinical practice terms.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep((s) => Math.min(s + 1, 2));
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;
        setLoading(true);
        setServerError("");

        try {
            // Check for duplicate email in Firestore
            const q = query(collection(db, "practitioners"), where("email", "==", form.email.toLowerCase().trim()));
            const existing = await getDocs(q);
            if (!existing.empty) {
                setServerError("An account with this email already exists. Please sign in instead.");
                setLoading(false);
                return;
            }

            // Register the practitioner profile in Firestore
            await addDoc(collection(db, "practitioners"), {
                fullName: form.fullName.trim(),
                email: form.email.toLowerCase().trim(),
                phone: form.phone.trim(),
                country: form.country,
                city: form.city.trim(),
                specialty: form.specialty,
                role: form.role,
                yearsOfExperience: parseInt(form.yearsOfExperience, 10),
                institution: form.institution.trim(),
                licenseNumber: form.licenseNumber.trim() || null,
                bio: form.bio.trim(),
                verified: false,
                joinedAt: new Date().toISOString(),
                status: "pending_review",
            });

            setSubmitted(true);
        } catch (err) {
            console.error("Registration error:", err);
            setServerError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-5 py-4 rounded-2xl border transition-all focus:outline-none focus:border-amber-500 focus:bg-white/5 bg-[#050505] text-slate-100 placeholder-slate-600 ${
            errors[field] ? "border-red-500/60" : "border-white/10"
        }`;

    const labelClass = "block text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2";

    if (submitted) {
        return (
            <main className="min-h-dvh bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="w-full max-w-lg glass-panel rounded-[2rem] border border-emerald-500/30 p-12 text-center z-10">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mb-8">
                        <FiCheck className="text-emerald-400 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-100 mb-4 font-[family-name:var(--font-playfair)]">
                        Application Received
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-8 font-light">
                        Your practitioner profile has been submitted for board review. You will receive a confirmation and access credentials at <span className="text-amber-400 font-bold">{form.email}</span> within 24–48 hours.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => signIn("google")}
                            className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                        >
                            Authenticate with Google
                        </button>
                        <Link href="/" className="w-full py-4 rounded-full border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 font-bold text-center transition-all">
                            Return to Portal
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-dvh bg-[#050505] py-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 group mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-amber-500/30 flex items-center justify-center">
                            <span className="text-amber-400 font-black text-xl font-[family-name:var(--font-playfair)]">M</span>
                        </div>
                    </Link>
                    <h1 className="text-4xl font-black text-slate-100 mb-3 font-[family-name:var(--font-playfair)]">
                        Join the <span className="text-amber-400">Network</span>
                    </h1>
                    <p className="text-slate-400 font-light text-lg">
                        Register as a verified clinical practitioner.
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-0 mb-12">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = i === step;
                        const isDone = i < step;
                        return (
                            <React.Fragment key={i}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all font-black text-sm ${
                                        isDone ? "bg-emerald-500 border-emerald-500 text-[#050505]"
                                        : isActive ? "border-amber-500 text-amber-400 bg-amber-500/10"
                                        : "border-white/10 text-slate-500 bg-white/5"
                                    }`}>
                                        {isDone ? <FiCheck className="text-lg" /> : <Icon className="text-lg" />}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "text-amber-400" : isDone ? "text-emerald-500" : "text-slate-600"}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`h-[2px] w-16 mx-1 mb-6 rounded-full transition-all ${i < step ? "bg-emerald-500" : "bg-white/10"}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit}>
                    <div className="glass-panel bg-[#0A0A0A]/80 rounded-[2.5rem] p-8 md:p-12 border border-amber-500/15 shadow-2xl">

                        {/* STEP 0: Personal Identity */}
                        {step === 0 && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-xl font-black text-slate-100 mb-2 uppercase tracking-wider">Personal Information</h2>
                                <div>
                                    <label className={labelClass}>Full Legal Name</label>
                                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Dr. Amara Okonkwo" className={inputClass("fullName")} />
                                    {errors.fullName && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Professional Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@hospital.org" className={inputClass("email")} />
                                    {errors.email && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
                                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 800 000 0000" className={inputClass("phone")} />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.phone}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Country</label>
                                        <div className="relative">
                                            <select name="country" value={form.country} onChange={handleChange} className={inputClass("country") + " appearance-none cursor-pointer"}>
                                                <option value="">Select country</option>
                                                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-500">
                                                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                        {errors.country && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.country}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>City</label>
                                        <input name="city" value={form.city} onChange={handleChange} placeholder="Lagos, Nairobi..." className={inputClass("city")} />
                                        {errors.city && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.city}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: Clinical Specialisation */}
                        {step === 1 && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-xl font-black text-slate-100 mb-2 uppercase tracking-wider">Clinical Specialisation</h2>
                                <div>
                                    <label className={labelClass}>Specialty / Discipline</label>
                                    <div className="relative">
                                        <select name="specialty" value={form.specialty} onChange={handleChange} className={inputClass("specialty") + " appearance-none cursor-pointer"}>
                                            <option value="">Select your specialty</option>
                                            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-500">
                                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                    {errors.specialty && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.specialty}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Professional Role</label>
                                    <div className="relative">
                                        <select name="role" value={form.role} onChange={handleChange} className={inputClass("role") + " appearance-none cursor-pointer"}>
                                            <option value="">Select your role</option>
                                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-amber-500">
                                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                    {errors.role && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.role}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Years of Experience</label>
                                        <input name="yearsOfExperience" type="number" min="0" max="60" value={form.yearsOfExperience} onChange={handleChange} placeholder="e.g. 8" className={inputClass("yearsOfExperience")} />
                                        {errors.yearsOfExperience && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.yearsOfExperience}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>License No. <span className="text-slate-600 normal-case">(optional)</span></label>
                                        <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="MDC/2024/XXXXX" className={inputClass("licenseNumber")} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Current Institution / Hospital</label>
                                    <input name="institution" value={form.institution} onChange={handleChange} placeholder="Lagos University Teaching Hospital" className={inputClass("institution")} />
                                    {errors.institution && <p className="text-red-400 text-xs mt-1.5 ml-1 font-bold">{errors.institution}</p>}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Credentials & Final Review */}
                        {step === 2 && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-xl font-black text-slate-100 mb-2 uppercase tracking-wider">Profile & Credentials</h2>

                                {/* Summary Card */}
                                <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                    {[
                                        { label: "Name", value: form.fullName },
                                        { label: "Email", value: form.email },
                                        { label: "Location", value: `${form.city}, ${form.country}` },
                                        { label: "Specialty", value: form.specialty },
                                        { label: "Role", value: form.role },
                                        { label: "Institution", value: form.institution },
                                    ].map((row, i) => (
                                        <div key={i}>
                                            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-0.5">{row.label}</p>
                                            <p className="text-slate-300 font-semibold text-xs truncate">{row.value || "—"}</p>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className={labelClass}>Professional Bio <span className="text-slate-600 normal-case">(min 50 characters)</span></label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Share your clinical background, areas of interest, and what you hope to contribute to the Med-Share Africa network..."
                                        className={inputClass("bio") + " resize-none"}
                                    />
                                    <div className="flex justify-between mt-1 px-1">
                                        {errors.bio ? <p className="text-red-400 text-xs font-bold">{errors.bio}</p> : <span />}
                                        <p className={`text-xs font-bold ${form.bio.length >= 50 ? "text-emerald-500" : "text-slate-600"}`}>{form.bio.length} / 50</p>
                                    </div>
                                </div>

                                {/* Terms Agreement */}
                                <label className="flex items-start gap-4 cursor-pointer group">
                                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${form.agreeToTerms ? "bg-emerald-500 border-emerald-500" : "border-white/20 bg-transparent group-hover:border-amber-500/50"}`}>
                                        {form.agreeToTerms && <FiCheck className="text-[#050505] text-xs font-black" />}
                                        <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={handleChange} className="sr-only" />
                                    </div>
                                    <span className="text-sm text-slate-400 leading-relaxed">
                                        I confirm the accuracy of the information provided and agree to the{" "}
                                        <Link href="#" className="text-amber-400 font-bold hover:text-amber-300">Clinical Practice Terms</Link>,{" "}
                                        <Link href="#" className="text-amber-400 font-bold hover:text-amber-300">Privacy Policy</Link>, and{" "}
                                        <Link href="#" className="text-amber-400 font-bold hover:text-amber-300">Community Standards</Link> of Med-Share Africa.
                                    </span>
                                </label>
                                {errors.agreeToTerms && <p className="text-red-400 text-xs font-bold ml-1">{errors.agreeToTerms}</p>}

                                {serverError && (
                                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-sm text-red-400 font-bold">
                                        <FiAlertTriangle className="shrink-0 mt-0.5" />
                                        {serverError}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className={`flex mt-10 gap-4 ${step > 0 ? "justify-between" : "justify-end"}`}>
                            {step > 0 && (
                                <button type="button" onClick={prevStep} className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 font-bold transition-all">
                                    <FiChevronLeft /> Previous
                                </button>
                            )}
                            {step < 2 ? (
                                <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)]">
                                    Continue <FiChevronRight />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-10 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-[#050505] font-black transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-60"
                                >
                                    {loading ? <FiLoader className="animate-spin text-xl" /> : <>Submit Application <FiCheck /></>}
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Social Auth Alternative */}
                <div className="mt-10 text-center">
                    <p className="text-slate-500 text-sm mb-5 uppercase tracking-widest text-xs font-bold">— or register instantly with —</p>
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/tips" })}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all text-slate-200 font-bold shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                    <p className="text-slate-600 text-xs mt-6">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-amber-400 font-bold hover:text-amber-300">
                            Access the Clinical Portal
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
