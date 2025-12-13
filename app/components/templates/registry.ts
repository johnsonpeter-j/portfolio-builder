import MinimalTemplate from "./Minimal";
import ModernTemplate from "./Modern";
import NovaPlusTemplate from "./novaPlus";
import { TemplateProps } from "@/app/types/portfolio";

export const templates: Record<string, React.FC<TemplateProps>> = {
    minimal: MinimalTemplate,
    modern: ModernTemplate,
    novaPlus: NovaPlusTemplate,
};

export const templateList = [
    { id: "minimal", name: "Minimalist", description: "Clean, text-focused design for professionals." },
    { id: "modern", name: "Modern Dark", description: "Sleek, dark-themed design with gradients." },
    { id: "novaPlus", name: "Nova Plus", description: "Modern portfolio with gradient aesthetics and smooth animations." },
];
