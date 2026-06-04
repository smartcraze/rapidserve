import { Router } from "express";
import {
    deployProject,
    getProjects,
    getProject,
    updateProjectController,
    deleteProjectController
} from "../controller/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const projectRouter = Router();

projectRouter.use(authMiddleware);
projectRouter.post("/", deployProject);
projectRouter.get("/", getProjects);
projectRouter.get("/:id", getProject);
projectRouter.patch("/:id", updateProjectController);
projectRouter.delete("/:id", deleteProjectController);

export { projectRouter };
