interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-12 md:mb-16 ${alignClass}`}>
      {eyebrow && (
        <p className="eyebrow mb-4">{eyebrow}</p>
      )}
      <h2 className="text-[var(--color-eigen-cream)]">{title}</h2>
      {description && (
        <p className="body-large mt-4 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
