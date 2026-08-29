export type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

export const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function getPasswordScore(password: string) {
  return passwordRequirements.filter((requirement) =>
    requirement.test(password),
  ).length;
}

export function isPasswordStrongEnough(password: string) {
  return getPasswordScore(password) === passwordRequirements.length;
}
