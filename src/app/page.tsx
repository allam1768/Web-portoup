"use client";

import React from "react";
import SkillsCard from "@/components/SkilsCard";
import ProjectCard from "@/components/ProjectCard";
import TiltedCard from "@/components/TiltedCard";
import ClickSpark from "@/components/ClickSpark";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import Link from "next/link";
import { Rakkas } from "next/font/google";

const rakkas = Rakkas({
  subsets: ["latin"],
  weight: ["400"],
});

// Import the data from the new file
import { educationData, projectData, skillsData } from "../components/data";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <div className="w-full">
      {/* Home Section */}
      <section
        id="home"
        className="relative flex flex-col items-center justify-end h-screen bg-[#242424] text-black overflow-hidden pb-0"
      >
        {/* Main Typography & Image Container */}
        <div className="relative w-full flex flex-col items-center justify-end mb-10">
          {/* Software Text */}
          <h1
            className={`text-[12vw] sm:text-[13vw] lg:text-[14vw] leading-[0.1] text-[#CAFA0A] text-center z-0 animate-fade-in-down ${rakkas.className}`}
          >
            Software
          </h1>

          {/* Engineer Text Split with Image */}
          <div className="relative w-full flex items-start justify-center z-10 -mt-2 sm:-mt-3 lg:-mt-6 lg:-mb-20">
            {/* "engi" part */}
            <h1
              className={`text-[12vw] sm:text-[13vw] lg:text-[14vw] leading-[1.8] text-[#CAFA0A] z-0 animate-fade-in-up ${rakkas.className}`}
            >
              engi
            </h1>

            {/* Image - Between text, anchored to bottom */}
            <div className="relative mx-2 sm:mx-4 lg:-mx-25 flex items-end">
              <div className="relative w-[280px] h-[370px] sm:w-[370px] sm:h-[470px] lg:w-[470px] lg:h-[580px] transition-transform duration-500 ">
                <Image
                  src="/Allam-1.png"
                  alt="Allam Profile"
                  layout="fill"
                  objectFit="contain"
                  className="w-full h-full drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* "neer" part */}
            <h1
              className={`text-[12vw] sm:text-[13vw] lg:text-[14vw] leading-[1.8] text-[#CAFA0A] z-0 animate-fade-in-up ${rakkas.className}`}
            >
              neer
            </h1>
          </div>
        </div>

        {/* Right Side Quote */}
        <div className="absolute right-4 top-[60%] sm:right-10 lg:right-20 max-w-[180px] sm:max-w-[220px] lg:max-w-[260px] text-left z-30 animate-fade-in-right animation-delay-600">
          <span className="text-4xl sm:text-5xl lg:text-6xl text-[#000000] opacity-50 font-serif leading-none mb-2">
            {" "}
            &ldquo;{" "}
          </span>
          <p className="text-xs sm:text-sm text-gray leading-relaxed font-medium">
            I design and build frontend experiences for web and mobile products,
            focusing on performance, clarity, and intuitive user interactions.
          </p>
        </div>

        {/* Text Quote Tab - Bottom Left */}
        <div className="absolute bottom-0 left-0 right-0 z-50 hidden lg:block animate-fade-in-left animation-delay-800">
          {/* Garis horizontal penuh */}
          <div
            className="h-[25px] rounded-t-3xl"
            style={{ backgroundColor: "#121212" }}
          />

          {/* Kotak dengan teks - Container Utama */}
          <div
            className="absolute bottom-[25px] px-2 pt-2 pb-1 max-w-[260px]"
            style={{
              backgroundColor: "#121212",
              borderRadius: "15px 15px 0px 0px", // Membuat sudut atas sedikit lebih bulat agar serasi
              left: "10%",
            }}
          >
            {/* --- LENGKUNGAN LUAR KIRI --- */}
            <div className="absolute bottom-0 -left-[20px] w-[20px] h-[20px] bg-[#121212]">
              <div className="w-full h-full bg-[#242424] rounded-br-[15px]"></div>
            </div>

            {/* --- LENGKUNGAN LUAR KANAN --- */}
            <div className="absolute bottom-0 -right-[20px] w-[20px] h-[20px] bg-[#121212]">
              <div className="w-full h-full bg-[#242424] rounded-bl-[15px]"></div>
            </div>

            {/* Button Download CV */}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/cvallam.pdf";
                link.download = "cvallam.pdf";
                link.click();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#9D00FF] text-[#000000] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Download CV
              <img src="icontcv.svg" alt="download" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* project Section */}
      <section
        id="project"
        className="scroll-mt-18 bg-[#121212] flex items-center justify-center"
      >
        <div className="w-full">
          <ClickSpark
            sparkColor="#2BB6C0"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <div
              className="
              rounded-b-3xl
                pt-5 sm:pt-10
                px-4 sm:px-8 lg:px-16
                animate-fade-in
              "
              style={{ backgroundColor: "#121212" }}
            >
              {/* Judul + Tombol */}
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-6 sm:mb-9 gap-4 sm:gap-0">
                {/* Judul - Animated */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-start animate-slide-in-left">
                  <span className="block text-white">
                    Let&apos;s Have a Look at
                  </span>
                  <span className="block">
                    <span className="text-white">my </span>
                    <span style={{ color: "#2BB6C0" }}>Project</span>
                  </span>
                </h2>

                {/* Tombol - Animated */}
                <Link href="/project" passHref>
                  <div
                    className="
      flex items-center gap-2
      text-white font-semibold
      py-2 px-4 sm:px-5
      rounded-full
      transition-all duration-300
      text-sm sm:text-base
      self-end sm:self-auto
      whitespace-nowrap
      mt-2 sm:mt-0
      bg-[#2BB6C0]
      cursor-pointer
      hover:scale-110 hover:shadow-lg
      animate-slide-in-right
    "
                  >
                    See More
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform rotate-[30deg] sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-y-1"
                    >
                      <path
                        d="M12 4L12 20M12 4L6 10M12 4L18 10"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Project Grid - Animated */}
              <div
                className="
                flex justify-center items-center
                gap-4 sm:gap-6 lg:gap-10
                pb-6 sm:pb-10
                flex-wrap
                mt-6 sm:mt-10 lg:mt-30
              "
              >
                {projectData
                  .sort((a, b) => {
                    const dateA = a.date.split(",").reverse().join("");
                    const dateB = b.date.split(",").reverse().join("");
                    return dateB.localeCompare(dateA);
                  })
                  .slice(0, 3)
                  .map((project, index) => (
                    <div
                      key={index}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <ProjectCard
                        projectName={project.projectName}
                        image={project.image}
                        date={project.date}
                        description={project.description}
                        link={project.link}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </ClickSpark>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="scroll-mt-18 bg-white flex items-center justify-center"
      >
        <div className="w-full">
          <div className="rounded-3xl pt-6 sm:pt-10 px-4 sm:px-6 lg:px-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-9 text-start animate-fade-in">
              <span className="text-black">My </span>
              <span style={{ color: "#2BB6C0" }}>Skills</span>
            </h2>

            {/* Skills Grid - Animated */}
            <div className="flex justify-center items-center gap-4 sm:gap-8 lg:gap-12 xl:gap-16 pb-6 sm:pb-10 flex-wrap">
              {skillsData.map((skill, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <SkillsCard
                    title={skill.title}
                    image={skill.image}
                    linkTo={skill.linkTo}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Running Section - Already has animation */}
      <section className="relative flex items-center justify-center h-32 sm:h-36 lg:h-40 bg-white overflow-hidden">
        <div
          className="absolute z-20 w-full h-[40px] sm:h-[50px] lg:h-[60px] bg-[#FFFDFD] overflow-hidden shadow-xl flex items-center px-2 sm:px-4 animate-slide-in"
          style={{ transform: "rotate(1deg)" }}
        >
          <div className="flex whitespace-nowrap animate-scroll-left">
            <span className="text-sm sm:text-base lg:text-lg font-medium text-black mr-4 sm:mr-6 lg:mr-8">
              Photography ✦ Mobile Development ✦ Front End ✦ Editing ✦
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-medium text-black mr-4 sm:mr-6 lg:mr-8">
              Photography ✦ Mobile Development ✦ Front End ✦ Editing ✦
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-medium text-black mr-4 sm:mr-6 lg:mr-8">
              Photography ✦ Mobile Development ✦ Front End ✦ Editing ✦
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-medium text-black mr-4 sm:mr-6 lg:mr-8">
              Photography ✦ Mobile Development ✦ Front End ✦ Editing ✦
            </span>
            <span className="text-sm sm:text-base lg:text-lg font-medium text-black mr-4 sm:mr-6 lg:mr-8">
              Photography ✦ Mobile Development ✦ Front End ✦ Editing ✦
            </span>
          </div>
        </div>

        <div
          className="h-[40px] sm:h-[50px] lg:h-[60px] w-full rounded-full z-10 animate-pulse-slow"
          style={{ backgroundColor: "#2BB6C0" }}
        ></div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="rounded-3xl scroll-mt-42 bg-white flex items-center justify-center py-6 sm:py-8 lg:py-10 min-h-[80vh]"
        style={{ backgroundColor: "#F0F1F1" }}
      >
        <ClickSpark
          sparkColor="#252526"
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
        >
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center text-white animate-fade-in">
              <span className="block">
                <span className="text-black">About </span>
                <span style={{ color: "#2BB6C0" }}>Me</span>
              </span>
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12">
              {/* Foto dengan Tilted Card - Animated */}
              <div className="flex justify-center lg:justify-start animate-fade-in-left">
                <div className="w-[220px] h-[280px] sm:w-[250px] sm:h-[320px] lg:w-[280px] lg:h-[350px] hover:scale-105 transition-transform duration-500">
                  <TiltedCard
                    imageSrc="/me.webp"
                    altText="Allam Permata Putra"
                    captionText="Allam Permata Putra"
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    rotateAmplitude={15}
                    scaleOnHover={1.1}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                  />
                </div>
              </div>

              {/* Deskripsi - Animated */}
              <div className="text-center lg:text-left max-w-xl lg:max-w-2xl animate-fade-in-right">
                <h3 className="text-xl sm:text-2xl font-semibold text-black mb-3 sm:mb-4">
                  Hi, I&apos;m{" "}
                  <span style={{ color: "#2BB6C0" }}>Allam Permata Putra</span>
                </h3>
                <p className="text-sm sm:text-base text-black leading-relaxed mb-4 sm:mb-6">
                  I&apos;m a passionate{" "}
                  <span style={{ color: "#2BB6C0" }}>Frontend Developer</span>{" "}
                  who loves building elegant and responsive user interfaces
                  using <span style={{ color: "#2BB6C0" }}>React</span>,{" "}
                  <span style={{ color: "#2BB6C0" }}>Tailwind CSS</span>, and{" "}
                  <span style={{ color: "#2BB6C0" }}>Flutter</span>. I&apos;m
                  also deeply interested in{" "}
                  <span style={{ color: "#2BB6C0" }}>UI/UX</span>,{" "}
                  <span style={{ color: "#2BB6C0" }}>web design</span>, and{" "}
                  <span style={{ color: "#2BB6C0" }}>
                    mobile app development
                  </span>
                  .
                  <br />
                  <br />
                  Currently, I&apos;m working on my{" "}
                  <span style={{ color: "#2BB6C0" }}>
                    personal portfolio website
                  </span>{" "}
                  while continuously learning modern web technologies. My
                  long-term goal is to{" "}
                  <span style={{ color: "#2BB6C0" }}>work abroad</span> as a
                  developer and contribute to building impactful digital
                  solutions.
                </p>

                {/* Tombol Download CV - Animated */}
                <div className="flex justify-center lg:justify-start">
                  <a
                    href="/cvallam.pdf"
                    download
                    className="bg-[#2BB6C0] inline-flex items-center gap-2 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base hover:scale-110 hover:shadow-lg animate-bounce-gentle"
                  >
                    Download CV
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 sm:w-5 sm:h-5 transform -rotate-3 transition-transform duration-300 group-hover:translate-y-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 7L7 17M17 17V7H7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ClickSpark>
      </section>

      {/* Education Section */}
      <section
        id="education"
        className="scroll-mt-18 bg-white flex items-center justify-center py-8 sm:py-12"
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 lg:mb-16 text-center text-black animate-fade-in">
              My Education
            </h2>

            <div className="relative">
              {/* Timeline line - Animated */}
              <div className="absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-black animate-draw-line"></div>

              {/* Timeline items - Animated */}
              <div className="space-y-8 sm:space-y-12">
                {educationData.map((item, index) => (
                  <div
                    key={index}
                    className="relative animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="absolute left-4 transform -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center animate-scale-in">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.isActive
                              ? "bg-[#2BB6C0] animate-pulse-slow"
                              : "bg-black"
                          }`}
                        ></div>
                      </div>

                      <div className="ml-8 pl-4 hover:translate-x-2 transition-transform duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {item.level}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.period}
                        </p>
                        <p className="text-base font-medium text-gray-800">
                          {item.school}
                        </p>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center group">
                      <div className="flex-1 text-right pr-8 lg:pr-12 group-hover:translate-x-2 transition-transform duration-300">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                          {item.level}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {item.period}
                        </p>
                      </div>

                      <div className="absolute left-1/2 transform -translate-x-1/2 z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                        <div
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                            item.isActive
                              ? "bg-[#2BB6C0] animate-pulse-slow"
                              : "bg-black"
                          }`}
                        ></div>
                      </div>

                      <div className="flex-1 pl-8 lg:pl-12 group-hover:-translate-x-2 transition-transform duration-300">
                        <p className="text-base sm:text-lg font-medium text-gray-800">
                          {item.school}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white flex items-center justify-center py-8 md:py-15">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-16 lg:gap-32">
            <div className="flex-1 animate-fade-in-left">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8 text-black leading-tight">
                Let&apos;s Work{" "}
                <span style={{ color: "#2BB6C0" }}>Together</span>
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-full lg:max-w-lg">
                Got an idea to bring to life, interested in a creative
                partnership, or simply want to connect? I&apos;m all ears —
                reach out!
              </p>
            </div>

            <div className="flex-shrink-0 w-full lg:w-auto text-left lg:text-right animate-fade-in-right">
              <div className="mb-6 md:mb-10">
                <h3 className="text-black font-semibold text-lg mb-2">
                  Contact me
                </h3>
                <a
                  href="mailto:permataallam7@gmail.com"
                  className="text-gray-600 hover:text-black transition-colors duration-300 break-all md:break-normal hover:underline"
                >
                  permataallam7@gmail.com
                </a>
              </div>

              <div>
                <a
                  href="https://mail.google.com/mail/?view=cm&to=permataallam7@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full lg:w-auto px-6 md:px-8 py-3 md:py-4 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 font-medium text-center hover:scale-105 hover:shadow-lg"
                >
                  Let&apos;s Collaborate
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer Section */}
      <Footer />

      {/* Add custom animations styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpSlow {
          from {
            transform: translateX(-50%) translateY(100%);
          }
          to {
            transform: translateX(-50%) translateY(33.333%);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: rotate(1deg) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: rotate(1deg) translateY(0);
          }
        }

        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes drawLine {
          from {
            height: 0;
          }
          to {
            height: 100%;
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slide-up-slow {
          animation: slideUpSlow 1s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }

        .animate-expand-width {
          animation: expandWidth 1s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-draw-line {
          animation: drawLine 1.5s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `,
        }}
      />
    </div>
  );
}
