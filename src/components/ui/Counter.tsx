"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function Counter({ value, suffix = "", label }: CounterProps) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1200;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="text-center">
      <span
        ref={ref}
        className="block text-4xl md:text-5xl font-bold text-[var(--color-eigen-gold)] tabular-nums"
      >
        {displayed}
        {suffix}
      </span>
      <span className="mt-2 block text-sm text-[var(--color-eigen-muted)] uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}
