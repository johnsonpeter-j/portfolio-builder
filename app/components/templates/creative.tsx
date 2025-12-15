import React from 'react';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Calendar, MapPin, Award } from 'lucide-react';
import { TemplateProps } from '@/app/types/portfolio';

const Portfolio = ({ data }: TemplateProps) => {
  const getSocialIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'github': return <Github className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Handle skills - can be string[] or other formats
  const skillsArray = Array.isArray(data.skills) 
    ? data.skills.filter((s): s is string => typeof s === 'string')
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="flex flex-col items-center text-center space-y-12">
            {/* Profile Photo with Advanced Styling */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-50"></div>
                {data.personalInfo.profilePhoto && (
                <img 
                  src={data.personalInfo.profilePhoto} 
                  alt={data.personalInfo.name}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-white/10 shadow-2xl ring-4 ring-purple-500/50 group-hover:scale-105 transition-transform duration-300"
                />
                )}
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
                <span className="text-white text-sm font-semibold">Available for Work</span>
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-4 max-w-4xl">
              <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full">
                <span className="text-purple-300 text-sm font-semibold tracking-wider uppercase">Portfolio 2024</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient">
                  {data.personalInfo.name}
                </span>
              </h1>
              
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-30"></div>
                <p className="relative text-2xl sm:text-3xl lg:text-4xl font-light bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  {data.personalInfo.title}
                </p>
              </div>
              
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mt-6">
                {data.personalInfo.bio}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center pt-8">
              <a href={`mailto:${data.personalInfo.email}`} 
                 className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                <Mail className="w-5 h-5" />
                <span className="font-semibold">Get in Touch</span>
              </a>
              
              {data.personalInfo.socials && data.personalInfo.socials.map((social, idx) => (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer"
                   className="group flex items-center gap-2 px-6 py-4 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500/50 rounded-full transition-all duration-300 hover:scale-105">
                  {getSocialIcon(social.platform)}
                  <span>{social.platform}</span>
                </a>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex items-start justify-center p-2">
                <div className="w-1 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {data.projects.map((project, idx) => (
                <div key={idx} className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                  {project.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex gap-3 pt-2">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                           className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
                          <Github className="w-4 h-4" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {skillsArray.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-6 py-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-full text-white border border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:scale-105 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Work Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{exp.position}</h3>
                      <p className="text-xl text-purple-400">{exp.company}</p>
                    </div>
                    {exp.current && (
                      <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/50">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </div>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-slate-300 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certificates && data.certificates.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Certifications
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.certificates.map((cert, idx) => (
                <div key={idx} className="bg-slate-900/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start gap-3 mb-4">
                    <Award className="w-8 h-8 text-purple-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
                      <p className="text-purple-400">{cert.provider}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-400 mb-4">
                    <p>Issued: {formatDate(cert.issuedOn)}</p>
                    {cert.certificateId && (
                      <p className="font-mono text-xs">ID: {cert.certificateId}</p>
                    )}
                  </div>
                  {cert.certificateUrl && (
                    <a 
                      href={cert.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>© 2024 {data.personalInfo.name}. Crafted with passion.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;