import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import authenticationRoutes from "./routes/authentication";
import checkinRoutes from "./routes/checkins";
import conditionTypeRoutes from "./routes/condition-type";
import projectRoutes from "./routes/projects";
import statusTypeRoutes from "./routes/status-type";
import toolRoutes from "./routes/tools";

const app = new Elysia().get("/", () => "Hello Elysia").use(swagger());

app.group("/api", (app) =>
    app
        .use(authenticationRoutes)
        .use(checkinRoutes)
        .use(conditionTypeRoutes)
        .use(statusTypeRoutes)
        .use(projectRoutes)
        .use(toolRoutes)
).listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
