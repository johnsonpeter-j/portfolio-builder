import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/models/Profile";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Return all profiles for the user
    const profiles = await Profile.find({ 
        userId: session.user.id
    }).sort({ createdAt: -1 });

    return NextResponse.json(profiles);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, description, content } = await req.json();

        if (!name) {
            return NextResponse.json({ message: "Profile name is required" }, { status: 400 });
        }

        await connectToDatabase();

        const newProfile = await Profile.create({
            userId: session.user.id,
            name,
            description: description || "",
            content: content || {
                personalInfo: {
                    name: session.user.name || "My Name",
                    title: "Professional Title",
                    bio: "A short bio about myself.",
                    email: session.user.email,
                    profilePhoto: session.user.image || "",
                    socials: [],
                },
                projects: [],
                skills: [],
                experience: [],
            },
        });

        return NextResponse.json(newProfile, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

