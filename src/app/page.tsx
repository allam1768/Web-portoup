"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SkillsCard from "@/components/SkilsCard";
import ProjectCard from "@/components/ProjectCard";
import TiltedCard from "@/components/TiltedCard";
import ClickSpark from "@/components/ClickSpark";
import Image from "next/image";
import CountUp from "@/components/CountUp";
import Link from "next/link";
import portfolioData from "@/data/portfolio-data.json";
import Footer from "@/components/Footer";
import Squares from "@/components/Squares";

const { educationData, projectData, skillsData, frondData } = portfolioData;

export default function App() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const itemPositions = useRef<number[]>([]);
  const visualFocusPointRef = useRef(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- Performance Optimization State ---
  const ticking = useRef(false);
  const isIntersecting = useRef(false);

  // Memoize sorted project data to avoid re-sorting on every render
  const sortedProjectData = React.useMemo(() => {
    return projectData
      .sort((a, b) => {
        const dateA = a.date.split(",").reverse().join("");
        const dateB = b.date.split(",").reverse().join("");
        return dateB.localeCompare(dateA);
      })
      .slice(0, 3);
  }, []); // Empty dependency array since projectData is static/imported

  useEffect(() => {
    // Logic utama scroll (dipisahkan dari event handler langsung)
    const updateScrollState = () => {
      const section = sectionRef.current;
      const scrollContainer = scrollRef.current;
      if (!section || !scrollContainer) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight;

      // Hitung jarak scrollable vertikal
      const scrollableDistance = sectionHeight - viewportHeight;

      // Hitung progress (0.0 sampai 1.0)
      let progress = -rect.top / scrollableDistance;

      // Clamp progress
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Konversi progress vertikal menjadi scroll horizontal
      const maxScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;
      scrollContainer.scrollLeft = progress * maxScrollLeft;

      // --- Active Item Detection ---
      // Hybrid: Visual Calc + Cached Positions
      let closestIndex = 0;
      let minDiff = Number.MAX_VALUE;

      // Cached Padding Left (Visual Focus Point)
      const focusPoint = visualFocusPointRef.current;

      itemPositions.current.forEach((pos, index) => {
        // Posisi visual saat ini = Posisi Asli - ScrollContainer.scrollLeft
        const visualPos = pos - scrollContainer.scrollLeft;

        // Jarak ke titik fokus (Left Edge)
        const diff = Math.abs(visualPos - focusPoint);

        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);

      // --- Snapping Logic (Debounced) ---
      if (snapTimeout.current) clearTimeout(snapTimeout.current);

      snapTimeout.current = setTimeout(() => {
        if (progress > 0.05 && progress < 0.95) {
          // Snap target
          const targetPos = itemPositions.current[closestIndex];
          const targetLeft = targetPos - focusPoint;
          const targetProgress = targetLeft / maxScrollLeft;
          const clampedProgress = Math.min(Math.max(targetProgress, 0), 1);

          const targetScrollY =
            section.offsetTop + clampedProgress * scrollableDistance;

          // Only snap if significantly off to avoid fighting user
          if (Math.abs(targetScrollY - window.scrollY) > 10) {
            window.scrollTo({
              top: targetScrollY,
              behavior: "smooth",
            });
          }
        }
      }, 150);
    };

    const onScroll = () => {
      // Skip if not visible
      if (!isIntersecting.current) return;

      // Throttling with requestAnimationFrame
      if (!ticking.current) {
        requestAnimationFrame(() => {
          updateScrollState();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    const updateCalculations = () => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;

      // Cache Visual Focus Point (Padding Left)
      const style = window.getComputedStyle(scrollContainer);
      visualFocusPointRef.current = parseFloat(style.paddingLeft) || 0;

      // Cache Item Positions
      const containerRect = scrollContainer.getBoundingClientRect();
      const currentScroll = scrollContainer.scrollLeft;

      itemPositions.current = itemRefs.current.map((item) => {
        if (!item) return 0;
        const rect = item.getBoundingClientRect();
        return rect.left + currentScroll - containerRect.left;
      });
    };

    const onResize = () => {
      updateCalculations();
      if (isIntersecting.current) {
        updateScrollState();
      }
    };

    // Use IntersectionObserver to optimize listeners
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting.current = entry.isIntersecting;
        });
      },
      { rootMargin: "100px 0px" }, // Preload/activate slightly before viewport
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Use ResizeObserver for layout changes
    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });

    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Initial Calc
    setTimeout(onResize, 100);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, []);

  // --- Skills Section Scroll Logic ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Start at 0% (which we map to padding-left 100vw in CSS) and move WAY to the left
  // Reduced to -100% and section height to 300vh to avoid empty space on the right
  const xSkills = useTransform(springScroll, [0, 1], ["0%", "-130%"]);

  // --- Education Section Logic ---
  const [activeEduIndex, setActiveEduIndex] = React.useState<number | null>(
    null,
  );
  const educationItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveEduIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    educationItemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // --- Parallax Effect State ---
  const { scrollY } = useScroll();
  const ySoftware = useTransform(scrollY, [0, 500], [0, -150]); // Move up faster
  const yEngineer = useTransform(scrollY, [0, 500], [0, 100]); // Move down
  const yImage = useTransform(scrollY, [0, 500], [0, -50]); // Move up slowly

  return (
    <div className="w-full">
      {/* Home Section */}
      <section
        id="home"
        className="sticky top-0 z-0 flex flex-col items-center justify-end h-screen bg-[#242424] text-black overflow-hidden pb-0"
      >
        {/* Main Typography & Image Container */}
        <div className="relative w-full flex flex-col items-center justify-end mb-10">
          {/* Software Text */}
          <motion.h1
            style={{ y: ySoftware }}
            className={`text-[12vw] sm:text-[13vw] lg:text-[16vw] leading-[0.1] text-[#CAFA0A] text-center z-0 animate-fade-in-down font-rakkas`}
          >
            Software
          </motion.h1>

          {/* Engineer Text Split with Image */}
          <div className="relative w-full flex items-start justify-center z-10 -mt-2 sm:-mt-3 lg:-mt-6 lg:-mb-20">
            {/* "engi" part */}
            <motion.h1
              style={{ y: yEngineer }}
              className={`text-[12vw] sm:text-[13vw] lg:text-[16vw] leading-[1.8] text-[#CAFA0A] z-0 animate-fade-in-up font-rakkas`}
            >
              engi
            </motion.h1>

            {/* Image - Between text, anchored to bottom */}
            <motion.div
              style={{ y: yImage }}
              className="relative mx-2 sm:mx-4 lg:-mx-25 flex items-end"
            >
              <div className="relative w-[280px] h-[370px] sm:w-[370px] sm:h-[470px] lg:w-[470px] lg:h-[580px] transition-transform duration-500 ">
                <Image
                  src="/assets/images/profile/Allam-1.png"
                  alt="Allam Profile"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </motion.div>

            {/* "neer" part */}
            <motion.h1
              style={{ y: yEngineer }}
              className={`text-[12vw] sm:text-[13vw] lg:text-[16vw] leading-[1.8] text-[#CAFA0A] z-0 animate-fade-in-up font-rakkas`}
            >
              neer
            </motion.h1>
          </div>
        </div>

        {/* Right Side Quote */}
        <div className="absolute right-4 top-[70%] sm:right-10 lg:right-20 max-w-[180px] sm:max-w-[220px] lg:max-w-[290px] text-left z-30 animate-fade-in-right animation-delay-600">
          <p className="text-xs sm:text-sm text-[#E0E0E0] leading-relaxed font-reguler font-montserrat-alternates">
            I design and build frontend experiences for web and mobile products,
            focusing on performance, clarity, and intuitive user interactions.
          </p>
        </div>
      </section>

      {/* project Section */}
      <section
        id="project"
        className="relative z-20 min-h-screen bg-[#121212] flex flex-col items-center justify-center py-10 rounded-t-2xl -mt-7"
      >
        {/* Text Quote Tab - top Left */}
        <div className="absolute top-0 left-0 right-0 z-50 hidden lg:block">
          {/* Garis horizontal penuh */}
          <div
            className="h-[25px] rounded-t-2xl"
            style={{ backgroundColor: "#121212" }}
          />

          {/* Kotak dengan teks - Container Utama */}
          <div
            className="absolute bottom-[25px] px-2 pt-2 pb-1 max-w-[260px]"
            style={{
              backgroundColor: "#121212",
              borderRadius: "10px 10px 0px 0px", // Membuat sudut atas sedikit lebih bulat agar serasi
              left: "10%",
            }}
          >
            {/* Lengkungan kiri */}
            <svg
              className="absolute bottom-0 -left-[20px] w-[20px] h-[20px]"
              viewBox="0 0 20 20"
            >
              <path d="M 20 0 Q 20 20 0 20 L 20 20 Z" fill="#121212" />
            </svg>

            {/* Lengkungan kanan */}
            <svg
              className="absolute bottom-0 -right-[20px] w-[20px] h-[20px]"
              viewBox="0 0 20 20"
            >
              <path d="M 0 0 Q 0 20 20 20 L 0 20 Z" fill="#121212" />
            </svg>

            {/* Button Download CV */}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/assets/documents/cvallam.pdf";
                link.download = "cvallam.pdf";
                link.click();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#9D00FF] text-[#000000] px-4 py-2 rounded-lg text-sm font-montserrat-subrayada  hover:bg-gray-100 transition-colors"
            >
              Download CV
              <img
                src="/assets/icons/icontcv.svg"
                alt="download"
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>

        {/* ================= CONTENT PROJECT ================= */}
        <div className="w-full">
          <div
            className="rounded-b-2xl px-4 sm:px-8 lg:px-16 animate-fade-in"
            style={{ backgroundColor: "#121212" }}
          >
            {/* Judul */}
            <div className="mb-10 ml-2 sm:ml-10 lg:ml-16">
              <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-start animate-slide-in-left font-rakkas text-white">
                Latest Project
              </h2>
            </div>

            {/* Wrapper Tombol + Grid */}
            <div className="flex flex-col items-center">
              <div className="max-w-fit">
                {/* Tombol See More */}
                <div className="flex justify-end mb-6">
                  <Link href="/project" passHref>
                    <div className="flex items-center gap-2 text-white font-semibold py-2 px-4 sm:px-5 transition-all duration-300 text-sm font-montserrat-alternates font-thin cursor-pointer border-2 border-[#CAFA0A] hover:bg-[#CAFA0A] hover:text-black group">
                      See more
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform rotate-[90deg] sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1"
                      >
                        <path
                          d="M12 4L12 20M12 4L6 10M12 4L18 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                </div>

                {/* Grid Kartu */}
                <div className="flex justify-center items-center gap-4 sm:gap-6 lg:gap-10 pb-6 sm:pb-10 flex-wrap">
                  {sortedProjectData.map((project, index) => (
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
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative z-30 -mt-10 sm:-mt-16 lg:-mt-20"
        style={{
          background: "linear-gradient(182deg, #121212 50%, #E0E0E0 50%)",
        }}
      >
        <div className="relative w-full overflow-hidden py-4 sm:py-6">
          {/* Container dengan kemiringan -2 derajat */}
          <div className="flex bg-[#CAFA0A] py-3 sm:py-5 rotate-2 scale-105 transform origin-center">
            <div className="flex whitespace-nowrap animate-marquee">
              {/* Group 1 */}
              <div className="flex items-center gap-4 px-2">
                <span className="text-black text-2xl sm:text-4xl lg:text-6xl font-bold font-rakkas uppercase">
                  Mobile Development <span className="mx-4">✦</span>
                  UI/UX Design <span className="mx-4">✦</span>
                  Frontend Engineering <span className="mx-4">✦</span>
                  Product Engineering <span className="mx-4">✦</span>
                </span>
              </div>

              {/* Group 2 (Duplicate for seamless loop) */}
              <div className="flex items-center gap-4 px-2">
                <span className="text-black text-2xl sm:text-4xl lg:text-6xl font-bold font-rakkas uppercase">
                  Mobile Development <span className="mx-4">✦</span>
                  UI/UX Design <span className="mx-4">✦</span>
                  Frontend Engineering <span className="mx-4">✦</span>
                  Product Engineering <span className="mx-4">✦</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        ref={sectionRef}
        id="skills"
        className="relative h-[300vh] bg-[#E0E0E0]"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-start items-start pt-20 ">
          {/* Horizontal Scrolling Track - Contains EVERYTHING */}
          <motion.div
            style={{ x: xSkills }}
            className="flex items-start gap-20 pl-[60vw]" // Start padding at 100vw so it starts off-screen right
          >
            {/* 1. The Title Part of the Track - Higher Z-index to stay on top */}
            <div className="z-10 relative">
              <h2 className="text-8xl font-rakkas text-black leading-none whitespace-nowrap">
                Skills & Expertise
              </h2>
            </div>

            {/* 2. The Images Part of the Track - Wrapped to allow negative margin (overlap under title) */}
            <div className="flex items-center -ml-[30vw] z-0 relative">
              {frondData.map((item, index) => {
                const yOffsets = [
                  20, // Flutter (Mid-High)
                  40, // React (Low)
                  -10, // Next.js (High)
                  30, // TypeScript (Low-Mid)
                  10, // Figma (Center/Mid)
                  45, // Firebase (Very Low)
                  0, // Tailwind (Very High)
                ];

                // Specific Sizes for each item (vh) - Edit these to change size per item
                const sizes = [
                  270, // Flutter
                  205, // React
                  160, // Next.js
                  150, // TypeScript
                  310, // Figma
                  160, // Firebase
                  260, // Tailwind
                ];

                const verticalOffset = yOffsets[index % yOffsets.length] || 0;
                const size = sizes[index % sizes.length] || item.size || 30;

                return (
                  <div
                    key={index}
                    className="flex-shrink-0 relative transition-transform duration-500  mx-10" // Added mx-5 for spacing between items
                    style={{
                      transform: `translateY(${verticalOffset}vh)`,
                    }}
                  >
                    {/* Custom height based on 'sizes' array above, fallback to JSON or 30vh */}
                    <div
                      className="relative w-auto flex items-center justify-center"
                      style={{ height: `${size}px` }}
                    >
                      <Image
                        src={item.image || ""}
                        alt={item.name}
                        width={0}
                        height={0}
                        sizes="50vw"
                        className="w-auto h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>


        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative z-20 bg-[#121212] h-screen overflow-hidden flex flex-col"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          {/* Header - Center */}
          <div className="pt-12 sm:pt-16 mb-8 sm:mb-12 text-center">
            <h2 className="text-3xl sm:text-5xl lg:text-8xl font-rakkas tracking-tight">
              <span className="text-[#CAFA0A]">The</span>{" "}
              <span className="text-[#E0E0E0]">Brain</span>{" "}
              <span className="text-[#CAFA0A]">Behind the Screen</span>
            </h2>
          </div>

          {/* Content Layout - Image Left, Text Right */}
          <div className="flex-1 flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
            {/* Image - Bottom Left - Bigger size */}
            <div className="relative flex-shrink-0 -mb-0">
              <div className="w-[280px] sm:w-[380px] lg:w-[480px]">
                {/* Container cukup atur lebarnya aja, tingginya bakal ngikutin gambar */}
                <Image
                  src="/assets/images/profile/about1.svg"
                  alt="Allam Permata Putra"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto" // Ini kunci buat auto-height
                  priority
                />
              </div>
            </div>

            {/* Text Content - Right Side */}
            <div className="flex-1 flex flex-col justify-start pb-0 mb-0 pt-10">
              {/* "WHO AM I?" text */}
              <div className="mb-4 sm:mb-6 -ml-6 sm:-ml-10 lg:-ml-16 lg:mb-10">
                <span className="text-[#E0E0E0] font-montserrat-subrayada font-bold text-3xl tracking-widest">
                  WHO AM I?
                </span>
              </div>

              {/* Content Box - Smaller text */}
              <p className="text-xs sm:text-sm lg:text-base font-medium text-[#E0E0E0] leading-relaxed font-montserrat-alternates text-justify">
                I&apos;m Allam Permata Putra, a frontend-focused engineer
                building web and mobile products with a strong UI/UX mindset and
                a product-driven approach. I enjoy solving complex
                challenges—crafting clear user flows, high-performance
                interfaces, and intuitive dashboards for growing digital
                platforms. Outside of development, I spend time cycling,
                exploring interface trends, and working on visual details
                through photography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section
        id="education"
        className="relative z-20 bg-[#242424] flex justify-center"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row">
          {/* Left Side: Timeline & Details (SCROLLING) */}
          <div className="w-full lg:w-1/2 flex flex-col relative z-10 pt-[70vh] pb-[60vh]">
            <div className="flex flex-col gap-[40vh] border-l-[3px] border-[#CAFA0A] ml-[80px] sm:ml-[110px] pl-8 lg:pl-12">
              {educationData.map((item, index) => {
                const [start, end] = item.period
                  .split(/-/)
                  .map((s) => s.trim());
                const isActive = index === activeEduIndex;

                return (
                  <div
                    key={index}
                    className="flex gap-6 sm:gap-10 items-center relative transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0.3 }} // Dim inactive items
                    ref={(el) => {
                      educationItemRefs.current[index] = el;
                    }}
                    data-index={index}
                  >
                    {/* Year Column - Absolute Positioned to left of border */}
                    <div
                      className="absolute -left-[100px] sm:-left-[140px] 
             top-1/2 -translate-y-1/2
             flex flex-col text-xl sm:text-2xl font-bold 
             leading-tight text-center w-[80px] 
             font-montserrat-subrayada transition-all duration-500"
                    >
                      <span className={"text-[#000000]"}>{start}</span>
                      <span className={"text-[#000000]"}>{end}</span>
                    </div>

                    <div className="flex flex-col items-start">
                      {/* School Name */}
                      <h3
                        className={`text-xl sm:text-2xl lg:text-3xl font-bold uppercase font-montserrat-subrayada max-w-md leading-normal transition-colors duration-300 ${
                          isActive ? "text-white" : "text-[#4A4A4A]"
                        }`}
                      >
                        {item.school.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>

                      {/* Collapsible Image Box */}
                      <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${isActive ? "max-h-[300px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
                      >
                        <div className="w-[200px] sm:w-[280px] h-[120px] sm:h-[160px] bg-[#D9D9D9] relative">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt="School"
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Title & Image (STICKY) */}
          <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 flex flex-col items-end justify-between py-10 lg:py-0 overflow-visible lg:overflow-visible">
            {/* Title: THE FOUNDATION */}
            <div className="text-left mt-10 lg:mt-16 mb-32 lg:mb-48 z-20 mr-4 lg:mr-10">
              <h2 className="text-5xl sm:text-7xl lg:text-7xl font-bold font-montserrat-subrayada uppercase leading-[0.8] tracking-wide relative">
                <span className="block text-[#E0E0E0] inline-block mb-2 pb-1 relative z-10">
                  THE
                </span>
                <span className="block text-[#E0E0E0] relative z-10">
                  FOUNDATION
                </span>
              </h2>
            </div>

            {/* Profile Image */}
            <div
              className="relative 
  w-[260px] h-[340px] 
  sm:w-[340px] sm:h-[430px] 
  lg:w-[500px] lg:h-[70vh] 
  -mr-10 lg:mr-0 lg:absolute lg:bottom-0 lg:right-32"
            >
              <Image
                src="/assets/images/profile/edu.svg"
                alt="Education Profile"
                fill
                className="object-contain object-bottom-right"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-20 bg-[#E0E0E0] flex flex-col justify-center py-5 px-2 sm:px-8 lg:px-5">
        <div className="w-full ">
          <div className="flex flex-col items-start gap-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight font-montserrat-subrayada">
              INTERESTED IN CONNECTING?
            </h2>

            <p className="text-xl sm:text-2xl lg:text-6xl font-bold text-black font-montserrat-subrayada text-justify">
              IF YOU HAVE ANY QUESTIONS OR WOULD LIKE TO DISCUSS IDEAS, PLEASE
              FEEL FREE TO REACH OUT.
            </p>

            <div className="-mt-8">
              <a
                href="mailto:permataallam7@gmail.com"
                className="inline-flex items-center justify-center bg-[#9D00FF] border-[3px] border-black text-black px-6 py-3 text-lg font-bold uppercase font-montserrat-subrayada hover:bg-[#8000d1] "
              >
                CONTACT ME
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
