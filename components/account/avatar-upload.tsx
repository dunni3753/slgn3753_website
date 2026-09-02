"use client";

import { useRef, useState } from "react";

type Props = {
  name: string;
  avatarUrl: string;
  onAvatarUpdated: (url: string) => void;
};

export function AvatarUpload({ name, avatarUrl, onAvatarUpdated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(avatarUrl);

  const initial = name.charAt(0).toUpperCase();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setError("");
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const signatureResponse = await fetch("/api/account/avatar-signature", {
        method: "POST",
      });
      const signatureData = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error("Could not start upload");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);
      formData.append("api_key", signatureData.apiKey);
      formData.append("folder", signatureData.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const saveResponse = await fetch("/api/account/update-avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: uploadResult.secure_url }),
      });

      const saveResult = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveResult.error || "Could not save your photo");
      }

      onAvatarUpdated(saveResult.avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPreview(avatarUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-accent/10">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-xl font-semibold text-accent">
            {initial}
          </div>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <svg
              className="h-5 w-5 animate-spin text-accent"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8 -8V0C5.4 0 0 5.4 0 12h4Z"
              />
            </svg>
          </div>
        ) : null}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent disabled:opacity-60 cursor-pointer"
        >
          {avatarUrl ? "Change photo" : "Upload photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-1.5 text-xs text-muted">PNG or JPG, up to 5MB.</p>
        {error ? <p className="mt-1.5 text-xs text-alert">{error}</p> : null}
      </div>
    </div>
  );
}
