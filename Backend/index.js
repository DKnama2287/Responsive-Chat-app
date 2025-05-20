import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authroutes from "./Routes/authroutes.js";
import contactRouters from "./Routes/Contactroutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongourl = process.env.mongourl;
const allowedOrigin = process.env.ORIGIN ; // Default for local dev

// ✅ Corrected CORS middleware
app.use(cors({
    origin: allowedOrigin, // Directly pass the string, not an array
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies
}));

app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authroutes);
app.use("/api/contacts", contactRouters);
app.get("/", (req, res) => {
    res.send("hello");
});

// "0.0.0.0",

const server = app.listen(port,  () => {
    console.log(`Server started at port ${port}`);
});

mongoose.connect(mongourl).then(() => {
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.log("Error connecting MongoDB:", err);
});
