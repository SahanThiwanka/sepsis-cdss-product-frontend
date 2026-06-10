"use client";

import { useEffect, useState } from "react";
import { createUser, getStoredUser, getUsers } from "@/lib/auth";
import { User } from "@/types/auth";

type Role = "admin" | "clinician" | "researcher";

export default function UsersPage() {
  const currentUser = getStoredUser();

  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("clinician");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    setErrorMessage("");

    try {
      const items = await getUsers();
      setUsers(items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    setCreating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createUser({
        username,
        password,
        full_name: fullName || undefined,
        role,
      });

      setUsername("");
      setFullName("");
      setPassword("");
      setRole("clinician");
      setSuccessMessage("User created successfully.");
      await loadUsers();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create user."
      );
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (currentUser?.role !== "admin") {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-slate-600">
            Only admin users can manage system accounts.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold">User Management</h1>
            <p className="mt-2 text-slate-600">
              Create and review CDSS users with role-based access control.
            </p>
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Create New User</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="doctor01"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Doctor Name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Temporary password"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Role</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
              >
                <option value="clinician">Clinician</option>
                <option value="researcher">Researcher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateUser}
            disabled={creating || !username || !password}
            className="mt-5 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {creating ? "Creating..." : "Create User"}
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">System Users</h2>

          {loading ? (
            <p className="mt-4 text-slate-600">Loading users...</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 pr-4 font-semibold">Username</th>
                    <th className="py-3 pr-4 font-semibold">Full Name</th>
                    <th className="py-3 pr-4 font-semibold">Role</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-semibold">
                        {user.username}
                      </td>
                      <td className="py-3 pr-4">{user.full_name ?? "-"}</td>
                      <td className="py-3 pr-4 capitalize">{user.role}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {new Date(user.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}