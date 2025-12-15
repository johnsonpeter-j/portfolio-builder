import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                await connectToDatabase();

                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Invalid credentials");
                }

                return { id: user._id.toString(), email: user.email, name: user.name, image: user.image };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: parseInt(process.env.JWT_EXPIRES_IN || "30") * 24 * 60 * 60, // Default 30 days in seconds
    },
    jwt: {
        maxAge: parseInt(process.env.JWT_EXPIRES_IN || "30") * 24 * 60 * 60, // Default 30 days in seconds
        secret: process.env.JWT_SECRET || process.env.AUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.iat = Math.floor(Date.now() / 1000);
                token.exp = Math.floor(Date.now() / 1000) + (parseInt(process.env.JWT_EXPIRES_IN || "30") * 24 * 60 * 60);
            }
            
            // Update session trigger
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.email) token.email = session.email;
                if (session.image) token.image = session.image;
            }
            
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.JWT_SECRET || process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
