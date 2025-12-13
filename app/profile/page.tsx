"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        // NOTE: This is a placeholder. You'd need an API route to update the user in DB.
        // For MVP, we will just simulate success or implement the API if critical.
        // Let's implement a quick API or just show it's a demo.

        // Ideally: POST /api/user/profile { name }
        setMessage("Profile updates are not fully wired to the DB in this demo, but the session would update.");
        await update({ name });
    };

    if (!session) {
        return <div className="p-8 text-center">Please sign in to view profile.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <div className="bg-white p-8 rounded-lg shadow border">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {session.user.name?.[0] || "U"}
                    </div>
                    <div>
                        <p className="font-bold text-lg">{session.user.name}</p>
                        <p className="text-gray-500">{session.user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border p-2 rounded-md"
                        />
                    </div>

                    {message && <p className="text-sm text-green-600">{message}</p>}

                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Update Profile
                    </button>

                    <div className="border-t pt-6 mt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/api/auth/signout")}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
