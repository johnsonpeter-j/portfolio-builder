"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Edit2, Eye, Trash2, Plus, Layout, Calendar, Sparkles, ArrowRight, Globe, CheckCircle2 } from "lucide-react";

interface PortfolioItem {
    _id: string;
    title: string;
    description?: string;
    templateId: string;
    slug: string;
    isPublished: boolean;
    updatedAt: string;
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            fetchPortfolios();
        }
    }, [status, router]);

    const fetchPortfolios = async () => {
        try {
            const res = await fetch("/api/portfolios");
            if (res.ok) {
                const data = await res.json();
                setPortfolios(data);
            }
        } catch (error) {
            console.error("Failed to fetch portfolios", error);
        } finally {
            setLoading(false);
        }
    };

    const createPortfolio = async () => {
        router.push("/create");
    };

    const deletePortfolio = async (id: string) => {
        if (!confirm("Are you sure you want to delete this portfolio?")) return;

        try {
            const res = await fetch(`/api/portfolios/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setPortfolios(portfolios.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handlePublish = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/portfolios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !currentStatus }),
            });
            if (res.ok) {
                setPortfolios(portfolios.map((p) => 
                    p._id === id ? { ...p, isPublished: !currentStatus } : p
                ));
            }
        } catch (error) {
            console.error("Failed to update publish status", error);
            alert("Failed to update publish status. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
                            My Portfolios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your active projects and deployments
                        </p>
                    </div>
                    <Button onClick={createPortfolio} size="lg" className="gap-2">
                        <Plus size={18} />
                        <span className="hidden sm:inline">Create New Portfolio</span>
                        <span className="sm:hidden">New</span>
                    </Button>
                </div>

                {portfolios.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 shadow-sm text-center">
                        <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl mb-6">
                            <Layout size={40} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No portfolios yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                            Start by choosing a template and customizing it to fit your personal brand.
                        </p>
                        <Button onClick={createPortfolio} size="lg" className="gap-2">
                            <Sparkles size={18} />
                            Create Portfolio
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {portfolios.map((portfolio) => (
                            <div
                                key={portfolio._id}
                                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Status Bar */}
                                <div
                                    className={`h-1.5 w-full ${
                                        portfolio.isPublished
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                            : "bg-gray-200 dark:bg-gray-700"
                                    }`}
                                />

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition mb-2">
                                                {portfolio.title || "Untitled Portfolio"}
                                            </h3>
                                            {portfolio.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                    {portfolio.description}
                                                </p>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium capitalize bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                                                {portfolio.templateId} Template
                                            </span>
                                        </div>
                                        {portfolio.isPublished && (
                                            <span className="flex h-2.5 w-2.5 relative ml-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
                                        <Calendar size={14} />
                                        <span>Updated {new Date(portfolio.updatedAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <Link href={`/builder/${portfolio._id}`} className="flex-1">
                                            <Button variant="secondary" className="w-full gap-2" size="sm">
                                                <Edit2 size={14} />
                                                Edit
                                            </Button>
                                        </Link>

                                        <button
                                            onClick={() => handlePublish(portfolio._id, portfolio.isPublished)}
                                            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                                                portfolio.isPublished
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            }`}
                                            title={portfolio.isPublished ? "Click to unpublish" : "Click to publish"}
                                        >
                                            {portfolio.isPublished ? (
                                                <>
                                                    <CheckCircle2 size={14} />
                                                    Published
                                                </>
                                            ) : (
                                                <>
                                                    <Globe size={14} />
                                                    Publish
                                                </>
                                            )}
                                        </button>

                                        {portfolio.isPublished && (
                                            <Link href={`/p/${portfolio.slug}`} target="_blank">
                                                <Button variant="outline" className="gap-2" size="sm">
                                                    <Eye size={14} />
                                                    View
                                                </Button>
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => deletePortfolio(portfolio._id)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                            aria-label="Delete portfolio"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
