"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { Home, Compass, MessageSquare, User, Users, Bell, LogOut, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/actions/auth-actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchInput } from "@/components/explore/SearchInput";
import { useChatStore } from "@/lib/store";

import { NotificationDropdown } from "@/components/shared/NotificationDropdown";
import { useState } from "react";
import Magnetic from "@/components/shared/Magnetic";
import { DecryptedText } from "@/components/shared/DecryptedText";
import { CyberPulse } from "@/components/shared/CyberPulse";

export const Navbar = () => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const unreadCount = useChatStore((state) => state.unreadCount);
    const isPersonalUser = session?.user?.email?.toLowerCase().includes("jeevansaji2107");
    const [showNotifications, setShowNotifications] = useState(false);

    const tabs = [
        { href: "/feed", icon: Home, label: "Feed" },
        { href: "/explore", icon: Compass, label: "Explore" },
        { href: "/groups", icon: Users, label: "Groups" },
        { href: "/chat", icon: MessageSquare, label: "Chat" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    if (pathname.startsWith("/auth")) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border transition-all">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-4">
                        <Link href="/feed" className="flex items-center hover:opacity-80 transition-opacity">
                            <Logo size="sm" />
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname === tab.href || (tab.href === "/profile" && pathname.startsWith("/profile"));
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`relative flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-semibold transition-all group/nav ${isActive ? "text-primary" : "text-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 z-10" />
                                    <span className="z-10">
                                        <DecryptedText
                                            text={tab.label}
                                            animateOnMount={false}
                                            useHover={true}
                                            speed={40}
                                            maxIterations={8}
                                        />
                                    </span>
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover/nav:opacity-100 transition-opacity">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover/nav:animate-[shimmer_2s_infinite]" />
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-pill"
                                            className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 30,
                                                mass: 1
                                            }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="hidden lg:block w-72">
                        <SearchInput />
                    </div>

                    <div className="flex items-center space-x-4">
                        {session?.user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={`/profile/${session.user.id}`}
                                    className="flex items-center space-x-2 p-1 pr-4 rounded-full border border-border hover:bg-secondary transition-all group/profile"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-secondary border border-white/5">
                                        {(session.user.email?.toLowerCase() === "maddy@connect.social") ? (
                                            <Image
                                                src="https://i.pinimg.com/736x/13/f4/ed/13f4ed13e9d297b674b36cff7f8e273f.jpg"
                                                alt=""
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        ) : isPersonalUser ? (
                                            <Image
                                                src={session.user.image || "https://i.pinimg.com/736x/a3/27/bf/a327bf02ee0174a438746cc99a1c9e15.jpg"}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        ) : session.user.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-primary text-xs font-bold">
                                                {session.user.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-sm font-black text-foreground truncate max-w-[150px] hidden sm:block uppercase tracking-tighter">
                                        {isPersonalUser ? "JEEVAN SAJI" : session.user.name}
                                    </span>
                                </Link>

                                <div className="relative">
                                    <Magnetic>
                                        <button
                                            onClick={() => setShowNotifications(!showNotifications)}
                                            className={`p-2 rounded-full transition-all ${showNotifications ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
                                            title="Notifications"
                                        >
                                            <Bell className="w-5 h-5" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                                            )}
                                        </button>
                                    </Magnetic>
                                    <NotificationDropdown isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                                </div>

                                <Magnetic>
                                    <button
                                        onClick={() => logout()}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4.5 h-4.5" />
                                    </button>
                                </Magnetic>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-hover transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
