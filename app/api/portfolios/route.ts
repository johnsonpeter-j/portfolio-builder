import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import Profile from "@/models/Profile";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Return all portfolios for the user
    const portfolios = await Portfolio.find({ 
        userId: session.user.id
    }).sort({ createdAt: -1 });

    return NextResponse.json(portfolios);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { templateId, title, description, profileId, content } = await req.json();

        if (!templateId) {
            return NextResponse.json({ message: "Template ID is required" }, { status: 400 });
        }

        if (!profileId) {
            return NextResponse.json({ message: "Profile ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Verify profile belongs to user
        const profile = await Profile.findOne({ _id: profileId, userId: session.user.id });
        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        }

        const newPortfolio = await Portfolio.create({
            userId: session.user.id,
            templateId,
            profileId,
            slug: nanoid(10), // Random unique slug
            title: title || "My Portfolio", // Use provided title or default
            description: description || "", // Use provided description or empty
            // Store content for backward compatibility, but it will be fetched from profile
            content: profile.content,
        });

        return NextResponse.json(newPortfolio, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
