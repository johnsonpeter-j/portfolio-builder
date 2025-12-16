import MinimalTemplate from "./Minimal";
import ModernTemplate from "./Modern";
import CreativeTemplate from "./creative";
import CorporateTemplate from "./corporate";
import Resume1Template from "./resume_1";
import { TemplateProps } from "@/app/types/portfolio";

export const templates: Record<string, React.FC<TemplateProps>> = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    corporate: CorporateTemplate,
    resume_1: Resume1Template,
};

export const templateList = [
    { id: "minimal", name: "Minimalist", description: "Clean, text-focused design for professionals." },
    { id: "modern", name: "Modern Dark", description: "Sleek, dark-themed design with gradients." },
    { id: "creative", name: "Creative", description: "Bold, artistic design with vibrant colors and animations." },
    { id: "corporate", name: "Corporate", description: "Professional, business-focused design for corporate portfolios." },
    { id: "resume_1", name: "Resume Style", description: "Traditional resume format, perfect for job applications." },
];
