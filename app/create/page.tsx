"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { templateList } from "@/app/components/templates/registry";
import { Button } from "@/app/components/ui/button";
import { Sparkles, ArrowRight, Eye, Save, User, Layout, CheckCircle2, Loader2, Plus, FileText, Palette, AlertCircle, ArrowLeft } from "lucide-react";
import { PortfolioData } from "@/app/types/portfolio";

interface ProfileItem {
    _id: string;
    name: string;
    description?: string;
    content: PortfolioData;
}

function CreatePortfolioContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [profiles, setProfiles] = useState<ProfileItem[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const [portfolioTitle, setPortfolioTitle] = useState("");
    const [portfolioDescription, setPortfolioDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            fetchProfiles();
            
            // Restore selections from URL params (when coming back from preview)
            const templateParam = searchParams.get("template");
            const profileParam = searchParams.get("profile");
            const titleParam = searchParams.get("title");
            const descParam = searchParams.get("description");
            
            if (templateParam) {
                setSelectedTemplate(templateParam);
            }
            if (profileParam) {
                setSelectedProfile(profileParam);
            }
            if (titleParam) {
                setPortfolioTitle(decodeURIComponent(titleParam));
            }
            if (descParam) {
                setPortfolioDescription(decodeURIComponent(descParam));
            }
        }
    }, [status, router, searchParams]);

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

    const handleSave = async () => {
        if (!selectedTemplate || !selectedProfile) {
            alert("Please select both a template and a profile");
            return;
        }

        setSaving(true);
        try {
            const profile = profiles.find(p => p._id === selectedProfile);
            if (!profile) {
                throw new Error("Profile not found");
            }

            const res = await fetch("/api/portfolios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    templateId: selectedTemplate,
                    profileId: selectedProfile,
                    title: portfolioTitle || "My Portfolio",
                    description: portfolioDescription || "",
                }),
            });

            if (res.ok) {
                const newPortfolio = await res.json();
                router.push(`/dashboard`);
            } else {
                throw new Error("Failed to create portfolio");
            }
        } catch (error) {
            console.error("Failed to create portfolio", error);
            alert("Failed to create portfolio. Please try again.");
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    const stepsCompleted = [
        selectedProfile !== null,
        selectedTemplate !== null,
    ];
    const totalSteps = 2;
    const completedSteps = stepsCompleted.filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                        <Sparkles className="h-4 w-4" />
                        <span>Create Your Portfolio</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Create New Portfolio
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                        Select a template and profile to create your portfolio. You can customize everything later.
                    </p>
                    
                    {/* Progress Indicator */}
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Step {completedSteps} of {totalSteps}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {Math.round((completedSteps / totalSteps) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-1 gap-8">
                    {/* Selection Panel */}
                    <div className="space-y-6 max-w-3xl mx-auto">
                        {/* Profile Selection */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Profile</h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Profile data will be copied as starting point. Portfolio edits are independent.</p>
                                    </div>
                                </div>
                                {selectedProfile && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Selected</span>
                                    </div>
                                )}
                            </div>
                            
                            {profiles.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                        No profiles found
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                                        Create a profile to get started
                                    </p>
                                    <Button onClick={() => router.push("/profiles/new")} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Profile
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                    {profiles.map((profile) => (
                                        <button
                                            key={profile._id}
                                            onClick={() => setSelectedProfile(profile._id)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                                                selectedProfile === profile._id
                                                    ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-md"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${
                                                            selectedProfile === profile._id ? "text-indigo-900 dark:text-indigo-100" : ""
                                                        }`}>
                                                            {profile.name}
                                                        </h3>
                                                    </div>
                                                    {profile.description && (
                                                        <p className={`text-sm truncate ${
                                                            selectedProfile === profile._id 
                                                                ? "text-indigo-700 dark:text-indigo-300" 
                                                                : "text-gray-600 dark:text-gray-400"
                                                        }`}>
                                                            {profile.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-shrink-0">
                                                    {selectedProfile === profile._id ? (
                                                        <div className="p-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full">
                                                            <CheckCircle2 className="h-5 w-5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="p-1.5 border-2 border-gray-300 dark:border-gray-600 rounded-full group-hover:border-indigo-400 dark:group-hover:border-indigo-500 transition-colors">
                                                            <div className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Template Selection */}
                        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Layout className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Template</h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Choose a design style</p>
                                    </div>
                                </div>
                                {selectedTemplate && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        <span className="text-xs font-medium text-green-700 dark:text-green-400">Selected</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {templateList.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                                            selectedTemplate === template.id
                                                ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-md"
                                                : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Palette className={`h-4 w-4 ${
                                                        selectedTemplate === template.id 
                                                            ? "text-purple-600 dark:text-purple-400" 
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`} />
                                                    <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${
                                                        selectedTemplate === template.id ? "text-purple-900 dark:text-purple-100" : ""
                                                    }`}>
                                                        {template.name}
                                                    </h3>
                                                </div>
                                                <p className={`text-sm line-clamp-2 ${
                                                    selectedTemplate === template.id 
                                                        ? "text-purple-700 dark:text-purple-300" 
                                                        : "text-gray-600 dark:text-gray-400"
                                                }`}>
                                                    {template.description}
                                                </p>
                                            </div>
                                            <div className="ml-3 flex-shrink-0">
                                                {selectedTemplate === template.id ? (
                                                    <div className="p-1.5 bg-purple-600 dark:bg-purple-500 rounded-full">
                                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 border-2 border-gray-300 dark:border-gray-600 rounded-full group-hover:border-purple-400 dark:group-hover:border-purple-500 transition-colors">
                                                        <div className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Portfolio Info */}
                        {(selectedTemplate && selectedProfile) && (
                            <section className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Info</h2>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Final details</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-1">
                                            Portfolio Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="My Portfolio"
                                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                            value={portfolioTitle}
                                            onChange={(e) => setPortfolioTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="A brief description of this portfolio..."
                                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                            value={portfolioDescription}
                                            onChange={(e) => setPortfolioDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Actions */}
                        {(selectedTemplate && selectedProfile) ? (
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    variant="ghost"
                                    className="gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    size="lg"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Go Back
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (selectedProfile && selectedTemplate) {
                                            // Preserve selections and form data in URL when navigating to preview
                                            const params = new URLSearchParams({
                                                template: selectedTemplate,
                                                profile: selectedProfile,
                                            });
                                            if (portfolioTitle.trim()) {
                                                params.set("title", portfolioTitle.trim());
                                            }
                                            if (portfolioDescription.trim()) {
                                                params.set("description", portfolioDescription.trim());
                                            }
                                            router.push(`/create/preview?${params.toString()}`);
                                        }
                                    }}
                                    variant="outline"
                                    className="flex-1 gap-2 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    size="lg"
                                >
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving || !portfolioTitle.trim()}
                                    className="flex-1 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                                    size="lg"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save
                                        </>
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                                        Selection Required
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300">
                                        Please select both a profile and a template to continue
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CreatePortfolioPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        }>
            <CreatePortfolioContent />
        </Suspense>
    );
}

