import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { generateSlug } from "random-word-slugs";
import { config, ecsClient } from "../lib/config";
import type { Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { ApiError } from "../lib/ApiError";
import { ApiResponse } from "../lib/ApiResponse";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { deleteS3Folder } from "../lib/s3";
import {
    findProjectBySlug,
    createProject,
    createDeployment,
    findProjectsByUserId,
    findProjectById,
    updateProject,
    deleteProject
} from "../repository/project.repository";

const DeployProjectRequestSchema = z.object({
    gitURL: z.string().url(),
    slug: z.string().optional()
});

export const deployProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const parsed = DeployProjectRequestSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, "Invalid request payload");
    }
    const { gitURL, slug } = parsed.data;

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const projectSlug = slug ? slug : generateSlug();
    const subdomain = projectSlug;

    // Check if project already exists
    let project = await findProjectBySlug(projectSlug);

    if (project) {
        // Enforce ownership
        if (project.userId !== user.userId) {
            throw new ApiError(403, "Project slug already in use by another user");
        }
    } else {
        // Create new project
        project = await createProject({
            userId: user.userId,
            name: projectSlug,
            slug: projectSlug,
            subdomain,
            githubUrl: gitURL
        });
    }

    // Create a new deployment
    const deployment = await createDeployment({
        projectId: project.id,
        userId: user.userId
    });

    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                    "subnet-0e26ab4c4831c0cf1",
                    "subnet-0e32138468b835aab",
                    "subnet-0d18d1ab519e9fc7c",
                ],
                securityGroups: ["sg-03fd9e711f664ddab"],
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: "rapidserveimagebuildier",
                    environment: [
                        { name: "GIT_REPOSITORY__URL", value: gitURL },
                        { name: "PROJECT_ID", value: projectSlug },
                        { name: "DEPLOYMENT_ID", value: deployment.id }
                    ],
                },
            ],
        },
    });

    try {
        await ecsClient.send(command);
        return res
            .status(201)
            .json(new ApiResponse(201, {
                project,
                deployment,
                url: `http://${projectSlug}.localhost:8000`
            }, "Deployment queued successfully"));
    } catch (error: any) {
        console.error("ECS Error:", error);
        throw new ApiError(500, `ECS execution failed: ${error.message}`);
    }
});

export const getProjects = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const projects = await findProjectsByUserId(user.userId);
    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

export const getProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const { id } = req.params;
    if (!id || typeof id !== "string") {
        throw new ApiError(400, "Project ID is required");
    }

    const project = await findProjectById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.userId !== user.userId) {
        throw new ApiError(403, "Access denied");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project retrieved successfully"));
});

const UpdateProjectSchema = z.object({
    name: z.string().optional(),
    framework: z.string().nullable().optional(),
    githubUrl: z.string().url().nullable().optional(),
    subdomain: z.string().optional()
});

export const updateProjectController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const { id } = req.params;
    if (!id || typeof id !== "string") {
        throw new ApiError(400, "Project ID is required");
    }

    const parsed = UpdateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new ApiError(400, "Invalid update payload");
    }

    const project = await findProjectById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.userId !== user.userId) {
        throw new ApiError(403, "Access denied");
    }

    const updated = await updateProject(id, parsed.data);
    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Project updated successfully"));
});

export const deleteProjectController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const { id } = req.params;
    if (!id || typeof id !== "string") {
        throw new ApiError(400, "Project ID is required");
    }

    const project = await findProjectById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.userId !== user.userId) {
        throw new ApiError(403, "Access denied");
    }

    // Delete static assets in S3
    const prefix = `__outputs/${project.slug}/`;
    try {
        await deleteS3Folder({ prefix });
        console.log(`Deleted S3 folder with prefix: ${prefix}`);
    } catch (error: any) {
        console.error("Failed to delete S3 folder:", error);
        // Continue deleting project from database even if S3 delete fails
    }

    await deleteProject(id);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Project and associated deployments deleted successfully"));
});
