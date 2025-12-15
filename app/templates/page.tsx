"use client";

import { templateList } from "@/app/components/templates/registry";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Sparkles, ArrowRight, Palette, Check, Eye, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function TemplatesPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchProfiles();
        }
    }, [session]);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                        <Palette className="h-4 w-4" />
                        <span>Choose Your Style</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose a Template
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                        Select a template and profile to create your portfolio. You can always customize it later.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Button onClick={() => router.push("/create")} size="lg" className="gap-2">
                            <Sparkles size={18} />
                            Create Portfolio
                            <ArrowRight size={18} />
                        </Button>
                        <Button onClick={() => router.push("/profiles")} variant="outline" size="lg" className="gap-2">
                            <User size={18} />
                            Manage Profiles
                        </Button>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {templateList.map((template) => (
                        <div
                            key={template.id}
                            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Template Preview */}
                            <div className="relative h-64 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]"></div>
                                <div className="relative z-10 text-center p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Sparkles className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {template.name}
                                    </h3>
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 dark:group-hover:bg-indigo-600/5 transition-colors duration-300"></div>
                            </div>

                            {/* Template Info */}
                            <div className="p-6">
                                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                                    {template.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={() => router.push(`/templates/preview/${template.id}`)}
                                        variant="outline"
                                        className="w-full sm:flex-1 gap-2 whitespace-nowrap"
                                        size="lg"
                                    >
                                        <Eye className="h-4 w-4 flex-shrink-0" />
                                        View Sample
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/create")}
                                        className="w-full sm:flex-1 gap-2 whitespace-nowrap"
                                        size="lg"
                                    >
                                        Use Template
                                        <ArrowRight className="h-4 w-4 flex-shrink-0" />
                                    </Button>
                                </div>
                            </div>

                            {/* Features Badge */}
                            <div className="px-6 pb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Check className="h-3 w-3 text-green-500" />
                                    <span>Fully customizable</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Need help choosing? All templates are fully customizable and can be changed anytime.
                    </p>
                </div>
            </div>
        </div>
    );
}
