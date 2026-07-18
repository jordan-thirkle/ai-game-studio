interface ScoreBadgeProps {
  score: number;
  grade: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, grade, size = "md" }: ScoreBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span className={`score-badge ${sizeClasses[size]}`} aria-label={`Score: ${score} out of 100, Grade ${grade}`}>
      <span>{score}/100</span>
      <span className="grade">{grade}</span>
    </span>
  );
}
