import { Router } from "express";
import { getuserinfo, login, signup, updateprofile , controlprofileimage, removeimage, logout} from "../controllers/authcontrollers.js";
import { verifytoken } from "../middlewares/authmiddlewares.js";
import multer from "multer"

const authroutes = Router();

const upload = multer({dest : "uploads/profiles/"})

authroutes.post("/signup", signup);
authroutes.post("/login", login);
authroutes.get("/userinfo", verifytoken,  getuserinfo);
authroutes.post("/update-profile", verifytoken, updateprofile);
authroutes.post("/addprofileimage", verifytoken, upload.single("profile-image") ,controlprofileimage);
authroutes.post("/remove-profile-image", verifytoken, removeimage);
authroutes.post("/logout", logout);

export default authroutes;