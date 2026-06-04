import { Router } from "express";
import {
    deployProject,
    getProjects,
    getProject,
    updateProjectController,
    deleteProjectController,
    checkSlugAvailability
} from "../controller/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const projectRouter = Router();

projectRouter.use(authMiddleware);
projectRouter.post("/deploy", deployProject);
projectRouter.get("/", getProjects);
projectRouter.get("/check-slug/:slug", checkSlugAvailability);
projectRouter.get("/:id", getProject);
projectRouter.patch("/:id", updateProjectController);
projectRouter.delete("/:id", deleteProjectController);

export { projectRouter };
