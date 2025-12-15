"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LayoutDashboard, LogOut, Sparkles, User } from "lucide-react";

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    
    // Hide navbar on auth pages, public portfolio pages, and preview page
    if (pathname?.startsWith("/auth") || pathname?.startsWith("/p/") || pathname?.startsWith("/create/preview")) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href={session ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
                        <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                            Portfolio Builder
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {session ? (
                            <>
                                <Link href="/profiles">
                                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Profiles
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/signin">
                                    <Button variant="ghost" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

