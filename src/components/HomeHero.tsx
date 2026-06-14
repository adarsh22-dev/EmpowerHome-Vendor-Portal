"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    image: "https://picsum.photos/seed/hero1/1920/1080?blur=2",
    tag: "NEXUS MARKETPLACE • GLOBAL B2B & B2C",
    title: "THE FUTURE OF COMMERCE.",
    desc: "Direct from verified vendors. Wholesale pricing for businesses. Premium quality for everyone."
  },
  {
    image: "https://picsum.photos/seed/hero2/1920/1080?blur=2",
    tag: "EXCLUSIVE DEALS • LIMITED TIME",
    title: "PREMIUM TECH SELECTION.",
    desc: "Upgrade your lifestyle with our curated collection of high-end electronics and smart home devices."
  },
  {
    image: "https://picsum.photos/seed/hero3/1920/1080?blur=2",
    tag: "SUSTAINABLE LIVING • ECO-FRIENDLY",
    title: "GREEN ENERGY SOLUTIONS.",
    desc: "Discover the latest in solar technology and sustainable products for a better tomorrow."
  }
];

export const HomeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="px-4 sm:px-6">
      <div className="max-w-7xl mx-auto relative h-[500px] sm:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img 
              src={slides[currentSlide].image} 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
              alt="Hero background"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-24 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6 w-fit"
              >
                {slides[currentSlide].tag}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] sm:leading-none mb-4 sm:mb-6"
              >
                {slides[currentSlide].title.split('.').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}{i < arr.length - 1 ? <br /> : ''}
                  </React.Fragment>
                ))}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 text-base sm:text-xl max-w-xs sm:max-w-md mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none"
              >
                {slides[currentSlide].desc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Link 
                  href="/products"
                  className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Explore Marketplace <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link 
                  href="/vendor-auth"
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold hover:bg-white/20 transition-colors text-sm sm:text-base"
                >
                  Become a Vendor
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-12 h-1 rounded-full transition-all ${currentSlide === i ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
