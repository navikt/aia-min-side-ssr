import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import example from "./data/example.json";

const api = new Hono();

// Enable CORS for all routes
api.use(
  "/*",
  cors({
    origin: "http://localhost:4321",
    credentials: true,
  }),
);

api.get("/api/tms-astro-template", (c) => {
  return c.json(example);
});

serve(api);
