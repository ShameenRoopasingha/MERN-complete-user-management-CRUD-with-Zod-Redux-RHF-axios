import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT ?? 5000;

app.use(express.json());

app.use("/api/users", userRoutes);

const mongoUrl: string = process.env.MONGO_URI as string;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const connection = mongoose.connection;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
