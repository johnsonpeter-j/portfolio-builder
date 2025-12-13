export interface SocialLink {
    platform: string;
    link: string;
}

export interface Project {
    title: string;
    description: string;
    link?: string;
    githubLink?: string;
    image?: string;
}

export interface SkillSimple {
    name: string;
}

export interface SkillWithIcon {
    name: string;
    icon?: string;
}

export interface SkillCategory {
    title: string;
    skills: string[];
}

export interface Experience {
    company: string;
    position: string;
    startDate: string;
    endDate?: string; // Optional for current positions
    description?: string;
    location?: string;
    current?: boolean;
}

export interface PortfolioData {
    personalInfo: {
        name: string;
        title: string;
        bio: string;
        email: string;
        profilePhoto?: string; // URL to profile photo
        socials: SocialLink[];
    };
    projects: Project[];
    skills: string[] | SkillWithIcon[] | SkillCategory[];
    experience?: Experience[]; // Optional array of work experience
}

export interface TemplateProps {
    data: PortfolioData;
}
