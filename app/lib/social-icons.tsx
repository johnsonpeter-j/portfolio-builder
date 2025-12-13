import { 
    Github, 
    Linkedin, 
    Twitter, 
    Instagram, 
    Facebook, 
    Youtube, 
    Globe, 
    Mail,
    Gitlab,
    X as XIcon,
    Code,
    Layers,
    PenTool
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export const socialMediaOptions = [
    { value: "GitHub", label: "GitHub" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "Twitter", label: "Twitter" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "YouTube", label: "YouTube" },
    { value: "Dribbble", label: "Dribbble" },
    { value: "Behance", label: "Behance" },
    { value: "Medium", label: "Medium" },
    { value: "CodePen", label: "CodePen" },
    { value: "Stack Overflow", label: "Stack Overflow" },
    { value: "GitLab", label: "GitLab" },
    { value: "Other", label: "Other" },
];

export function getSocialIcon(platform: string): LucideIcon {
    const normalizedPlatform = platform.toLowerCase().trim();
    
    if (normalizedPlatform.includes("github")) return Github;
    if (normalizedPlatform.includes("linkedin")) return Linkedin;
    if (normalizedPlatform.includes("twitter") || normalizedPlatform.includes("x.com")) return XIcon;
    if (normalizedPlatform.includes("instagram")) return Instagram;
    if (normalizedPlatform.includes("facebook")) return Facebook;
    if (normalizedPlatform.includes("youtube")) return Youtube;
    if (normalizedPlatform.includes("dribbble")) return PenTool; // Using PenTool as alternative
    if (normalizedPlatform.includes("behance")) return Layers; // Using Layers as alternative
    if (normalizedPlatform.includes("medium")) return PenTool; // Using PenTool as alternative
    if (normalizedPlatform.includes("codepen")) return Code; // Using Code as alternative
    if (normalizedPlatform.includes("stackoverflow") || normalizedPlatform.includes("stack overflow")) return Code; // Using Code as alternative
    if (normalizedPlatform.includes("gitlab")) return Gitlab;
    
    return Globe; // Default icon
}

