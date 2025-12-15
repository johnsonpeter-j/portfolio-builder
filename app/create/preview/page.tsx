"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { templates } from "@/app/components/templates/registry";
import { PortfolioData } from "@/app/types/portfolio";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreatePreviewPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [templateId, setTemplateId] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const template = searchParams.get("template");
        const profileId = searchParams.get("profile");

        if (!template || !profileId) {
            setError("Missing template or profile information");
            setLoading(false);
            return;
        }

        setTemplateId(template);

        // Fetch profile data
        fetch(`/api/profiles/${profileId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch profile");
                return res.json();
            })
            .then((profile) => {
                setProfileData(profile.content);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile data");
                setLoading(false);
            });
    }, [searchParams]);

    const TemplateComponent = templateId ? templates[templateId] : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
                </div>
            </div>
        );
    }

    if (error || !TemplateComponent || !profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-xl">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Preview Error
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || "Unable to load preview. Please try again."}
                    </p>
                    <Button 
                        onClick={() => {
                            // Preserve template, profile, title, and description in URL when going back
                            const template = searchParams.get("template");
                            const profile = searchParams.get("profile");
                            const title = searchParams.get("title");
                            const description = searchParams.get("description");
                            
                            const params = new URLSearchParams();
                            if (template) params.set("template", template);
                            if (profile) params.set("profile", profile);
                            if (title) params.set("title", title);
                            if (description) params.set("description", description);
                            
                            router.push(`/create?${params.toString()}`);
                        }} 
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Create
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header Bar */}
            <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button 
                                onClick={() => {
                                    // Preserve template, profile, title, and description in URL when going back
                                    const template = searchParams.get("template");
                                    const profile = searchParams.get("profile");
                                    const title = searchParams.get("title");
                                    const description = searchParams.get("description");
                                    
                                    const params = new URLSearchParams();
                                    if (template) params.set("template", template);
                                    if (profile) params.set("profile", profile);
                                    if (title) params.set("title", title);
                                    if (description) params.set("description", description);
                                    
                                    router.push(`/create?${params.toString()}`);
                                }}
                                variant="ghost" 
                                size="sm" 
                                className="gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Create
                            </Button>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Live Preview
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Template: {templateId}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Preview */}
            <div className="w-full">
                <TemplateComponent data={profileData} />
            </div>
        </div>
    );
}

