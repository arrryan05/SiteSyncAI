"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/usAuth";
import { ProjectResponse } from "../../types/project.type";
import ProjectCard from "../../components/ProjectCard";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { API_ROUTES } from "@/config";

export default function DashboardPage() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!token) return router.push("/auth/login");
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    const res = await fetch(API_ROUTES.PROJECT_LIST, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const { projects } = await res.json();
      setProjects(projects);
    }
  };

  const createProject = async () => {
    if (!projectName.trim() || !website.trim()) return;
    setLoading(true);
    const res = await fetch(API_ROUTES.PROJECT_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: projectName, website }),
    });
    if (res.ok) {
      setProjectName("");
      setWebsite("");
      setOpen(false);
      fetchProjects();
    }
    setLoading(false);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const res = await fetch(API_ROUTES.PROJECT_DELETE(projectId), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      fetchProjects(); // Refresh project list
    } else {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 mt-10 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Your Projects</h1>
        <button
          className="px-4 py-2 border border-blue-400 text-whit e-400 rounded-full hover:bg-gray-800 transition"
          onClick={() => setOpen(true)}
        >
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => router.push(`/dashboard/${p.id}`)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Create New Project
            </h2>
            <Input
              className="mb-3"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Input
              className="mb-4"
              placeholder="Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <Button onClick={createProject} disabled={loading}>
                {loading ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
