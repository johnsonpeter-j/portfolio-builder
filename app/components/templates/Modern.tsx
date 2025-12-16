"use client";

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Calendar, MapPin, Award, Briefcase, Code, User, FileText, Phone } from 'lucide-react';
import { TemplateProps } from '@/app/types/portfolio';
import { getResponsiveGridClasses, formatDate } from './utils';
import PortfolioBuilderBadge from '@/app/components/PortfolioBuilderBadge';

const Portfolio = ({ data }: TemplateProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle skills - can be string[] or other formats
  const skillsArray = Array.isArray(data.skills) 
    ? data.skills.filter((s): s is string => typeof s === 'string')
    : [];


  const getSocialIcon = (platform: string) => {
    switch(platform) {
      case 'GitHub': return <Github className="w-5 h-5 text-white" />;
      case 'LinkedIn': return <Linkedin className="w-5 h-5 text-white" />;
      case 'Twitter': return <Twitter className="w-5 h-5 text-white" />;
      default: return null;
    }
  };

  const menuItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'certifications', label: 'Certifications', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-purple-500/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              {data.personalInfo.name}
            </h1>
            <nav className="hidden md:flex gap-2">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-gray-300 hover:bg-slate-800/50 hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
            {/* Mobile Menu */}
            <div className="md:hidden flex gap-1">
              {menuItems.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="p-2 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-slate-800/50"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        {/* About Section */}
        <section id="about" className="mb-32">
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                {data.personalInfo.profilePhoto && (
                  <img
                    src={data.personalInfo.profilePhoto}
                    alt={data.personalInfo.name}
                    className="relative w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-purple-500/30 mx-auto"
                  />
                )}
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-gradient bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                {data.personalInfo.name}
              </h2>
              <p className="text-2xl md:text-3xl text-purple-300 mb-6 font-light">
                {data.personalInfo.title}
              </p>
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                {data.personalInfo.bio}
              </p>
              
              {/* Social Links */}
              {data.personalInfo.socials && data.personalInfo.socials.length > 0 && (
                <div className="flex gap-4 justify-center flex-wrap">
                  {data.personalInfo.socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-4 bg-slate-800/50 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all border border-purple-500/20 hover:border-transparent hover:shadow-lg hover:shadow-purple-500/50 hover:scale-110"
                  >
                    <div className="relative z-10">
                      {getSocialIcon(social.platform)}
                    </div>
                  </a>
                  ))}
                  <a
                    href={`mailto:${data.personalInfo.email}`}
                    className="group relative p-4 bg-slate-800/50 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all border border-purple-500/20 hover:border-transparent hover:shadow-lg hover:shadow-purple-500/50 hover:scale-110"
                  >
                    <div className="relative z-10">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                  </a>
                  {data.personalInfo.phoneNo && (
                    <a
                      href={`tel:${data.personalInfo.phoneNo}`}
                      className="group relative p-4 bg-slate-800/50 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all border border-purple-500/20 hover:border-transparent hover:shadow-lg hover:shadow-purple-500/50 hover:scale-110"
                    >
                      <div className="relative z-10">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Skills Section */}
            {skillsArray.length > 0 && (
              <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-xl">
                <h3 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
                  <Code className="w-8 h-8 text-purple-400" />
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skillsArray.map((skill, idx) => (
                  <span
                    key={idx}
                    className="group relative px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 text-purple-300 rounded-xl text-sm border border-purple-500/30 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105 cursor-default"
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 rounded-xl transition-all"></div>
                  </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section id="projects" className="mb-32">
            <div className="animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-4 text-center">Featured Projects</h2>
              <p className="text-gray-400 text-center mb-12 text-lg">Showcasing my recent work and innovations</p>
              <div className={`${getResponsiveGridClasses(data.projects.length, 3)} gap-8`}>
                {data.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-slate-800/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
                  >
                    {project.image && (
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>
                      <div className="flex gap-3">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 font-medium"
                          >
                            <ExternalLink className="w-4 h-4" /> Live
                          </a>
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition-all border border-slate-600 hover:border-slate-500 font-medium"
                          >
                            <Github className="w-4 h-4" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section id="experience" className="mb-32">
            <div className="animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-4 text-center">Work Experience</h2>
              <p className="text-gray-400 text-center mb-12 text-lg">My professional journey and achievements</p>
              <div className="space-y-8 relative">
                {/* Timeline Line */}
                <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-pink-600 to-purple-600"></div>
                
                {data.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="relative bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 group"
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute -left-12 top-10 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full border-4 border-slate-950 shadow-lg shadow-purple-500/50"></div>
                  
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {exp.position}
                      </h3>
                      <p className="text-purple-300 text-xl font-medium">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="inline-flex items-center gap-2 mt-3 md:mt-0 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-green-500/30 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Currently Working
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-6 text-gray-400 mb-6">
                    <span className="flex items-center gap-2 bg-slate-700/30 px-4 py-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-2 bg-slate-700/30 px-4 py-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-400" />
                        <span className="font-medium">{exp.location}</span>
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-gray-300 leading-relaxed text-lg">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Certifications Section */}
        {data.certificates && data.certificates.length > 0 && (
          <section id="certifications" className="mb-32">
            <div className="animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-4 text-center">Certifications</h2>
              <p className="text-gray-400 text-center mb-12 text-lg">Professional credentials and achievements</p>
              <div className={`${getResponsiveGridClasses(data.certificates.length, 3)} gap-8`}>
                {data.certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="group relative bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/50 transition-all hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-2xl transition-all"></div>
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 group-hover:border-purple-400/50 transition-all shadow-lg shadow-purple-500/20">
                      <Award className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-purple-300 mb-4 text-lg font-medium">{cert.provider}</p>
                    <div className="space-y-2 mb-6">
                      <p className="text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        Issued: {formatDate(cert.issuedOn)}
                      </p>
                      {cert.certificateId && (
                        <p className="text-gray-500 text-sm bg-slate-700/30 px-3 py-2 rounded-lg">
                          <span className="text-gray-400">ID:</span> {cert.certificateId}
                        </p>
                      )}
                    </div>
                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 font-medium w-full justify-center"
                      >
                        View Certificate <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-t border-purple-500/20 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {data.personalInfo.name}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {data.personalInfo.title}
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {menuItems.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="block text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              {data.personalInfo.socials && data.personalInfo.socials.length > 0 && (
                <div className="flex gap-3">
                  {data.personalInfo.socials.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all border border-purple-500/20 hover:border-transparent"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                  ))}
                  <a
                    href={`mailto:${data.personalInfo.email}`}
                    className="p-3 bg-slate-800/50 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all border border-purple-500/20 hover:border-transparent"
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} {data.personalInfo.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <PortfolioBuilderBadge />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;