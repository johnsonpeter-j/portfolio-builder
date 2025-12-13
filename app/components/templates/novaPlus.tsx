"use client";

import { useState, useEffect } from 'react';
import { Mail, ExternalLink, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
import { TemplateProps } from "@/app/types/portfolio";
import { getSocialIcon } from "@/app/lib/social-icons";

export default function NovaPlusTemplate({ data }: TemplateProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  const { personalInfo, projects, skills, experience } = data;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Get skills as string array
  const skillsArray = Array.isArray(skills) && typeof skills[0] === 'string' 
    ? (skills as string[]) 
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {personalInfo.name}
          </h1>
          <div className="flex gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base">
            {['Home', 'Projects', 'Skills', 'Experience'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-purple-400 transition-colors duration-300"
                onClick={() => setActiveSection(item.toLowerCase())}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {personalInfo.profilePhoto && (
            <div className="mb-6 sm:mb-8 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={personalInfo.profilePhoto}
                alt={personalInfo.name}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-purple-500 shadow-2xl shadow-purple-500/50 mx-auto transform hover:scale-110 transition-transform duration-500"
              />
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse px-4">
            {personalInfo.name}
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl text-purple-300 mb-6 sm:mb-8 px-4">{personalInfo.title}</p>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            {personalInfo.bio}
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mb-8 px-4">
            {personalInfo.socials && personalInfo.socials.length > 0 && personalInfo.socials.map((social, i) => {
              if (!social.link || !social.platform) return null;
              const SocialIcon = getSocialIcon(social.platform);
              return (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-4 bg-slate-800/50 rounded-full hover:bg-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
                  aria-label={social.platform}
                >
                  <SocialIcon className="w-5 h-5" />
                </a>
              );
            })}
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-3 sm:p-4 bg-slate-800/50 rounded-full hover:bg-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section id="projects" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent px-4">
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project, idx) => {
                const SocialIcon = getSocialIcon("GitHub");
                return (
                  <div
                    key={idx}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 ${
                      isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      {project.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-slate-800 flex items-center justify-center">
                          <ExternalLink className="w-12 h-12 text-purple-400/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-purple-300">{project.title}</h4>
                      <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-3 sm:gap-4">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <SocialIcon className="w-4 h-4" />
                            View Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skillsArray.length > 0 && (
        <section id="skills" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent px-4">
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {skillsArray.map((skill, idx) => (
                <span
                  key={idx}
                  className={`px-4 sm:px-6 py-2 sm:py-3 bg-slate-800/70 backdrop-blur-sm rounded-full text-sm sm:text-base md:text-lg border border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/20 transition-all duration-300 hover:scale-110 ${
                    isVisible.skills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${idx * 30}ms` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section id="experience" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent px-4">
              Work Experience
            </h3>
            <div className="space-y-6 sm:space-y-8">
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 md:p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 ${
                    isVisible.experience ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl sm:text-2xl font-bold text-purple-300 mb-2">{exp.position}</h4>
                      <p className="text-lg sm:text-xl text-gray-300">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="px-3 sm:px-4 py-1 sm:py-2 bg-green-500/20 text-green-400 rounded-full text-xs sm:text-sm border border-green-500/30 self-start">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{exp.startDate} - {exp.current ? 'Present' : (exp.endDate || 'Present')}</span>
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 bg-slate-900/80 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <p className="text-sm sm:text-base text-purple-400">
            Let's build something amazing together.
          </p>
        </div>
      </footer>
    </div>
  );
}
