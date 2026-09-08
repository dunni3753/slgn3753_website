"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Slide = {
  src?: string;
  alt: string;
  label: string;
};

const defaultSlides: Slide[] = [
  {
    src: "/assets/images/image1.webp",
    alt: "CCTV camera installed on site",
    label: "CCTV installation, Lekki",
  },
  {
    src: "/assets/images/image2.webp",
    alt: "Electric fence installed around a compound",
    label: "Electric fencing, Ikeja",
  },
  {
    src: "/assets/images/image3.webp",
    alt: "Video intercom installed at a gate",
    label: "Intercom setup, Victoria Island",
  },
  {
    src: "/assets/images/image4.webp",
    alt: "Fire alarm panel installed on a wall",
    label: "Fire alarm panel, Ajah",
  },
];

const TRANSITION_MS = 700;

export function HeroSlider({
  slides = defaultSlides,
  interval = 4500,
}: {
  slides?: Slide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function goTo(next: number) {
    const wrapped = (next + slides.length) % slides.length;
    if (wrapped === index) return;

    setPrevIndex(index);
    setIndex(wrapped);

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => {
      setPrevIndex(null);
    }, TRANSITION_MS);
  }

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      goTo(index + 1);
    }, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, slides.length, interval, index]);

  const current = slides[index];
  const mountedIndexes = prevIndex !== null ? [prevIndex, index] : [index];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {mountedIndexes.map((slideIndex) => {
        const slide = slides[slideIndex];
        const isActive = slideIndex === index;

        return (
          <div
            key={slideIndex}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${TRANSITION_MS}ms`,
            }}
            aria-hidden={!isActive}
          >
            {slide.src ? (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={slideIndex === 0 && prevIndex === null && index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 via-transparent to-accent/5">
                <div className="flex flex-col items-center gap-3 text-muted/50">
                  <svg
                    width="52"
                    height="52"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <rect x="3" y="6" width="14" height="12" rx="2" />
                    <path d="M17 10l4 -2.5v9L17 14" strokeLinejoin="round" />
                  </svg>
                  <span className="font-mono text-[11px] uppercase tracking-widest">
                    Photo goes here
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/15 to-transparent" />

      <div
        aria-live="polite"
        className="absolute bottom-4 left-4 rounded-full bg-background/80 px-3 py-1 font-mono text-xs text-muted"
      >
        {current.label}
      </div>

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="absolute right-14 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:text-accent sm:flex"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 5l-7 7 7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:text-accent sm:flex"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Go to photo ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                className={`h-1.5 rounded-full transition-all ${
                  dotIndex === index
                    ? "w-5 bg-accent"
                    : "w-1.5 bg-background/80"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
