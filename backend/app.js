import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config/config.env" });

const app = express();
const port = process.env.PORT || 5000;

// ✅ CONNECT DATABASE
connectDB();

// ✅ MIDDLEWARES
app.use(express.json());

app.use(cors());

// ✅ HANDLE PREFLIGHT REQUESTS (IMPORTANT)
app.options("*", cors());

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ ROUTES
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ START SERVER
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});