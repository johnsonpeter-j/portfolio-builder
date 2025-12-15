import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // If user is authenticated, allow access
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Check if token exists and is valid
                // NextAuth automatically validates JWT token
                return !!token;
            },
        },
        pages: {
            signIn: "/auth/signin",
        },
    }
);

// Protect these routes - require authentication
// Public routes (excluded): /, /auth/*, /p/* (public portfolios), /api/auth/*
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/builder/:path*",
        "/create/:path*",
        "/profiles/:path*",
        "/templates/:path*",
        "/api/portfolios/:path*",
        "/api/profiles/:path*",
        "/api/upload/:path*",
    ],
};

