import React, { useState } from 'react';
import { Mail, MapPin, Calendar, ExternalLink, Github, Linkedin, Twitter, Award, Briefcase, Code, User } from 'lucide-react';
import { TemplateProps } from '@/app/types/portfolio';

const Portfolio = ({ data }: TemplateProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">{data.personalInfo.name}</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2">{data.personalInfo.title}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-12 sm:space-y-16">
        {/* About Section */}
        <section id="about">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 p-6 sm:p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col items-center justify-center">
                {data.personalInfo.profilePhoto && (
                  <img
                    src={data.personalInfo.profilePhoto}
                    alt={data.personalInfo.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover mb-4"
                  />
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-center">{data.personalInfo.name}</h2>
                <p className="text-sm sm:text-base text-blue-100 text-center mt-2">{data.personalInfo.title}</p>
              </div>
              <div className="md:w-2/3 p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800">About Me</h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">{data.personalInfo.bio}</p>
                
                <div className="flex items-center mb-4 flex-wrap">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <a href={`mailto:${data.personalInfo.email}`} className="text-sm sm:text-base text-slate-600 hover:text-blue-600 transition-colors break-all">
                    {data.personalInfo.email}
                  </a>
                </div>
                
                {data.personalInfo.socials && data.personalInfo.socials.length > 0 && (
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
                    {data.personalInfo.socials.map((social, idx) => {
                      const getIcon = () => {
                        switch(social.platform.toLowerCase()) {
                          case 'github': return <Github className="w-4 h-4 sm:w-5 sm:h-5" />;
                          case 'linkedin': return <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />;
                          case 'twitter': return <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />;
                          default: return <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />;
                        }
                      };
                      return (
                        <a
                          key={idx}
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 sm:p-3 bg-slate-100 rounded-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                        >
                          {getIcon()}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section id="experience">
            <div className="flex items-center mb-4 sm:mb-6">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Work Experience</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {data.experience.map((exp, idx) => (
              <div key={idx} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow flex flex-col">
                <div className="flex flex-col space-y-3 mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">{exp.position}</h3>
                    <p className="text-sm sm:text-base text-blue-600 font-semibold">{exp.company}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {exp.current && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium w-fit">
                        Current
                      </span>
                    )}
                    <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="flex items-center text-slate-500 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-grow">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section id="projects">
            <div className="flex items-center mb-4 sm:mb-6">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Featured Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {data.projects.map((project, idx) => (
                <div key={idx} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                  {project.image && (
                    <img src={project.image} alt={project.title} className="w-full h-40 sm:h-48 object-cover" />
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{project.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                          View
                        </a>
                      )}
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-xs sm:text-sm"
                        >
                          <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skillsArray.length > 0 && (
          <section id="skills">
            <div className="flex items-center mb-4 sm:mb-6">
              <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Technical Skills</h2>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {skillsArray.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all transform hover:scale-105 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {data.certificates && data.certificates.length > 0 && (
          <section id="certifications">
            <div className="flex items-center mb-4 sm:mb-6">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Certifications</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {data.certificates.map((cert, idx) => (
              <div key={idx} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start mb-4">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2 sm:mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 break-words">{cert.name}</h3>
                      <p className="text-sm sm:text-base text-blue-600 font-semibold mb-2">{cert.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-500 text-xs sm:text-sm mb-2 ml-8 sm:ml-9">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    <span>Issued: {formatDate(cert.issuedOn)}</span>
                  </div>
                  {cert.certificateId && (
                    <p className="text-slate-600 text-xs sm:text-sm break-all ml-8 sm:ml-9">Certificate ID: {cert.certificateId}</p>
                  )}
                </div>
                {cert.certificateUrl && (
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full"
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                    Verify
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-300">© 2024 {data.personalInfo.name}. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;