import { notFound } from "next/navigation";
import { templates, templateList } from "@/app/components/templates/registry";
import { PortfolioData } from "@/app/types/portfolio";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

// Sample portfolio data for preview
const samplePortfolioData: PortfolioData = {
    personalInfo: {
        name: "John Doe",
        title: "Full Stack Developer",
        bio: "Passionate developer with 5+ years of experience building scalable web applications. I love creating beautiful, functional interfaces that users enjoy.",
        email: "john.doe@example.com",
        profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe",
        socials: [
            { platform: "GitHub", link: "https://github.com" },
            { platform: "LinkedIn", link: "https://linkedin.com" },
            { platform: "Twitter", link: "https://twitter.com" },
        ],
    },
    projects: [
        {
            title: "E-Commerce Platform",
            description: "A full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
            link: "https://example.com",
            githubLink: "https://github.com",
            image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800",
        },
        {
            title: "Task Management App",
            description: "Collaborative task management application with real-time updates and team collaboration features.",
            link: "https://example.com",
            githubLink: "https://github.com",
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
        },
        {
            title: "Weather Dashboard",
            description: "Beautiful weather dashboard with location-based forecasts and interactive maps.",
            link: "https://example.com",
            githubLink: "https://github.com",
            image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
        },
    ],
    skills: ["React", "TypeScript", "Node.js", "MongoDB", "TailwindCSS", "Next.js", "Python", "Docker"],
    experience: [
        {
            company: "Tech Corp",
            position: "Senior Full Stack Developer",
            startDate: "2022",
            endDate: "Present",
            current: true,
            location: "San Francisco, CA",
            description: "Leading development of customer-facing web applications. Mentoring junior developers and implementing best practices.",
        },
        {
            company: "StartupXYZ",
            position: "Full Stack Developer",
            startDate: "2020",
            endDate: "2022",
            location: "Remote",
            description: "Built and maintained multiple web applications using React and Node.js. Collaborated with cross-functional teams.",
        },
    ],
};

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ templateId: string }>;
}

export default async function TemplatePreviewPage({ params }: Props) {
    const { templateId } = await params;
    const template = templateList.find((t) => t.id === templateId);
    const TemplateComponent = templates[templateId];

    if (!template || !TemplateComponent) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header Bar */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/templates">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Templates
                                </Button>
                            </Link>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {template.name} - Sample Preview
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    This is a preview with sample data
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Preview */}
            <div className="w-full">
                <TemplateComponent data={samplePortfolioData} />
            </div>
        </div>
    );
}


