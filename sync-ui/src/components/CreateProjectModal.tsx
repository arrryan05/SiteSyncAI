"use client";
import { useState } from "react";
import { API_ROUTES } from "@/config";

export default function CreateProjectModal({
  open,
  onClose,
  onProjectCreated,
}: any) {
  const [form, setForm] = useState({ name: "", website: "" });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ROUTES.PROJECT_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: "", website: "" });
        onProjectCreated();
        onClose();
      }
    } catch (err) {
      console.error("Error creating project", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-[#1a1a2e] p-6 rounded-xl w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          className="w-full p-2 mb-3 rounded bg-[#2a2a40]"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Website"
          className="w-full p-2 mb-4 rounded bg-[#2a2a40]"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-300 hover:underline">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 px-4 py-2 rounded text-white font-semibold hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
