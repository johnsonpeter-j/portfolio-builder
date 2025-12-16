import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import Profile from "@/models/Profile";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // Note: We might want public access to this for the builder preview if we fetch differently,
    // but usually the builder should be protected. 
    // For the PUBLIC view (/p/[slug]), we will use a different route or logic.

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const portfolio = await Portfolio.findOne({ _id: id, userId: session.user.id });

    if (!portfolio) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // If portfolio has profileId, fetch latest content from profile
    if (portfolio.profileId) {
        const profile = await Profile.findOne({ _id: portfolio.profileId, userId: session.user.id });
        if (profile) {
            // Return portfolio with content from profile
            const portfolioObj = portfolio.toObject();
            portfolioObj.content = profile.content;
            return NextResponse.json(portfolioObj);
        }
    }

    return NextResponse.json(portfolio);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        await connectToDatabase();

        // Allow updating templateId, title, description, isPublished, profileId, and content
        // Content can be updated directly from the builder, or it can come from profile
        const allowedFields = ['templateId', 'title', 'description', 'isPublished', 'profileId', 'content', 'hasBeenEdited'];
        const updateData: any = {};
        
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }

        // If profileId is being updated, verify it belongs to user and update content
        if (updateData.profileId) {
            const profile = await Profile.findOne({ _id: updateData.profileId, userId: session.user.id });
            if (!profile) {
                return NextResponse.json({ message: "Profile not found" }, { status: 404 });
            }
            // Only update content from profile if content wasn't explicitly provided
            if (!updateData.content) {
                updateData.content = profile.content; // Update content from new profile
            }
        }

        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: updateData },
            { new: true }
        );

        if (!updatedPortfolio) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        // If portfolio has profileId, fetch latest content from profile
        if (updatedPortfolio.profileId) {
            const profile = await Profile.findOne({ _id: updatedPortfolio.profileId, userId: session.user.id });
            if (profile) {
                const portfolioObj = updatedPortfolio.toObject();
                portfolioObj.content = profile.content;
                return NextResponse.json(portfolioObj);
            }
        }

        return NextResponse.json(updatedPortfolio);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const deleted = await Portfolio.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deleted) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
}
