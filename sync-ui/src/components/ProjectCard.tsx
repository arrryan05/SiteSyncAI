import React from "react";
import { ProjectResponse } from "../types/project.type";
import { FiCode, FiTrash2 } from "react-icons/fi";

interface ProjectCardProps {
  project: ProjectResponse;
  onClick?: () => void;
  onDelete?: () => void;      
}

export default function ProjectCard({
  project,
  onClick,
  onDelete,
}: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl bg-[#1e1e1e] hover:bg-[#2a2a2a] transition p-4 shadow-md border border-gray-700 w-full max-w-sm"
    >
      <h3 className="text-white text-lg font-semibold mb-1">
        {project.name}
      </h3>
      <p className="text-gray-400 text-sm truncate">{project.website}</p>

      {/* Code icon */}
      {/* <FiCode className="absolute bottom-3 left-4 text-gray-500" size={18} /> */}

      {/* Delete icon, shows on hover */}
      {onDelete && (
        <FiTrash2
          size={18}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute bottom-3 right-4 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
          title="Delete project"
        />
      )}
    </div>
  );
}
