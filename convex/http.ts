import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Mounts the sign-in / sign-out / token-refresh routes.
auth.addHttpRoutes(http);

export default http;
