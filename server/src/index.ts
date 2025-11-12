import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.get("/api/health", (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const DEFAULT_PORT = parseInt(process.env.PORT || "5000");

const startServer = (port: number) => {
  const server = app.listen(port)
    .on("listening", () => console.log(`🚀 Server running on port ${port}`))
    .on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        const next = port + 1;
        console.warn(`⚠️ Port ${port} in use — retrying on ${next}...`);
        startServer(next);
      } else {
        console.error("❌ Server error:", err);
      }
    });
};

startServer(DEFAULT_PORT);

