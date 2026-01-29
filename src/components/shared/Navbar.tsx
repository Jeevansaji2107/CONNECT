"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";
import { Home, Compass, MessageSquare, User, Bell, LogOut, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { logout } from "@/lib/actions/auth-actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchInput } from "@/components/explore/SearchInput";

export const Navbar = () => {
    const { data: session } = useSession();
    const pathname = usePathname();

    const tabs = [
        { href: "/feed", icon: Home, label: "Feed" },
        { href: "/explore", icon: Compass, label: "Explore" },
        { href: "/chat", icon: MessageSquare, label: "Chat" },
        { href: "/profile", icon: User, label: "Profile" },
    ];

    if (pathname.startsWith("/auth")) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border transition-all">
            <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <Link href="/feed" className="flex items-center hover:opacity-80 transition-opacity">
                        <Logo size="sm" />
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname === tab.href || (tab.href === "/profile" && pathname.startsWith("/profile"));
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`relative flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 z-10" />
                                    <span className="z-10">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-pill"
                                            className="absolute inset-0 bg-primary/10 rounded-full"
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
                                    className="flex items-center space-x-2 p-1 pr-4 rounded-full border border-border hover:bg-secondary transition-all"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-secondary">
                                        {(session.user.image || session.user.email === "maddy@connect.social") ? (
                                            <Image
                                                src={session.user.email === "maddy@connect.social" ? "/avatars/maddy.png" : (session.user.image || "")}
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
                                    <span className="text-sm font-medium text-foreground truncate max-w-[100px] hidden sm:block">
                                        {session.user.name}
                                    </span>
                                </Link>

                                <button
                                    onClick={() => logout()}
                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4.5 h-4.5" />
                                </button>
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
