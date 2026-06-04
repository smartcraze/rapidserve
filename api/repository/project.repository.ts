import { prisma } from "../lib/prisma";

export type CreateProjectInput = {
    userId: string;
    name: string;
    slug: string;
    subdomain: string;
    framework?: string | null;
    githubUrl?: string | null;
};

export type CreateDeploymentInput = {
    projectId: string;
    userId: string;
};

export const findProjectBySlug = (slug: string) => {
    return prisma.project.findUnique({ where: { slug } });
};

export const createProject = (input: CreateProjectInput) => {
    return prisma.project.create({ data: input });
};

export const createDeployment = (input: CreateDeploymentInput) => {
    return prisma.deployment.create({ data: input });
};

export const findProjectsByUserId = (userId: string) => {
    return prisma.project.findMany({ where: { userId } });
};

export const findDeploymentsByProjectId = (projectId: string) => {
    return prisma.deployment.findMany({ where: { projectId } });
};

export const findProjectById = (id: string) => {
    return prisma.project.findUnique({ where: { id } });
};

export const updateProject = (id: string, data: { name?: string; framework?: string | null; githubUrl?: string | null; subdomain?: string; status?: any }) => {
    return prisma.project.update({
        where: { id },
        data
    });
};

export const deleteProject = (id: string) => {
    return prisma.project.delete({ where: { id } });
};

