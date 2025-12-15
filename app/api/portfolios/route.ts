import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
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
        const { templateId, title, description, content } = await req.json();

        if (!templateId) {
            return NextResponse.json({ message: "Template ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Use provided content or create default content
        const portfolioContent = content || {
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
        };

        const newPortfolio = await Portfolio.create({
            userId: session.user.id,
            templateId,
            slug: nanoid(10), // Random unique slug
            title: title || "My Portfolio", // Use provided title or default
            description: description || "", // Use provided description or empty
            hasBeenEdited: false, // Will be set to true when user first saves changes
            content: portfolioContent,
        });

        return NextResponse.json(newPortfolio, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
