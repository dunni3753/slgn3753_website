"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { PasswordStrength } from "@/components/password-strength";
import { isPasswordStrongEnough } from "@/lib/password";
import { AvatarUpload } from "./avatar-upload";

type Props = {
  name: string;
  email: string;
  avatarUrl: string;
  memberSince: string;
};

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "wallet", label: "Wallet" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AccountView({ name, email, avatarUrl, memberSince }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [currentName, setCurrentName] = useState(name);
  const [currentAvatar, setCurrentAvatar] = useState(avatarUrl);

  const initial = currentName.charAt(0).toUpperCase();
  const joined = memberSince
    ? new Date(memberSince).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {currentAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentAvatar}
              alt={currentName}
              className="h-14 w-14 shrink-0 rounded-full border border-line object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 font-display text-xl font-semibold text-accent">
              {initial}
            </div>
          )}
          <div>
            <p className="font-display text-xl font-semibold">{currentName}</p>
            <p className="text-sm text-muted">{email}</p>
            {joined ? (
              <p className="mt-0.5 text-xs text-muted">Member since {joined}</p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-alert hover:text-alert"
        >
          Log out
        </button>
      </div>

      <div className="mt-10 flex gap-1 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "profile" ? (
          <ProfileTab
            currentName={currentName}
            onNameUpdated={setCurrentName}
            email={email}
            avatarUrl={currentAvatar}
            onAvatarUpdated={setCurrentAvatar}
          />
        ) : null}
        {activeTab === "orders" ? <OrdersTab /> : null}
        {activeTab === "wallet" ? <WalletTab /> : null}
      </div>
    </section>
  );
}

function ProfileTab({
  currentName,
  onNameUpdated,
  email,
  avatarUrl,
  onAvatarUpdated,
}: {
  currentName: string;
  onNameUpdated: (name: string) => void;
  email: string;
  avatarUrl: string;
  onAvatarUpdated: (url: string) => void;
}) {
  const [name, setName] = useState(currentName);
  const [nameStatus, setNameStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [nameError, setNameError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [passwordError, setPasswordError] = useState("");

  async function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameStatus("loading");
    setNameError("");

    const response = await fetch("/api/account/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();

    if (!response.ok) {
      setNameStatus("error");
      setNameError(result.error || "Something went wrong");
      return;
    }

    onNameUpdated(result.name);
    setNameStatus("success");
    setTimeout(() => setNameStatus("idle"), 2000);
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");

    if (!isPasswordStrongEnough(newPassword)) {
      setPasswordError("Please choose a stronger password");
      return;
    }

    setPasswordStatus("loading");

    const response = await fetch("/api/account/change-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      setPasswordStatus("error");
      setPasswordError(result.error || "Something went wrong");
      return;
    }

    setPasswordStatus("success");
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordStatus("idle"), 2500);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="font-semibold">Profile photo</p>
        <p className="mt-1 text-sm text-muted">
          This appears next to your name across the site.
        </p>
        <div className="mt-5">
          <AvatarUpload
            name={currentName}
            avatarUrl={avatarUrl}
            onAvatarUpdated={onAvatarUpdated}
          />
        </div>
      </div>
      <form
        onSubmit={handleNameSubmit}
        className="rounded-2xl border border-line bg-surface p-6"
      >
        <p className="font-semibold">Personal details</p>
        <p className="mt-1 text-sm text-muted">
          Update the name on your account.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email address</label>
            <input
              value={email}
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-line bg-background px-3 py-2.5 text-sm text-muted outline-none"
            />
          </div>
        </div>

        {nameError ? (
          <p className="mt-3 text-sm text-alert">{nameError}</p>
        ) : null}

        <button
          type="submit"
          disabled={nameStatus === "loading"}
          className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {nameStatus === "loading"
            ? "Saving..."
            : nameStatus === "success"
              ? "Saved"
              : "Save changes"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-line bg-surface p-6"
      >
        <p className="font-semibold">Change password</p>
        <p className="mt-1 text-sm text-muted">
          Choose a strong password you do not use elsewhere.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <PasswordStrength password={newPassword} />
          </div>
        </div>

        {passwordError ? (
          <p className="mt-3 text-sm text-alert">{passwordError}</p>
        ) : null}

        <button
          type="submit"
          disabled={passwordStatus === "loading"}
          className="mt-5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {passwordStatus === "loading"
            ? "Updating..."
            : passwordStatus === "success"
              ? "Password updated"
              : "Update password"}
        </button>
      </form>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path
            d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2 -1.6L21 8H6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-4 font-semibold">No orders yet</p>
      <p className="mt-1 text-sm text-muted">
        Once you place an order, it will show up here.
      </p>
    </div>
  );
}

function WalletTab() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-line text-muted">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18M16 14.5h2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="mt-4 font-semibold">Wallet coming soon</p>
      <p className="mt-1 text-sm text-muted">
        Fund your wallet and pay for orders instantly, launching soon.
      </p>
    </div>
  );
}
