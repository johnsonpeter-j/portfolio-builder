import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, ExternalLink, Calendar, Award } from 'lucide-react';
import { TemplateProps } from '@/app/types/portfolio';

const Portfolio = ({ data }: TemplateProps) => {
  const formatDate = (date: string | Date) => {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatYear = (dateString: string) => {
    if (!dateString) return '';
    return dateString.substring(0, 4);
  };

  // Handle skills - can be string[] or other formats
  const skillsArray = Array.isArray(data.skills) 
    ? data.skills.filter((s): s is string => typeof s === 'string')
    : [];

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <header className="bg-neutral-50 border-b-2 border-neutral-900 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-2">
                {data.personalInfo.name}
              </h1>
              <p className="text-xl text-neutral-700">{data.personalInfo.title}</p>
            </div>
            {data.personalInfo.profilePhoto && (
              <img
                src={data.personalInfo.profilePhoto}
                alt={data.personalInfo.name}
                className="w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-neutral-900"
              />
            )}
          </div>
        </header>

        {/* Contact Section */}
        <section className="border-b border-neutral-300 p-8 sm:p-12">
          <h2 className="text-sm font-bold text-neutral-900 mb-4 tracking-wider uppercase">Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="mb-3">
                <span className="font-semibold">Email:</span>{' '}
                <a href={`mailto:${data.personalInfo.email}`} className="text-neutral-700 hover:underline">
                  {data.personalInfo.email}
                </a>
              </div>
            </div>
            <div>
              {data.personalInfo.socials && data.personalInfo.socials.length > 0 && (
                <div className="mb-3">
                  <span className="font-semibold">Socials:</span>{' '}
                  <div className="flex gap-2 mt-1">
                    {data.personalInfo.socials.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-700 hover:underline"
                      >
                        {social.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="border-b border-neutral-300 p-8 sm:p-12">
            <h2 className="text-sm font-bold text-neutral-900 mb-6 tracking-wider uppercase">Professional Experience</h2>
            <div className="space-y-8">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {exp.position} | {formatYear(exp.startDate)}-{exp.current ? 'Present' : (exp.endDate ? formatYear(exp.endDate) : 'Present')}
                    </h3>
                  </div>
                  <p className="text-base font-medium text-neutral-700 mb-3">{exp.company}</p>
                  {exp.description && (
                    <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700 ml-1">
                      {exp.description.split('. ').filter(s => s.length > 0).map((sentence, i) => (
                        <li key={i}>{sentence.endsWith('.') ? sentence : sentence + '.'}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {data.certificates && data.certificates.length > 0 && (
          <section className="border-b border-neutral-300 p-8 sm:p-12">
            <h2 className="text-sm font-bold text-neutral-900 mb-6 tracking-wider uppercase">Certificates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.certificates.map((cert, idx) => (
                <div key={idx}>
                  <h3 className="text-base font-bold text-neutral-900 mb-1">
                    {cert.name} | {formatYear(cert.issuedOn)}
                  </h3>
                  <p className="text-sm text-neutral-700">{cert.provider}</p>
                  {cert.certificateUrl && (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-600 hover:underline mt-1 inline-block"
                    >
                      View Certificate →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skillsArray.length > 0 && (
          <section className="border-b border-neutral-300 p-8 sm:p-12">
            <h2 className="text-sm font-bold text-neutral-900 mb-4 tracking-wider uppercase">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-neutral-200 text-neutral-900 text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="p-8 sm:p-12">
            <h2 className="text-sm font-bold text-neutral-900 mb-6 tracking-wider uppercase">Projects</h2>
            <div className="space-y-6">
              {data.projects.map((project, idx) => (
                <div key={idx}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                    <h3 className="text-lg font-bold text-neutral-900">{project.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-700 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-900 underline hover:no-underline"
                      >
                        View Live →
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-900 underline hover:no-underline"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
