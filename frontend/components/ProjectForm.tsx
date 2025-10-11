"use client";

import { useState } from "react";
import {
  createProject,
  ProjectCreationParams,
  ProjectResponse,
} from "@/lib/api-client";

interface ProjectFormProps {
  onDeploySuccess: (projectData: ProjectResponse["data"]) => void;
}

export default function ProjectForm({ onDeploySuccess }: ProjectFormProps) {
  const [gitURL, setGitURL] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [useECS, setUseECS] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gitURL) {
      setError("Git repository URL is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const params: ProjectCreationParams = {
        gitURL,
        useECS,
      };

      if (projectSlug) {
        params.slug = projectSlug;
      }

      const response = await createProject(params);

      setSuccess(
        `Project queued successfully! Deployment type: ${response.data.deploymentType}`,
      );
      setGitURL("");
      setProjectSlug("");

      // Notify parent component
      onDeploySuccess(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-medium">Deploy New Project</h2>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="gitURL" className="block mb-2 text-sm font-medium">
              Git Repository URL
            </label>
            <input
              id="gitURL"
              type="url"
              value={gitURL}
              onChange={(e) => setGitURL(e.target.value)}
              placeholder="https://github.com/username/repo.git"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="projectSlug"
              className="block mb-2 text-sm font-medium"
            >
              Project Slug (optional)
            </label>
            <input
              id="projectSlug"
              type="text"
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              placeholder="my-awesome-project"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                        bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 
                        focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Leave empty to generate a random slug
            </p>
          </div>

          <div className="mb-4 flex items-center">
            <input
              id="useECS"
              type="checkbox"
              checked={useECS}
              onChange={(e) => setUseECS(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="useECS" className="ml-2 block text-sm">
              Use ECS (Production) instead of local Docker
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 
                      disabled:pointer-events-none"
          >
            {isLoading ? "Deploying..." : "Deploy Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
