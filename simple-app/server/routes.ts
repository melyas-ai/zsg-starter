import type { Express } from "express";
import { createServer, type Server } from "http";
import countriesRouter from "./routes/countries";
import citiesRouter from "./routes/cities";
import geocodeRouter from "./routes/geocode";
import briefsRouter from "./routes/briefs";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/countries", countriesRouter);
  app.use("/api/cities", citiesRouter);
  app.use("/api/geocode", geocodeRouter);
  app.use("/api/brief", briefsRouter);

  return createServer(app);
}
