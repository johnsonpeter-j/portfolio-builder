"use client";

import { PortfolioData, TemplateProps } from "@/app/types/portfolio";
import { motion } from "framer-motion";
import { Globe, Mail, Building2, Calendar, MapPin, ArrowUpRight, Menu, X, Github } from "lucide-react";
import { useState } from "react";
import { getSocialIcon } from "@/app/lib/social-icons";

export default function ModernTemplate({ data }: TemplateProps) {
    const { personalInfo, projects, skills, experience } = data;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
                {/* Navigation / Header */}
                <header className="flex justify-between items-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-lg sm:text-xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                    >
                        {personalInfo.name.split(" ")[0] || "Portfolio"}.
                    </motion.h2>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
                        <a href="#projects" className="hover:text-white transition-colors">Work</a>
                        <a href="#experience" className="hover:text-white transition-colors">Experience</a>
                        <a href="#skills" className="hover:text-white transition-colors">Skills</a>
                        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden mb-8 p-4 rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-800"
                    >
                        <div className="flex flex-col gap-4">
                            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">Work</a>
                            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">Experience</a>
                            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">Skills</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">Contact</a>
                        </div>
                    </motion.nav>
                )}

                {/* Hero Section */}
                <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
                    <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 items-start md:items-center">
                        {/* Profile Photo */}
                        {personalInfo.profilePhoto && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start"
                            >
                                <div className="relative">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={personalInfo.profilePhoto} 
                                            alt={personalInfo.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 -z-10"></div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex-1 text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-3 sm:mb-4 tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500"
                    >
                                {personalInfo.name}
                    </motion.h1>
                            
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-indigo-400"
                            >
                                {personalInfo.title || "Creative Developer"}
                            </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed mx-auto md:mx-0"
                    >
                        {personalInfo.bio || "I build digital experiences."}
                    </motion.p>
                        </div>
                    </div>
                </section>

                {/* Experience Section */}
                {experience && experience.length > 0 && (
                    <section id="experience" className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-12"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Experience</h2>
                            <div className="h-px bg-gray-800 flex-1 w-full sm:w-auto" />
                        </motion.div>

                        <div className="space-y-4 sm:space-y-6">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    className="group relative p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 transition-all backdrop-blur-sm"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 group-hover:text-indigo-400 transition-colors">
                                                {exp.position}
                                            </h3>
                                            <p className="text-base sm:text-lg text-gray-300 font-medium mb-2 sm:mb-3">{exp.company}</p>
                                            {exp.description && (
                                                <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl">{exp.description}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
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
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Grid (Bento) */}
                {projects.length > 0 && (
                    <section id="projects" className="mb-16 sm:mb-20 md:mb-24 lg:mb-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-12"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Selected Work</h2>
                            <div className="h-px bg-gray-800 flex-1 w-full sm:w-auto" />
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 transition-all cursor-pointer ${i === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto min-h-[300px] sm:min-h-[400px]" : "aspect-square min-h-[250px] sm:min-h-[300px]"}`}
                            >
                                {project.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                        <img 
                                            src={project.image} 
                                            alt={project.title} 
                                            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition duration-500 scale-100 group-hover:scale-110" 
                                        />
                                ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50" />
                                )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 sm:p-6 md:p-8 flex flex-col justify-end">
                                        <h3 className={`font-bold mb-2 group-hover:text-indigo-400 transition-colors ${i === 0 ? "text-2xl sm:text-3xl md:text-4xl" : "text-lg sm:text-xl md:text-2xl"}`}>
                                        {project.title}
                                    </h3>
                                        <p className="text-gray-300 line-clamp-2 max-w-md mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                                        {project.description}
                                    </p>

                                        <div className="flex flex-wrap gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                        {project.link && (
                                                <a 
                                                    href={project.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Globe size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Live</span>
                                            </a>
                                        )}
                                        {project.githubLink && (
                                                <a 
                                                    href={project.githubLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Github size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Code</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
                )}

                {/* Skills & Contact */}
                <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24">
                    <motion.section
                        id="skills"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">Expertise</h2>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {skills && Array.isArray(skills) && typeof skills[0] === 'string' ?
                                (skills as string[]).map((skill, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        viewport={{ once: true }}
                                        className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full border border-gray-800 bg-gray-900/50 text-xs sm:text-sm hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                )) : null
                            }
                        </div>
                    </motion.section>

                    <motion.section
                        id="contact"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8">Get in Touch</h2>
                        <div className="space-y-3 sm:space-y-4">
                            <a 
                                href={`mailto:${personalInfo.email}`} 
                                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-indigo-500/50 transition group"
                            >
                                <div className="p-2 sm:p-3 rounded-xl bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition flex-shrink-0">
                                    <Mail size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm text-gray-400">Email Me</p>
                                    <p className="text-sm sm:text-base font-medium group-hover:text-indigo-400 transition-colors truncate">{personalInfo.email}</p>
                                </div>
                            </a>

                            {personalInfo.socials && personalInfo.socials.length > 0 && personalInfo.socials.map((s, i) => {
                                const SocialIcon = getSocialIcon(s.platform);
                                return s.link && s.platform && (
                                    <a 
                                        key={i} 
                                        href={s.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-indigo-500/50 transition group"
                                    >
                                        <div className="p-2 sm:p-3 rounded-xl bg-gray-800 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition flex-shrink-0">
                                            <SocialIcon size={18} className="sm:w-5 sm:h-5" />
                                    </div>
                                        <p className="text-sm sm:text-base font-medium group-hover:text-indigo-400 transition-colors flex-1">{s.platform}</p>
                                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0" />
                                </a>
                                );
                            })}
                        </div>
                    </motion.section>
                </div>

                {/* Footer */}
                <footer className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-12 border-t border-gray-800 text-center">
                    <p className="text-xs sm:text-sm text-gray-500">
                        © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}
