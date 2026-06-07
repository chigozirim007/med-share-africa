import Link from "next/link";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

export default function Footer() {
    return (
        <footer className="border-t border-amber-500/20 bg-[#020202]">
            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <Link href={"/"} className="flex items-center gap-3 z-50 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                        <span className="text-amber-400 font-black text-xl font-[family-name:var(--font-playfair)]">M</span>
                    </div>
                    <span className="flex flex-col justify-center text-left">
                        <p className="font-bold text-slate-100 tracking-wide text-sm leading-tight">MED-SHARE</p>
                        <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Africa</p>
                    </span>
                </Link>

                <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
                    <Link href={"#"} className="hover:text-amber-400 transition-colors">Clinical Support</Link>
                    <Link href={"#"} className="hover:text-amber-400 transition-colors">Patient Privacy</Link>
                    <Link href={"#"} className="hover:text-amber-400 transition-colors">Terms of Practice</Link>
                    <Link href={"#"} className="hover:text-amber-400 transition-colors">Specialist Network</Link>
                </div>

                <div className="flex items-center gap-5 text-lg text-emerald-600">
                    <Link href="#" className="hover:text-amber-400 transition-transform hover:scale-110"><FaFacebook /></Link>
                    <Link href="#" className="hover:text-amber-400 transition-transform hover:scale-110"><FaInstagram /></Link>
                    <Link href="#" className="hover:text-amber-400 transition-transform hover:scale-110"><BsTwitterX /></Link>
                    <Link href="#" className="hover:text-amber-400 transition-transform hover:scale-110"><FaLinkedin /></Link>
                </div>
            </div>
            
            <div className="border-t border-white/5 py-6 text-center text-xs text-slate-600 font-medium tracking-wide">
                &copy; {new Date().getFullYear()} MED-SHARE AFRICA. CLINICAL EXCELLENCE GUARANTEED.
            </div>
        </footer>
    )
}