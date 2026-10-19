"use client";
import Footer from '@/components/Footer';
import NavbarGalery from '@/components/Navbar2';
import { useState, useEffect } from 'react';
import portfolioData from '@/data/portfolio-data.json';

interface Project {
  image: string;
  projectName: string;
  description: string;
  date: string;
  link: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  const overlayClass = isHovered
    ? "absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent transition-opacity duration-500 opacity-100"
    : "absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent transition-opacity duration-500 opacity-80";

  const badgeWrapClass = isHovered
    ? "transition-all duration-500 translate-y-0 opacity-100"
    : "transition-all duration-500 translate-y-4 opacity-0";

  const descClass = isHovered
    ? "text-[#B0B0B0] text-sm mb-4 font-montserrat-alternates transition-all duration-500 translate-y-0 opacity-100 max-h-40"
    : "text-[#B0B0B0] text-sm mb-4 font-montserrat-alternates transition-all duration-500 translate-y-4 opacity-0 max-h-0";

  const linkClass = isHovered
    ? "inline-flex items-center gap-2 px-6 py-2 bg-[#9D00FF] hover:bg-[#8000d1] text-black font-semibold rounded-full font-montserrat-alternates transition-all duration-500 translate-y-0 opacity-100"
    : "inline-flex items-center gap-2 px-6 py-2 bg-[#9D00FF] hover:bg-[#8000d1] text-black font-semibold rounded-full font-montserrat-alternates transition-all duration-500 translate-y-4 opacity-0";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-[#CAFA0A]/10 transition-all duration-500 transform hover:-translate-y-2 bg-[#1A1A1A] border border-[#2A2A2A]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={project.image}
          alt={project.projectName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={overlayClass} />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500">
          <div className={badgeWrapClass}>
            <span className="inline-block px-3 py-1 bg-[#CAFA0A] text-black text-xs font-semibold rounded-full mb-3 font-montserrat-alternates">
              {project.date}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-2 transition-all duration-300 font-rakkas text-[#E0E0E0]">
            {project.projectName}
          </h3>

          <p className={descClass}>
            {project.description}
          </p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            View Project
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>(portfolioData.projectData || []);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((err) => console.error('Failed to fetch projects from API:', err));
  }, []);

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = new Date(a.date.split(',').reverse().join('-'));
    const dateB = new Date(b.date.split(',').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen bg-[#121212]">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <NavbarGalery />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl sm:text-7xl font-bold text-[#E0E0E0] mb-6 font-rakkas">
            My{' '}
            <span className="text-[#CAFA0A] relative">
              Projects
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 200 12"
                fill="none"
              ></svg>
            </span>
          </h2>
          <p className="text-xl text-[#B0B0B0] max-w-2xl mx-auto mb-8 font-montserrat-alternates">
            Explore my latest work and creative projects
          </p>
        </div>
      </section>

      <section id="project" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}