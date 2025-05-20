import { Router } from "express";
import { verifytoken } from "../middlewares/authmiddlewares.js";
import { searchcontactlist } from "../controllers/ContactControllers.js";


const contactRouters = Router();
contactRouters.post("/search", verifytoken, searchcontactlist);

export default contactRouters;