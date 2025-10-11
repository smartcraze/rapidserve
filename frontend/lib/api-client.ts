/**
 * API client for RapidServe backend
 */

export interface ProjectCreationParams {
  gitURL: string;
  slug?: string;
  useECS?: boolean;
}

export interface ProjectResponse {
  status: string;
  data: {
    projectSlug: string;
    deploymentType: "docker" | "ecs";
    containerId?: string;
    url: string;
  };
}

export interface ApiErrorResponse {
  error: string;
}

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

/**
 * Creates a new project deployment
 */
export async function createProject(
  params: ProjectCreationParams,
): Promise<ProjectResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create project");
    }

    return data as ProjectResponse;
  } catch (error: any) {
    throw new Error(`API Error: ${error.message}`);
  }
}
