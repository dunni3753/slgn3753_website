"use client";

import { passwordRequirements, getPasswordScore } from "@/lib/password";

const strengthLevels = [
  { label: "Very weak", color: "bg-alert" },
  { label: "Weak", color: "bg-alert" },
  { label: "Fair", color: "bg-accent" },
  { label: "Good", color: "bg-accent" },
  { label: "Strong", color: "bg-live" },
];

export function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordScore(password);
  const level = strengthLevels[Math.max(score - 1, 0)] ?? strengthLevels[0];

  if (password.length === 0) return null;

  return (
    <div className="mt-2.5 space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {passwordRequirements.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index < score ? level.color : "bg-line"
              }`}
            />
          ))}
        </div>
        <span className="w-16 shrink-0 text-right text-xs font-medium text-muted">
          {level.label}
        </span>
      </div>

      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {passwordRequirements.map((requirement) => {
          const met = requirement.test(password);
          return (
            <li
              key={requirement.label}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                met ? "text-live" : "text-muted"
              }`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="shrink-0"
              >
                {met ? (
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <circle cx="12" cy="12" r="8" />
                )}
              </svg>
              {requirement.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
