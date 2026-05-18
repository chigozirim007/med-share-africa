"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LuUserRound } from "react-icons/lu";
import { RiMenu3Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';


export default function Navbar() {

    const { data: session } = useSession()
    // console.log(session);


    const [navOpen, setNavOpen] = useState(false)

    const navLinks = [
        {
            label: "Home",
            url: "/"
        },
        {
            label: "Health Tips",
            url: "/tips"
        },
        {
            label: "Upload Tip",
            url: "/upload"
        },
        {
            label: "Contact Us",
            url: "/contact"
        },
    ]

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <main className="flex items-center justify-between px-6 py-3 shadow-md bg-white sticky top-0 z-50">
            <Link href={"/"} className="flex items-center gap-1 z-50">
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

            {/* desktop and tab navbar */}
            <div className="flex items-center gap-8 max-md:hidden">
                {
                    navLinks.map((item, i) => (
                        <Link key={i} className="text-lg hover:bg-[#67C090] py-1 px-2 border-b-6 border-white hover:border-[#468432] transition-all duration-200" href={item.url}>{item.label}</Link>
                    ))
                }
            </div>

            {/* mobile navbar */}
            <div className={`md:hidden bg-white h-dvh w-full absolute top-0 left-0 ${navOpen ? "flex" : "hidden"} flex-col items-center gap-10 pt-20`}>
                {
                    navLinks.map((item, i) => (
                        <Link key={i} className="text-lg hover:bg-[#67C090] py-1 px-2 border-b-6 border-white hover:border-[#468432] transition-all duration-200" href={item.url}>{item.label}</Link>
                    ))
                }
                {
                    session ? (
                        <div>
                            <button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <Avatar alt={session?.user?.name} src={session?.user?.image} />
                            </button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                slotProps={{
                                    list: {
                                        'aria-labelledby': 'basic-button',
                                    },
                                }}
                            >
                                <MenuItem onClick={handleClose}><Link href={"/profile"}>My Profile</Link></MenuItem>
                                <MenuItem onClick={handleClose}><Link href={"/upload"}>Upload Tip</Link></MenuItem>
                                <MenuItem onClick={handleClose}><button onClick={() => signOut()} className="bg-red-500 w-full text-red-100 m-0 py-1 rounded-md">Logout</button></MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <Link className="" href={"/signin"}><LuUserRound className="text-2xl" /></Link>
                    )
                }

            </div>

            <button onClick={() => setNavOpen(!navOpen)} className="md:hidden z-50 text-2xl">
                {
                    navOpen ?
                        <IoMdClose /> :
                        <RiMenu3Fill />
                }
            </button>

            <span className="max-md:hidden">

            {
                session ? (
                    <div>
                        <button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <Avatar alt={session?.user?.name} src={session?.user?.image} />
                        </button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                list: {
                                    'aria-labelledby': 'basic-button',
                                },
                            }}
                        >
                            <MenuItem onClick={handleClose}><Link href={"/profile"}>My Profile</Link></MenuItem>
                            <MenuItem onClick={handleClose}><Link href={"/upload"}>Upload Tip</Link></MenuItem>
                            <MenuItem onClick={handleClose}><button onClick={() => signOut()} className="bg-red-500 w-full text-red-100 m-0 py-1 rounded-md">Logout</button></MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <Link className="" href={"/signin"}><LuUserRound className="text-2xl" /></Link>
                )
            }
            </span>

        </main>
    )
}