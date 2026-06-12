"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

type HeroSlide = {
  src: string;
  alt: string;
};

const fallbackSlides: HeroSlide[] = [
  { src: "/assets/baner1.png", alt: "Special Pre-Order & Limited Offers - 15% Off" },
  { src: "/assets/baner2.png", alt: "New Arrivals - Order Now" },
  { src: "/assets/baner3.png", alt: "Special Offers of the Month" },
];

export function HeroCarousel({ slides: providedSlides }: { slides?: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const slides = providedSlides?.length ? providedSlides : fallbackSlides;
  const total = slides.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (index: number) => {
    setCurrent(((index % total) + total) % total);
  };

  const startAutoPlay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
  };

  const resetAutoPlay = () => {
    startAutoPlay();
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total]);

  // Touch handling
  const [touchStart, setTouchStart] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAutoPlay();
    }
  };

  return (
    <section
      className="hero-carousel"
      onMouseEnter={() => {
        if (timerRef.current) clearInterval(timerRef.current);
      }}
      onMouseLeave={startAutoPlay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <Image src={slide.src} alt={slide.alt} fill sizes="100vw" priority={index === 0} className="object-cover" />
          </div>
        ))}
      </div>
      <button
        className="carousel-btn prev"
        onClick={() => {
          goTo(current - 1);
          resetAutoPlay();
        }}
        aria-label="Previous slide"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        className="carousel-btn next"
        onClick={() => {
          goTo(current + 1);
          resetAutoPlay();
        }}
        aria-label="Next slide"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === current ? "active" : ""}`}
            onClick={() => {
              goTo(index);
              resetAutoPlay();
            }}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
}
