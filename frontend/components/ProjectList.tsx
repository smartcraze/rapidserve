"use client";

import { useState, useEffect } from "react";

interface Project {
  projectSlug: string;
  deploymentType: "docker" | "ecs";
  containerId?: string;
  url: string;
  timestamp: number;
}

interface ProjectListProps {
  onSelectProject: (projectSlug: string) => void;
  newProject?: {
    projectSlug: string;
    deploymentType: "docker" | "ecs";
    containerId?: string;
    url: string;
  };
}

export default function ProjectList({
  onSelectProject,
  newProject,
}: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Load projects from local storage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("rapidserve-projects");
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
  }, []);

  // Save projects to local storage when they change
  useEffect(() => {
    localStorage.setItem("rapidserve-projects", JSON.stringify(projects));
  }, [projects]);

  // Add new project when it comes in
  useEffect(() => {
    if (newProject) {
      // Check if project already exists to avoid duplicates
      const exists = projects.some(
        (p) => p.projectSlug === newProject.projectSlug,
      );

      if (!exists) {
        const updatedProjects = [
          {
            ...newProject,
            timestamp: Date.now(),
          },
          ...projects,
        ];

        setProjects(updatedProjects);
        setSelectedSlug(newProject.projectSlug);
        onSelectProject(newProject.projectSlug);
      }
    }
  }, [newProject, projects, onSelectProject]);

  // Handle project selection
  const handleSelect = (slug: string) => {
    setSelectedSlug(slug);
    onSelectProject(slug);
  };

  // Remove a project from the list
  const handleRemove = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    const updatedProjects = projects.filter((p) => p.projectSlug !== slug);
    setProjects(updatedProjects);

    if (selectedSlug === slug) {
      const nextProject = updatedProjects[0];
      if (nextProject) {
        setSelectedSlug(nextProject.projectSlug);
        onSelectProject(nextProject.projectSlug);
      } else {
        setSelectedSlug(null);
      }
    }
  };

  if (projects.length === 0) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No projects deployed yet
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-medium">Recent Projects</h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {projects.map((project) => (
          <div
            key={project.projectSlug}
            onClick={() => handleSelect(project.projectSlug)}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer
                      ${selectedSlug === project.projectSlug ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{project.projectSlug}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Deployment type: {project.deploymentType}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(project.timestamp).toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300
                           dark:hover:bg-gray-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  View
                </a>
                <button
                  onClick={(e) => handleRemove(e, project.projectSlug)}
                  className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700
                           dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/20
                           transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
