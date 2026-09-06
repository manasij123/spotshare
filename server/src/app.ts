import express from "express";
import cors from "cors";
import helmet from "helmet";
import { locationsRouter } from "./routes/locations";
import { sharesRouter } from "./routes/shares";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  // Render (and most PaaS hosts) sit behind a reverse proxy; this makes
  // express-rate-limit key off the real client IP (X-Forwarded-For) instead
  // of the proxy's.
  app.set("trust proxy", 1);

  const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  app.use(helmet());
  app.use(
    cors({
      origin: allowedOrigins,
    }),
  );
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/locations", locationsRouter);
  app.use("/api/shares", sharesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
