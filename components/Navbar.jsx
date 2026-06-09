"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { LuUserRound } from "react-icons/lu";
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { FiUser, FiUpload, FiBookOpen, FiLogOut, FiChevronDown } from "react-icons/fi";

export default function Navbar() {
    const { data: session } = useSession();
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { label: "Dashboard", url: "/" },
        { label: "Clinical Journal", url: "/tips" },
        { label: "Publish", url: "/upload" },
        { label: "Network", url: "/contact" },
    ];

    const dropdownItems = [
        { label: "Clinical Profile", url: "/profile", icon: FiUser, desc: "Manage your credentials" },
        { label: "Publish Journal", url: "/upload", icon: FiUpload, desc: "Share clinical intelligence" },
        { label: "Browse Journal", url: "/tips", icon: FiBookOpen, desc: "Explore community records" },
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
            <nav className={`mx-auto max-w-7xl px-6 py-3 transition-all duration-300 ${scrolled ? "glass-panel rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : "bg-transparent"}`}>
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href={"/"} className="flex items-center gap-3 z-50 group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                            <span className="text-amber-400 font-black text-xl font-[family-name:var(--font-playfair)]">M</span>
                        </div>
                        <span className="flex flex-col justify-center">
                            <p className="font-bold text-slate-100 tracking-wide text-sm leading-tight">MED-SHARE</p>
                            <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Africa</p>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((item, i) => (
                            <Link
                                key={i}
                                href={item.url}
                                className="text-sm font-semibold text-slate-400 hover:text-amber-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <div className="relative" ref={dropdownRef}>
                                {/* Avatar Button */}
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-amber-500/20 bg-white/5 hover:bg-white/10 hover:border-amber-500/40 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-500/30">
                                        {session?.user?.image ? (
                                            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                        ) : (
                                            <div className="w-full h-full bg-emerald-900/50 flex items-center justify-center">
                                                <FiUser className="text-emerald-400 text-xs" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-bold text-slate-200 leading-tight max-w-[100px] truncate">{session.user?.name?.split(" ")[0]}</span>
                                        <span className="text-[9px] text-emerald-500 uppercase tracking-wider font-bold">Verified</span>
                                    </div>
                                    <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-amber-400" : ""}`} />
                                </button>

                                {/* Custom Dropdown */}
                                <div className={`absolute right-0 top-full mt-3 w-64 rounded-[1.25rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-amber-500/15 bg-[#0A0A0A] transition-all duration-200 origin-top-right ${dropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                                    {/* Header */}
                                    <div className="p-4 bg-gradient-to-br from-emerald-900/30 to-[#0A0A0A] border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/30 shrink-0">
                                                {session?.user?.image ? (
                                                    <img src={session.user.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <div className="w-full h-full bg-emerald-900/50 flex items-center justify-center">
                                                        <FiUser className="text-emerald-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-100 truncate">{session.user?.name}</p>
                                                <p className="text-[10px] text-slate-500 truncate">{session.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2">
                                        {dropdownItems.map((item, i) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={i}
                                                    href={item.url}
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent transition-all group/item"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover/item:bg-emerald-500/20 group-hover/item:border-emerald-500/30 transition-all shrink-0">
                                                        <Icon className="text-slate-400 group-hover/item:text-emerald-400 text-sm transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-200 group-hover/item:text-emerald-400 transition-colors leading-tight">{item.label}</p>
                                                        <p className="text-[10px] text-slate-600 font-medium">{item.desc}</p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Divider + Sign Out */}
                                    <div className="p-2 pt-0 border-t border-white/5 mt-1">
                                        <button
                                            onClick={() => { setDropdownOpen(false); signOut(); }}
                                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group/signout mt-1"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover/signout:bg-red-500/20 group-hover/signout:border-red-500/30 transition-all shrink-0">
                                                <FiLogOut className="text-slate-500 group-hover/signout:text-red-400 text-sm transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-400 group-hover/signout:text-red-400 transition-colors leading-tight">Secure Logout</p>
                                                <p className="text-[10px] text-slate-600 font-medium">End your clinical session</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/signin" className="text-sm font-bold text-slate-400 hover:text-amber-400 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/signup" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 text-[#050505] text-sm font-black hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                                    <LuUserRound className="text-base" />
                                    Join Network
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setNavOpen(!navOpen)}
                        className="md:hidden z-50 text-2xl text-slate-300 hover:text-amber-400 transition-colors"
                    >
                        {navOpen ? <IoMdClose /> : <RiMenu3Fill />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav Overlay */}
            <div className={`fixed inset-0 bg-[#050505]/98 backdrop-blur-2xl z-40 transition-all duration-500 flex flex-col items-center justify-center gap-8 ${navOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                {navLinks.map((item, i) => (
                    <Link
                        key={i}
                        href={item.url}
                        onClick={() => setNavOpen(false)}
                        className="text-2xl font-black tracking-widest text-slate-300 hover:text-amber-400 hover:scale-110 transition-all"
                    >
                        {item.label}
                    </Link>
                ))}
                {session ? (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        {/* Mobile user pill */}
                        <div className="flex items-center gap-3 px-6 py-3 rounded-full glass-panel border border-amber-500/20">
                            {session.user?.image && (
                                <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-amber-500/30" referrerPolicy="no-referrer" />
                            )}
                            <div className="text-left">
                                <p className="text-sm font-black text-slate-200">{session.user?.name?.split(" ")[0]}</p>
                                <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">Verified</p>
                            </div>
                        </div>
                        <Link href="/profile" onClick={() => setNavOpen(false)} className="px-8 py-3 rounded-full border border-amber-500/30 text-amber-400 font-bold text-sm">Clinical Profile</Link>
                        <button onClick={() => { setNavOpen(false); signOut(); }} className="px-8 py-3 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/30 text-sm">
                            Secure Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <Link href="/signin" onClick={() => setNavOpen(false)} className="text-lg font-bold text-slate-400 hover:text-amber-400 transition-colors">Sign In</Link>
                        <Link href="/signup" onClick={() => setNavOpen(false)} className="px-10 py-4 rounded-full bg-amber-500 text-[#050505] font-black text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                            Join Network
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}