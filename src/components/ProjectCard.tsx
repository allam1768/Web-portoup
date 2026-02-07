"use client";

import React from "react";
import Image from "next/image";

interface ProjectCardProps {
  projectName: string;
  image?: string;
  date?: string;
  description?: string;
  link?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName,
  image,
  date,
  description,
  link,
}) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    link ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  return (
    <div className="relative w-80 h-90 group">
      <Wrapper>
        {/* Card */}
        <div className="relative w-full h-full bg-[#242424] overflow-hidden cursor-pointer shadow-lg flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
          {/* Content */}
          <div className="px-3 pt-3 flex-1 flex flex-col">
            {/* Title + Icon */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-white font-montserrat-subrayada font-bold text-2xl leading-tight flex-1 mr-4">
                {projectName}
              </h3>

              <div className="relative w-auto h-10 opacity-80">
                 <img
                    src="/assets/icons/icontcard.svg"
                    alt="icon"
                    className="w-auto h-10"
                  />
              </div>
            </div>

            {/* Description nempel ke image */}
            {description && (
              <p className="text-white text-reguler leading-relaxed whitespace-pre-wrap font-montserrat-alternates line-clamp-3 mt-auto mb-2">
                {description}
              </p>
            )}
          </div>

          {/* Image nempel bawah */}
          {image && (
            <div className="px-3 pb-3">
              <div className="w-full h-48 overflow-hidden relative">
                <Image
                  src={image}
                  alt="project background"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  );
};

export default React.memo(ProjectCard);
