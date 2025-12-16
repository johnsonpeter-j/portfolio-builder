"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ConfirmModal } from "@/app/components/ui/confirm-modal";
import { Edit2, Trash2, Plus, User, Calendar, ArrowRight } from "lucide-react";

interface ProfileItem {
    _id: string;
    name: string;
    description?: string;
    updatedAt: string;
}

export default function ProfilesPage() {
    const { data: session, status } = useSession();
    const [profiles, setProfiles] = useState<ProfileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; profileId: string | null }>({
        isOpen: false,
        profileId: null,
    });
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            fetchProfiles();
        }
    }, [status, router]);

    const fetchProfiles = async () => {
        try {
            const res = await fetch("/api/profiles");
            if (res.ok) {
                const data = await res.json();
                setProfiles(data);
            }
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        } finally {
            setLoading(false);
        }
    };

    const createProfile = async () => {
        router.push("/profiles/new");
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, profileId: id });
    };

    const deleteProfile = async () => {
        if (!deleteModal.profileId) return;

        try {
            const res = await fetch(`/api/profiles/${deleteModal.profileId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProfiles(profiles.filter((p) => p._id !== deleteModal.profileId));
            }
        } catch (error) {
            console.error("Failed to delete", error);
        } finally {
            setDeleteModal({ isOpen: false, profileId: null });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading profiles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                            My Profiles
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your saved user details and reuse them across multiple portfolios
                        </p>
                    </div>
                    <Button onClick={createProfile} size="lg" className="gap-2">
                        <Plus size={18} />
                        <span className="hidden sm:inline">Create New Profile</span>
                        <span className="sm:hidden">New</span>
                    </Button>
                </div>

                {profiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-sm text-center">
                        <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl mb-6">
                            <User size={40} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No profiles yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                            Create a profile to save your personal information, projects, and experience. You can reuse these profiles with different templates.
                        </p>
                        <Button onClick={createProfile} size="lg" className="gap-2">
                            <Plus size={18} />
                            Create Your First Profile
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {profiles.map((profile) => (
                            <div
                                key={profile._id}
                                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2">
                                                {profile.name || "Untitled Profile"}
                                            </h3>
                                            {profile.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                    {profile.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
                                        <Calendar size={14} />
                                        <span>Updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <Link href={`/profiles/${profile._id}`} className="flex-1">
                                            <Button variant="secondary" className="w-full gap-2" size="sm">
                                                <Edit2 size={14} />
                                                Edit
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => handleDeleteClick(profile._id)}
                                            variant="outline"
                                            className="flex-1 gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
                                            size="sm"
                                            aria-label="Delete profile"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, profileId: null })}
                    onConfirm={deleteProfile}
                    title="Delete Profile"
                    message="Are you sure you want to delete this profile? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                />
            </div>
        </div>
    );
}

