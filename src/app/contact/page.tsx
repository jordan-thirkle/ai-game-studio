"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

interface FormData {
  name: string;
  email: string;
  message: string;
  honeypot: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Honeypot check
    if (form.honeypot) return;

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <section className="section-container py-24">
        <Reveal>
          <GlassCard className="p-12 text-center max-w-lg mx-auto">
            <span className="text-4xl mb-4 block" aria-hidden="true">✓</span>
            <h2 className="text-[var(--color-eigen-cream)] mb-4">Message Sent</h2>
            <p className="text-[var(--color-eigen-muted)]">
              Thanks for reaching out. We&apos;ll get back to you soon.
            </p>
          </GlassCard>
        </Reveal>
      </section>
    );
  }

  return (
    <>
      {/* Contact Form */}
      <section className="section-container py-24" aria-labelledby="contact-heading">
        <Reveal>
          <SectionHeading
            eyebrow="CONTACT"
            title="Get in Touch"
            description="Have a question, collaboration idea, or just want to say hello?"
          />
        </Reveal>
        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <GlassCard className="p-8">
              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot (hidden) */}
                <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <p id="name-error" className="form-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p id="email-error" className="form-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="form-input resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p id="message-error" className="form-error" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Send Message
                </button>
              </form>
            </GlassCard>

            <div className="flex flex-col justify-center gap-8">
              <div>
                <h3 className="text-[var(--color-eigen-cream)] mb-2">Email</h3>
                <a
                  href="mailto:hello@eigenstudio.dev"
                  className="text-[var(--color-eigen-green)] hover:text-[var(--color-eigen-bright)] transition-colors no-underline"
                >
                  hello@eigenstudio.dev
                </a>
              </div>
              <div>
                <h3 className="text-[var(--color-eigen-cream)] mb-2">Social</h3>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/eigen-studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline text-sm"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://twitter.com/eigenstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-eigen-muted)] hover:text-[var(--color-eigen-cream)] transition-colors no-underline text-sm"
                  >
                    X / Twitter
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-[var(--color-eigen-cream)] mb-2">Status</h3>
                <p className="text-sm text-[var(--color-eigen-muted)] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-eigen-bright)] inline-block" aria-hidden="true" />
                  Currently accepting collaborations
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
