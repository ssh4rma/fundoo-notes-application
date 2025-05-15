import express from "express";
import dotenv from "dotenv";
import connectDb from "./configs/dbConnection.js";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { setupSwagger } from "./swagger.js";

dotenv.config();
connectDb();

const app = express();
app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => res.send("FundooNotes API is running"));

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
