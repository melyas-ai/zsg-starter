import type { Express } from "express";
import { createServer, type Server } from "http";
import countriesRouter from "./routes/countries";
import citiesRouter from "./routes/cities";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/countries", countriesRouter);
  app.use("/api/cities", citiesRouter);

  return createServer(app);
}
