import { connectToDatabase } from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import Profile from "@/models/Profile";
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
    
    if (!portfolio) {
        return null;
    }

    // If portfolio has profileId, fetch latest content from profile
    if (portfolio.profileId) {
        const profile = await Profile.findById(portfolio.profileId);
        if (profile) {
            const portfolioObj = portfolio.toObject();
            portfolioObj.content = profile.content;
            return portfolioObj;
        }
    }

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
        <TemplateComponent data={portfolioData} />
    );
}
