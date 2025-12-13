"use client";

import { TemplateProps } from "@/app/types/portfolio";
import { ArrowUpRight, Mail, Github, Globe, MapPin, Calendar, Building2, ExternalLink } from "lucide-react";
import { getSocialIcon } from "@/app/lib/social-icons";

export default function MinimalTemplate({ data }: TemplateProps) {
    const { personalInfo, projects, skills, experience } = data;

    return (
        <div className="min-h-screen bg-white text-black font-sans antialiased">
            {/* Header / Hero */}
            <header className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 max-w-7xl mx-auto border-b border-gray-200">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start md:items-center">
                    {/* Profile Photo */}
                    {personalInfo.profilePhoto && (
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-900 shadow-xl mx-auto md:mx-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src={personalInfo.profilePhoto} 
                                    alt={personalInfo.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 w-full text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] mb-3 sm:mb-4">
                            {personalInfo.name}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
                            {personalInfo.title}
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-6 sm:mb-8 mx-auto md:mx-0">
                            {personalInfo.bio}
                        </p>

                        {/* Contact Links */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
                            <a 
                                href={`mailto:${personalInfo.email}`} 
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all group"
                            >
                                <Mail className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                                <span className="break-all">{personalInfo.email}</span>
                            </a>
                            {personalInfo.socials && personalInfo.socials.length > 0 && personalInfo.socials.map((s, i) => {
                                const SocialIcon = getSocialIcon(s.platform);
                                return s.link && s.platform && (
                                    <a 
                                        key={i} 
                                        href={s.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all group"
                                    >
                                        <SocialIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                                {s.platform}
                            </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* Experience Section */}
            {experience && experience.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 max-w-7xl mx-auto border-b border-gray-200">
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                            <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                            <span>Experience</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 text-center md:text-left">Professional journey</p>
                    </div>
                    <div className="space-y-6 sm:space-y-8">
                        {experience.map((exp, i) => (
                            <div key={i} className="group relative pl-6 sm:pl-8 border-l-2 border-gray-300 hover:border-gray-900 transition-colors">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-gray-900 rounded-full group-hover:scale-125 transition-transform"></div>
                                <div className="pb-6 sm:pb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{exp.position}</h3>
                                            <p className="text-base sm:text-lg text-gray-700 font-medium">{exp.company}</p>
                                        </div>
                                        <div className="flex flex-col sm:items-end gap-1.5 text-xs sm:text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                <span className="whitespace-nowrap">{exp.startDate} - {exp.current ? "Present" : exp.endDate || "Present"}</span>
                                            </div>
                                            {exp.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span>{exp.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl">{exp.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 max-w-7xl mx-auto border-b border-gray-200">
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Selected Projects</h2>
                        <p className="text-sm sm:text-base text-gray-500">Showcase of my work</p>
                    </div>
                    <div className="space-y-12 sm:space-y-16 md:space-y-20">
                {projects.map((project, i) => (
                            <div key={i} className="group">
                                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        {/* Image Section */}
                                    <div className={`overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 aspect-video ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                            {project.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                src={project.image} 
                                                alt={project.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                            ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <Globe className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                                                    <p className="text-xs sm:text-sm font-medium">No Preview</p>
                                                </div>
                                            </div>
                            )}
                        </div>

                        {/* Content Section */}
                                    <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
                                        <div className="mb-3 sm:mb-4">
                                            <span className="inline-block text-xs font-mono uppercase tracking-widest text-gray-500">
                                                Project {String(i + 1).padStart(2, '0')}
                                            </span>
                            </div>
                                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 group-hover:text-gray-600 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-3 sm:gap-4">
                                {project.link && (
                                                <a 
                                                    href={project.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium group/link shadow-sm hover:shadow-md"
                                                >
                                                    <span>View Live</span>
                                                    <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                    </a>
                                )}
                                {project.githubLink && (
                                                <a 
                                                    href={project.githubLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-all text-sm font-medium group/link"
                                                >
                                                    <Github className="h-4 w-4" />
                                                    <span>Code</span>
                                                    <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                    </a>
                                )}
                                        </div>
                            </div>
                        </div>
                    </div>
                ))}
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {skills && Array.isArray(skills) && skills.length > 0 && (
                <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 max-w-7xl mx-auto border-b border-gray-200">
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Skills & Expertise</h2>
                        <p className="text-sm sm:text-base text-gray-500">Technologies I work with</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {typeof skills[0] === 'string' ?
                            (skills as string[]).map((skill, i) => (
                                <span 
                                    key={i} 
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-900 hover:text-white transition-all cursor-default"
                                >
                                    {skill}
                                </span>
                            )) : null
                        }
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                        © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            {personalInfo.socials && personalInfo.socials.length > 0 && personalInfo.socials.map((s, i) => {
                                const SocialIcon = getSocialIcon(s.platform);
                                return s.link && s.platform && (
                                    <a 
                                        key={i} 
                                        href={s.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={s.platform}
                                    >
                                        <SocialIcon className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
