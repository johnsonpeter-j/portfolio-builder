import React from 'react';
import { Github, Linkedin, Mail, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { TemplateProps } from '@/app/types/portfolio';

export default function Portfolio({ data }: TemplateProps) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {data.personalInfo.profilePhoto && (
              <img 
                src={data.personalInfo.profilePhoto} 
                alt={data.personalInfo.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500"
              />
            )}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{data.personalInfo.name}</h1>
              <p className="text-lg sm:text-xl text-gray-600 mt-1">{data.personalInfo.title}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                  <Mail size={18} />
                  <span className="text-sm">{data.personalInfo.email}</span>
                </a>
              </div>
            </div>
            {data.personalInfo.socials && data.personalInfo.socials.length > 0 && (
              <div className="flex gap-3">
                {data.personalInfo.socials.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition"
                >
                  {social.platform === "GitHub" && <Github size={20} />}
                  {social.platform === "LinkedIn" && <Linkedin size={20} />}
                  {social.platform === "Twitter" && <ExternalLink size={20} />}
                </a>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-700 mt-6 max-w-3xl text-center sm:text-left">{data.personalInfo.bio}</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Experience</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {data.experience.map((exp, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-base sm:text-lg text-blue-600 mt-1">{exp.company}</p>
                  </div>
                  {exp.current && (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full self-start">Current</span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{exp.location}</span>
                  </div>
                </div>
                <p className="text-gray-700 mt-4 text-sm sm:text-base">{exp.description}</p>
              </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
              {data.projects.map((project, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {project.image && (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm sm:text-base text-gray-700 mt-3">{project.description}</p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                      {project.githubLink && (
                        <a 
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm"
                        >
                          <Github size={16} />
                          Source Code
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
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Skills</h2>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
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
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {data.certificates.map((cert, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-600 mt-1">{cert.provider}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Issued: {formatDate(cert.issuedOn)}
                      {cert.certificateId && ` • ID: ${cert.certificateId}`}
                    </p>
                  </div>
                  {cert.certificateUrl && (
                    <a 
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm self-start"
                    >
                      <ExternalLink size={16} />
                      Verify Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2024 {data.personalInfo.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}