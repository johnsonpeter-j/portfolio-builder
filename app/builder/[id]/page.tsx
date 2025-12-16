"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PortfolioData } from "@/app/types/portfolio";
import { templates, templateList } from "@/app/components/templates/registry";
import { Button } from "@/app/components/ui/button";
import { Save, X, Plus, Trash2, Globe, CheckCircle2, Circle, User, Briefcase, FileText, Code, Image as ImageIcon, Link as LinkIcon, Github, Building2, Calendar, MapPin, Share2, Upload, Loader2, Layout, Award, Mail, Phone } from "lucide-react";
import { Experience, Certificate } from "@/app/types/portfolio";

// Simple debounce hook for auto-saving (implementation inline for simplicity)
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function BuilderPage() {
    const { id } = useParams() as { id: string };
    const { status } = useSession();
    const router = useRouter();

    const [portfolio, setPortfolio] = useState<any>(null);
    const [data, setData] = useState<PortfolioData | null>(null);
    const [portfolioTitle, setPortfolioTitle] = useState("");
    const [portfolioDescription, setPortfolioDescription] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);

    // Fetch initial data
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }
        if (id && status === "authenticated") {
            fetch(`/api/portfolios/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Not found");
                    return res.json();
                })
                .then((p) => {
                    setPortfolio(p);
                    setPortfolioTitle(p.title || "My Portfolio");
                    setPortfolioDescription(p.description || "");
                    // Ensure all required fields exist
                    const content = {
                        ...p.content,
                        personalInfo: {
                            ...p.content.personalInfo,
                            email: p.content.personalInfo?.email || "",
                            phoneNo: p.content.personalInfo?.phoneNo || "",
                            profilePhoto: p.content.personalInfo?.profilePhoto || "",
                        },
                        experience: p.content.experience || [],
                        certificates: p.content.certificates || [],
                    };
                    setData(content);
                    setLoading(false);
                })
                .catch(() => router.push("/dashboard"));
        }
    }, [id, status, router]);

    // Saving logic
    const debouncedData = useDebounce(data, 1000); // Auto-save after 1s of inactivity
    const debouncedTitle = useDebounce(portfolioTitle, 1000);
    const debouncedDescription = useDebounce(portfolioDescription, 1000);

    const saveData = useCallback(async (newData: PortfolioData, title: string, description: string) => {
        setSaving(true);
        try {
            await fetch(`/api/portfolios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    content: newData,
                    title: title,
                    description: description,
                    hasBeenEdited: true, // Mark as edited when user saves changes
                }),
            });
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setSaving(false);
        }
    }, [id]);

    useEffect(() => {
        if (debouncedData && !loading) {
            saveData(debouncedData, debouncedTitle, debouncedDescription);
        }
    }, [debouncedData, debouncedTitle, debouncedDescription, loading, saveData]);


    const handleTemplateChange = async (newTemplateId: string) => {
        if (!portfolio || portfolio.templateId === newTemplateId) return;

        try {
            const response = await fetch(`/api/portfolios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateId: newTemplateId }),
            });

            if (response.ok) {
                setPortfolio({ ...portfolio, templateId: newTemplateId });
                setPreviewKey(prev => prev + 1); // Force preview update
            } else {
                alert("Failed to change template. Please try again.");
            }
        } catch (error) {
            console.error("Template change failed", error);
            alert("Failed to change template. Please try again.");
        }
    };

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading builder...</p>
                </div>
            </div>
        );
    }

    const TemplateComponent = templates[portfolio.templateId] || templates["minimal"];

    // FORM HANDLERS
    const updatePersonalInfo = (field: string, value: string) => {
        setData((prev) => {
            if (!prev) return null;
            return {
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
            };
        });
        setPreviewKey(prev => prev + 1); // Force re-render
    };

    // Profile photo upload handler
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an image (JPEG, PNG, WebP, or GIF).");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("File size too large. Maximum size is 5MB.");
            return;
        }

        setUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folderType", "profile");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Upload failed");
            }

            const result = await response.json();
            setData(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    personalInfo: { ...prev.personalInfo, profilePhoto: result.url }
                };
            });
            setPreviewKey(prev => prev + 1);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload image. Please try again.");
        } finally {
            setUploadingPhoto(false);
            // Reset input
            e.target.value = "";
        }
    };

    const addProject = () => {
        setData(prev => {
            if (!prev) return null;
            return {
            ...prev,
            projects: [...prev.projects, { title: "New Project", description: "Desc", link: "", githubLink: "" }]
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    const updateProject = (index: number, field: string, value: string) => {
        setData(prev => {
            if (!prev) return null;
            const newProjects = [...prev.projects];
            newProjects[index] = { ...newProjects[index], [field]: value };
            return { ...prev, projects: newProjects };
        });
        setPreviewKey(prev => prev + 1);
    };

    const removeProject = (index: number) => {
        setData(prev => {
            if (!prev) return null;
            return {
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    // Simple string[] handling for MVP skills
    const updateSkills = (value: string) => {
        // Expect comma separated
        setData(prev => {
            if (!prev) return null;
            return {
            ...prev,
            skills: value.split(",").map(s => s.trim())
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    // Social links handlers
    const addSocialLink = () => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    socials: [...prev.personalInfo.socials, { platform: "", link: "" }]
                }
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    const updateSocialLink = (index: number, field: "platform" | "link", value: string) => {
        setData(prev => {
            if (!prev) return null;
            const newSocials = [...prev.personalInfo.socials];
            newSocials[index] = { ...newSocials[index], [field]: value };
            return {
                ...prev,
                personalInfo: { ...prev.personalInfo, socials: newSocials }
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    const removeSocialLink = (index: number) => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    socials: prev.personalInfo.socials.filter((_, i) => i !== index)
                }
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    // Experience handlers
    const addExperience = () => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                experience: [...(prev.experience || []), {
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    location: "",
                    current: false
                }]
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
        setData(prev => {
            if (!prev) return null;
            const newExperience = [...(prev.experience || [])];
            newExperience[index] = { ...newExperience[index], [field]: value };
            return { ...prev, experience: newExperience };
        });
        setPreviewKey(prev => prev + 1);
    };

    const removeExperience = (index: number) => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                experience: (prev.experience || []).filter((_, i) => i !== index)
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    // Certificate handlers
    const addCertificate = () => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                certificates: [...(prev.certificates || []), {
                    name: "",
                    provider: "",
                    issuedOn: "",
                    certificateId: "",
                    certificateUrl: ""
                }]
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    const updateCertificate = (index: number, field: keyof Certificate, value: string) => {
        setData(prev => {
            if (!prev) return null;
            const newCertificates = [...(prev.certificates || [])];
            newCertificates[index] = { ...newCertificates[index], [field]: value };
            return { ...prev, certificates: newCertificates };
        });
        setPreviewKey(prev => prev + 1);
    };

    const removeCertificate = (index: number) => {
        setData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                certificates: (prev.certificates || []).filter((_, i) => i !== index)
            };
        });
        setPreviewKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* SIDEBAR EDITOR */}
            <aside className="w-full lg:w-96 xl:w-[420px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-10 shadow-lg">
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editor</h2>
                        <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Saved</span>
                                    </>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push("/dashboard")}
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {/* Portfolio Info */}
                    <section className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Portfolio Info</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Portfolio Name</label>
                                <input
                                    type="text"
                                    placeholder="My Portfolio"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={portfolioTitle}
                                    onChange={(e) => {
                                        setPortfolioTitle(e.target.value);
                                        setPreviewKey(prev => prev + 1);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
                                <textarea
                                    placeholder="A brief description of this portfolio..."
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={portfolioDescription}
                                    onChange={(e) => {
                                        setPortfolioDescription(e.target.value);
                                        setPreviewKey(prev => prev + 1);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                    <Layout className="h-3 w-3" />
                                    Template
                                </label>
                                <select
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={portfolio?.templateId || "minimal"}
                                    onChange={(e) => handleTemplateChange(e.target.value)}
                                >
                                    {templateList.map((template) => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Change template to preview your data with different styles
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Personal Info */}
                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Personal Info</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Name</label>
                            <input
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={data.personalInfo.name}
                                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Job Title</label>
                            <input
                                    type="text"
                                    placeholder="Your title"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={data.personalInfo.title}
                                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Bio</label>
                            <textarea
                                    placeholder="Tell us about yourself"
                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    value={data.personalInfo.bio}
                                    onChange={(e) => updatePersonalInfo("bio", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={data.personalInfo.email}
                                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 8900"
                                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        value={data.personalInfo.phoneNo}
                                        onChange={(e) => updatePersonalInfo("phoneNo", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                    <ImageIcon className="h-3 w-3" />
                                    Profile Photo
                                </label>
                                <div className="space-y-2">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        {uploadingPhoto ? (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Uploading...</p>
                                            </div>
                                        ) : data.personalInfo.profilePhoto ? (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <img
                                                    src={data.personalInfo.profilePhoto}
                                                    alt="Profile preview"
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 mb-2"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Click to change</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                        />
                                    </label>
                                    {data.personalInfo.profilePhoto && !uploadingPhoto && (
                                        <button
                                            type="button"
                                            onClick={() => updatePersonalInfo("profilePhoto", "")}
                                            className="w-full text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1"
                                        >
                                            Remove photo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Social Media Links */}
                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Social Media</h3>
                            </div>
                            <Button onClick={addSocialLink} size="sm" variant="secondary" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {data.personalInfo.socials.map((social, i) => (
                                <div key={i} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 relative">
                                    <button
                                        onClick={() => removeSocialLink(i)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded transition"
                                        aria-label="Remove social link"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                    <div className="space-y-2 pr-8">
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Platform</label>
                                            <select
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={social.platform}
                                                onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                                            >
                                                <option value="">Select platform</option>
                                                <option value="GitHub">GitHub</option>
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Twitter">Twitter</option>
                                                <option value="Instagram">Instagram</option>
                                                <option value="Facebook">Facebook</option>
                                                <option value="YouTube">YouTube</option>
                                                <option value="Dribbble">Dribbble</option>
                                                <option value="Behance">Behance</option>
                                                <option value="Medium">Medium</option>
                                                <option value="CodePen">CodePen</option>
                                                <option value="Stack Overflow">Stack Overflow</option>
                                                <option value="GitLab">GitLab</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                <LinkIcon className="h-3 w-3" />
                                                URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={social.link}
                                                onChange={(e) => updateSocialLink(i, "link", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.personalInfo.socials.length === 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                                    No social links added yet. Click "Add" to get started.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Skills</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Comma separated list</p>
                        <textarea
                            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={Array.isArray(data.skills) && typeof data.skills[0] === 'string' ? (data.skills as string[]).join(", ") : ""}
                            onChange={(e) => updateSkills(e.target.value)}
                            placeholder="React, TypeScript, Node.js"
                        />
                    </section>

                    {/* Projects */}
                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Projects</h3>
                            </div>
                            <Button onClick={addProject} size="sm" variant="secondary" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {data.projects.map((p, i) => (
                                <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 relative">
                                    <button
                                        onClick={() => removeProject(i)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded transition"
                                        aria-label="Remove project"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="space-y-3 pr-6">
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Title</label>
                                    <input
                                                type="text"
                                                placeholder="Project Title"
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={p.title}
                                                onChange={(e) => updateProject(i, "title", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
                                    <textarea
                                                placeholder="Project description"
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={p.description}
                                                onChange={(e) => updateProject(i, "description", e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                    <LinkIcon className="h-3 w-3" />
                                                    Live Link
                                                </label>
                                    <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={p.link || ""}
                                                    onChange={(e) => updateProject(i, "link", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                    <Github className="h-3 w-3" />
                                                    GitHub
                                                </label>
                                    <input
                                                    type="text"
                                                    placeholder="https://..."
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={p.githubLink || ""}
                                                    onChange={(e) => updateProject(i, "githubLink", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                <ImageIcon className="h-3 w-3" />
                                                Image URL
                                            </label>
                                    <input
                                                type="text"
                                                placeholder="https://unsplash.com/..."
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={p.image || ""}
                                                onChange={(e) => updateProject(i, "image", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Experience</h3>
                            </div>
                            <Button onClick={addExperience} size="sm" variant="secondary" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {(data.experience || []).map((exp, i) => (
                                <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 relative">
                        <button
                                        onClick={() => removeExperience(i)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded transition"
                                        aria-label="Remove experience"
                        >
                                        <Trash2 className="h-4 w-4" />
                        </button>
                                    <div className="space-y-3 pr-6">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    Company
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Company Name"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(i, "company", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Position</label>
                                                <input
                                                    type="text"
                                                    placeholder="Job Title"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={exp.position}
                                                    onChange={(e) => updateExperience(i, "position", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Start Date
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YYYY"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={exp.startDate}
                                                    onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">End Date</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YYYY or leave empty"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={exp.endDate || ""}
                                                    onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                                                    disabled={exp.current}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="City, Country"
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={exp.location || ""}
                                                onChange={(e) => updateExperience(i, "location", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Description</label>
                                            <textarea
                                                placeholder="Describe your role and achievements"
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={exp.description || ""}
                                                onChange={(e) => updateExperience(i, "description", e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`current-${i}`}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                                checked={exp.current || false}
                                                onChange={(e) => {
                                                    updateExperience(i, "current", e.target.checked);
                                                    if (e.target.checked) {
                                                        updateExperience(i, "endDate", "");
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`current-${i}`} className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                                                Current Position
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data.experience || data.experience.length === 0) && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                                    No experience added yet. Click "Add" to get started.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Certificates */}
                    <section className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="font-semibold text-gray-900 dark:text-white">Certificates</h3>
                            </div>
                            <Button onClick={addCertificate} size="sm" variant="secondary" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Add
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {(data.certificates || []).map((cert, i) => (
                                <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 relative">
                                    <button
                                        onClick={() => removeCertificate(i)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded transition"
                                        aria-label="Remove certificate"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="space-y-3 pr-6">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                    <Award className="h-3 w-3" />
                                                    Certificate Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Certificate Name"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={cert.name}
                                                    onChange={(e) => updateCertificate(i, "name", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Provider</label>
                                                <input
                                                    type="text"
                                                    placeholder="Issuing Organization"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={cert.provider}
                                                    onChange={(e) => updateCertificate(i, "provider", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Issued On
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YYYY"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={cert.issuedOn}
                                                    onChange={(e) => updateCertificate(i, "issuedOn", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Certificate ID</label>
                                                <input
                                                    type="text"
                                                    placeholder="Optional ID"
                                                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    value={cert.certificateId || ""}
                                                    onChange={(e) => updateCertificate(i, "certificateId", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block flex items-center gap-1">
                                                <LinkIcon className="h-3 w-3" />
                                                Certificate URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="https://..."
                                                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                value={cert.certificateUrl || ""}
                                                onChange={(e) => updateCertificate(i, "certificateUrl", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data.certificates || data.certificates.length === 0) && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
                                    No certificates added yet. Click "Add" to get started.
                                </p>
                            )}
                        </div>
                    </section>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
                        <Button
                            onClick={() => {
                                if (data) {
                                    saveData(data, portfolioTitle, portfolioDescription);
                                }
                            }}
                            disabled={saving}
                            className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            size="lg"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </aside>

            {/* PREVIEW AREA */}
            <main className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto relative">
                <div className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-10">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</h3>
                </div>
                <div className="p-4 lg:p-8">
                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden max-w-6xl mx-auto">
                        <div className="transform scale-[0.85] lg:scale-100 origin-top" key={previewKey}>
                        <TemplateComponent data={data} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
