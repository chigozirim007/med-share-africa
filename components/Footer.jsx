import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";
import { Theme } from "./Theme";

export default function Footer() {
    return (
        <main style={{backgroundColor: Theme.secondaryGreen}} className="flex items-center justify-between px-10 py-3 max-lg:flex-col max-lg:gap-5 text-white">
            <Link href={"/"} className="flex items-center gap-1">
                <Image
                    src={"/logo.png"}
                    alt="logo"
                    width={500}
                    height={500}
                    className="w-10 h-10"
                />
                <span className="">
                    <p className="font-light">MedShare</p>
                    <p className="text-xs">Africa</p>
                </span>
            </Link>

            <div className="flex items-center gap-8 text-sm max-md:flex-col">
                <Link href={"#"}>Chat with us</Link>
                <Link href={"#"}>Privacy Policy</Link>
                <Link href={"#"}>Terms of Service</Link>
                <Link href={"#"}>Contact Support</Link>
            </div>

            <div className="flex items-center gap-3 text-xl">
                <FaFacebook />
                <FaInstagram />
                <BsTwitterX />
                <FaLinkedin />
            </div>
        </main>
    )
}