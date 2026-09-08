"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "admin" | "customer";
  createdAt: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(
    new Date(date),
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchUsers() {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      if (!ignore) {
        setUsers(data.users ?? []);
        setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleRoleToggle(user: User) {
    setError("");
    setUpdatingId(user._id);

    const newRole = user.role === "admin" ? "customer" : "admin";

    try {
      const response = await fetch(`/api/admin/users/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong");
        return;
      }

      setRefreshKey((key) => key + 1);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Users</h1>
      <p className="mt-1.5 text-sm text-muted">
        Manage customer accounts and admin access.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg border border-alert/30 bg-alert/5 px-3 py-2 text-sm text-alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <p className="col-span-full text-sm text-muted">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="col-span-full text-sm text-muted">No users yet.</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex flex-col items-center rounded-2xl border border-line bg-surface p-5 text-center"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line text-lg font-semibold">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name?.charAt(0).toUpperCase() ?? "U")
                )}
              </div>

              <p className="mt-3 w-full truncate font-semibold">{user.name}</p>
              <p className="w-full truncate text-xs text-muted">{user.email}</p>
              <p className="mt-1 text-xs text-muted">
                Joined {formatDate(user.createdAt)}
              </p>

              <span
                className={`mt-3 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                  user.role === "admin"
                    ? "border-accent/30 text-accent"
                    : "border-line text-muted"
                }`}
              >
                {user.role}
              </span>

              <button
                type="button"
                onClick={() => handleRoleToggle(user)}
                disabled={updatingId === user._id}
                className="mt-4 w-full rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent disabled:opacity-50 cursor-pointer"
              >
                {updatingId === user._id
                  ? "Updating..."
                  : user.role === "admin"
                    ? "Make customer"
                    : "Make admin"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
