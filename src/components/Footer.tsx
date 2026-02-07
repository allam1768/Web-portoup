"use client";

import React from 'react';

export default function Footer() {
  return (
    <section className="relative bg-[#CAFA0A] w-full overflow-hidden pt-5 sm:pt-16">
      {/* Container Utama */}
      <div className="px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Baris Atas: Info & Dots */}
        <div className="flex justify-between items-start -mb-20">
          
          {/* Header Info */}
          <div className="flex flex-col gap-1">
            <h2 className="text-black font-montserrat-subrayada text-2xl font-semibold tracking-tighter leading-none">
              ALLAM
            </h2>
            <div>
              <p className="text-black font-montserrat-subrayada text-xl sm:text-xl leading-tight ">
                FRONTEND ENGINEER
              </p>
              <p className="text-black font-montserrat-subrayada text-xl sm:text-xl leading-tight ">
                FOR WEB & MOBILE PRODUCTS
              </p>
            </div>  
            <p className="text-black text-md mt-4 font-rakkas tracking-widest">
              ©2026 Allam Permata Putra
            </p>
          </div>

          {/* Dots Style dari Gambar */}
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((dot) => (
              <div key={dot} className="w-8 h-8 md:w-10 md:h-10 bg-[#1a1a1a] rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Teks Raksasa "ALLAM" di bagian bawah */}
      <div className="w-full select-none pointer-events-none">
        <h1 className="text-black font-rakkas text-[32vw] leading-[0.8] tracking-tighter translate-y-8 sm:translate-y-12 lg:translate-y-33">
          ALLAM
        </h1>
      </div>

      {/* Social Links (Opsional, diletakkan melayang atau di pojok) */}
      <div className="absolute bottom-4 right-6 md:right-12 flex gap-4 z-20">
         {/* Kamu bisa masukkan icon sosial media di sini jika ingin tetap ada */}
      </div>
    </section>
  );
}