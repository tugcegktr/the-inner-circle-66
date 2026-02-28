import React, { useState } from "react";

interface StarRatingProps {
  value: number;           // 0–5, can be 0 if not rated
  onChange?: (v: number) => void;  // if provided → interactive
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  label?: string;
}

export const StarRating = ({
  value,
  onChange,
  size = "md",
  showCount = false,
  count,
  label,
}: StarRatingProps) => {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: "text-sm gap-0.5",
    md: "text-xl gap-1",
    lg: "text-2xl gap-1.5",
  };

  const displayValue = onChange ? (hover || value) : value;

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <p className="text-xs text-muted-foreground tracking-wider uppercase">{label}</p>}
      <div className={`flex items-center ${sizes[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayValue;
          const halfFilled = !filled && star - 0.5 <= displayValue;
          return (
            <button
              key={star}
              disabled={!onChange}
              onMouseEnter={() => onChange && setHover(star)}
              onMouseLeave={() => onChange && setHover(0)}
              onClick={() => onChange && onChange(star)}
              className={`transition-all ${onChange ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"}`}
              style={{
                color: filled || halfFilled ? "hsl(var(--gold))" : "hsl(var(--border))",
                filter: filled ? "drop-shadow(0 0 4px hsl(43 74% 57% / 0.5))" : "none",
                background: "none",
                border: "none",
                padding: 0,
              }}
            >
              ★
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <p className="text-xs text-muted-foreground">
          {value > 0 ? value.toFixed(1) : "—"}
          {count > 0 && <span className="ml-1">({count} değerlendirme)</span>}
        </p>
      )}
    </div>
  );
};
