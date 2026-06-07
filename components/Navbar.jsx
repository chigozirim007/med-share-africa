"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LuUserRound } from "react-icons/lu";
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

export default function Navbar() {
    const { data: session } = useSession();
    const [navOpen, setNavOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Dashboard", url: "/" },
        { label: "Clinical Journal", url: "/tips" },
        { label: "Publish", url: "/upload" },
        { label: "Network", url: "/contact" },
    ];

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-4" : "py-6"}`}>
            <nav className={`mx-auto max-w-7xl px-6 py-3 transition-all duration-300 ${scrolled ? "glass-panel rounded-full" : "bg-transparent"}`}>
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
                                className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <div>
                                <button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    className="hover:scale-105 transition-transform"
                                >
                                    <Avatar alt={session?.user?.name} src={session?.user?.image} sx={{ width: 40, height: 40, border: '2px solid #D4AF37' }} />
                                </button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                                    PaperProps={{
                                        sx: {
                                            bgcolor: '#0A0A0A',
                                            color: '#F8FAFC',
                                            border: '1px solid rgba(212,175,55,0.2)',
                                            mt: 1.5,
                                        }
                                    }}
                                >
                                    <MenuItem onClick={handleClose} sx={{ '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' } }}>
                                        <Link href={"/profile"} className="w-full text-sm font-semibold text-amber-100">Clinical Profile</Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose} sx={{ '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' } }}>
                                        <Link href={"/upload"} className="w-full text-sm font-semibold text-amber-100">Publish Journal</Link>
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); signOut(); }} sx={{ '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                                        <span className="w-full text-sm font-semibold text-red-400">Secure Logout</span>
                                    </MenuItem>
                                </Menu>
                            </div>
                        ) : (
                            <Link href={"/signin"} className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-sm font-bold text-amber-400 hover:bg-amber-400 hover:text-[#050505] transition-all shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                                <LuUserRound className="text-lg" />
                                Portal Login
                            </Link>
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
                    <div className="flex flex-col items-center gap-6 mt-8">
                        <Link href="/profile" onClick={() => setNavOpen(false)} className="text-lg font-bold text-amber-400">Clinical Profile</Link>
                        <button onClick={() => { setNavOpen(false); signOut(); }} className="px-8 py-3 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/30">
                            Secure Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/signin" onClick={() => setNavOpen(false)} className="mt-8 px-10 py-4 rounded-full bg-amber-500 text-[#050505] font-bold text-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                        Portal Login
                    </Link>
                )}
            </div>
        </header>
    );
}