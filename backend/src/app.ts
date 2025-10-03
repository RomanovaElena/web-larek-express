import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import productRouter from "./routes/product-router";
import dotenv from "dotenv";
import orderRouter from "./routes/order-router";
import { errorLogger, requestLogger } from "./middlewares/logger";
import { errors } from "celebrate";
import errorHandler from "./middlewares/error-handler";

dotenv.config();
const dbAddress =
  process.env.DB_ADDRESS || "mongodb://127.0.0.1:27017/weblarek";
const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(requestLogger);

app.use("/product", productRouter);
app.use("/order", orderRouter);

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

// подключение к БД и запуск
mongoose
  .connect(dbAddress)
  .then(() => {
    console.log("DB connected");
    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error(err));
