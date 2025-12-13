import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { templates } from "@/app/components/templates/registry";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

// Ensure dynamic rendering
export const dynamic = 'force-dynamic';

async function getPortfolio(slug: string) {
    await connectToDatabase();
    const portfolio = await Portfolio.findOne({ slug, isPublished: true });
    return portfolio;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const portfolio = await getPortfolio(slug);
    if (!portfolio) return { title: 'Not Found' };

    return {
        title: `${portfolio.content.personalInfo.name} - Portfolio`,
        description: portfolio.content.personalInfo.bio,
    };
}

export default async function PublicPortfolioPage({ params }: Props) {
    const { slug } = await params;
    const portfolio = await getPortfolio(slug);

    if (!portfolio) {
        return notFound();
    }

    const TemplateComponent = templates[portfolio.templateId] || templates["minimal"];

    // Convert Mongoose document to plain object to avoid toJSON method issues
    const portfolioData = JSON.parse(JSON.stringify(portfolio.content));

    return (
        <>
            <TemplateComponent data={portfolioData} />
            {/* Branding Footer */}
            <footer className="py-6 text-center text-xs text-gray-500 bg-gray-50 border-t">
                <p>Built with <a href="/" className="font-bold hover:underline">Portfolio Builder</a></p>
            </footer>
        </>
    );
}
