import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";

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

        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: data },
            { new: true }
        );

        if (!updatedPortfolio) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
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
