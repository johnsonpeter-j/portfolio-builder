import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/models/Profile";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const profile = await Profile.findOne({ _id: id, userId: session.user.id });

    if (!profile) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
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

        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: data },
            { new: true }
        );

        if (!updatedProfile) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProfile);
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

    const deleted = await Profile.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!deleted) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
}

