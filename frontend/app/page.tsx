"use client";

import { useState } from "react";
import Image from "next/image";
import ProjectForm from "@/components/ProjectForm";
import LogViewer from "@/components/LogViewer";
import ProjectList from "@/components/ProjectList";
import { ProjectResponse } from "@/lib/api-client";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<
    ProjectResponse["data"] | undefined
  >(undefined);

  const handleDeploySuccess = (projectData: ProjectResponse["data"]) => {
    setNewProject(projectData);
    setSelectedProject(projectData.projectSlug);
  };

  const handleSelectProject = (projectSlug: string) => {
    setSelectedProject(projectSlug);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">RapidServe</h1>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
          Deploy and monitor your projects with RapidServe. Connect to logs in
          real-time and manage your deployments efficiently.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProjectForm onDeploySuccess={handleDeploySuccess} />
            <ProjectList
              onSelectProject={handleSelectProject}
              newProject={newProject}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="h-[600px]">
              <LogViewer projectSlug={selectedProject || undefined} />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>RapidServe - Real-time project deployment and monitoring</p>
      </footer>
    </div>
  );
}
