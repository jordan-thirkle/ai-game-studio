import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the Eigen Studio team — seven AI agents building games through iterative scoring.",
};

const team = [
  { name: "Vex", role: "Direction", desc: "Creative lead and project vision" },
  { name: "Flux", role: "Systems", desc: "Architecture and technical design" },
  { name: "Prism", role: "Visual", desc: "Art direction and visual polish" },
  { name: "Bastion", role: "Reliability", desc: "Performance and stability" },
  { name: "Echo", role: "Testing", desc: "Quality assurance and feedback" },
  { name: "Verse", role: "Narrative", desc: "Story and world building" },
  { name: "Beacon", role: "Docs", desc: "Documentation and communication" },
];

const steps = [
  {
    num: "01",
    title: "Define",
    desc: "Set the vision, scope, and success criteria for each build.",
  },
  {
    num: "02",
    title: "Build",
    desc: "Rapid prototyping with AI agents. Ship playable builds fast.",
  },
  {
    num: "03",
    title: "Score",
    desc: "Evidence-based evaluation across gameplay, visuals, audio, performance.",
  },
  {
    num: "04",
    title: "Learn",
    desc: "Analyze scores, identify gaps, plan the next iteration.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Mission */}
      <section className="section-container py-24">
        <Reveal>
          <SectionHeading
            eyebrow="ABOUT"
            title="AI-Native Game Development"
            description="Eigen Studio is a seven-agent team building games through iterative scoring and evidence-based improvement. Every build is measured, every iteration is tracked."
          />
        </Reveal>
        <Reveal delay={100}>
          <GlassCard className="p-8 md:p-12 max-w-3xl">
            <h3 className="text-[var(--color-eigen-cream)] mb-4">Our Mission</h3>
            <p className="text-[var(--color-eigen-muted)] leading-relaxed">
              We believe game development can be faster, more transparent, and more
              evidence-driven. By combining AI agents with structured scoring, we ship
              playable builds quickly and improve them systematically. Every game we
              release has a visible score history — you can see exactly how it evolved.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      {/* Agent Grid */}
      <section className="section-container py-24" aria-labelledby="team-heading">
        <Reveal>
          <SectionHeading
            eyebrow="TEAM"
            title="The Agents"
            description="Seven specialized agents, each with a distinct role in the development pipeline."
          />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((agent, i) => (
            <Reveal key={agent.name} delay={i * 80}>
              <GlassCard className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-eigen-green)]/20 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                  <span className="text-lg font-bold text-[var(--color-eigen-green)]">{agent.name[0]}</span>
                </div>
                <h3 className="text-[var(--color-eigen-cream)] text-base mb-1">{agent.name}</h3>
                <p className="text-xs font-mono text-[var(--color-eigen-bright)] uppercase tracking-wider mb-2">{agent.role}</p>
                <p className="text-xs text-[var(--color-eigen-muted)]">{agent.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-container py-24" aria-labelledby="process-heading">
        <Reveal>
          <SectionHeading
            eyebrow="PROCESS"
            title="How We Work"
          />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 100}>
              <GlassCard className="p-8">
                <span className="eyebrow text-[var(--color-eigen-green)]">{step.num}</span>
                <h3 className="text-[var(--color-eigen-cream)] mt-2 mb-3">{step.title}</h3>
                <p className="text-sm text-[var(--color-eigen-muted)]">{step.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
