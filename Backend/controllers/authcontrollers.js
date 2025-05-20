import bcrypt from "bcrypt";
import userauth from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync, existsSync } from "fs";
import path from "path";

const maxage = 3 * 24 * 60 * 60 * 1000;

const createtoken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.jwt_key, {
    expiresIn: maxage,
  });
};

// ✅ SIGNUP
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("email and password is required");
    }
    const user = await userauth.create({ email, password });
    res.cookie("jwt", createtoken(email, user.id), {
      maxAge: maxage,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profilesetup: user.profilesetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

// ✅ LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("email and password is required");
    }
    const user = await userauth.findOne({ email });
    if (!user) {
      return res.status(400).send("user with given email not found ");
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).send("password is incorrect.");
    }

    res.cookie("jwt", createtoken(email, user.id), {
      maxAge: maxage,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profilesetup: user.profilesetup,
        firstname: user.firstname,
        lastname: user.lastname,
        color: user.color,
        image: `/uploads/profiles/${user.image}`,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

// ✅ GET USER INFO
export const getuserinfo = async (req, res, next) => {
  try {
    const userData = await userauth.findById(req.userId);
    if (!userData) {
      return res.status(404).send("user with this given id not found.");
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profilesetup: userData.profilesetup,
      firstname: userData.firstname,
      lastname: userData.lastname,
      color: userData.color,
      image: userData.image ? `/uploads/profiles/${userData.image}` : null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

// ✅ UPDATE PROFILE INFO
export const updateprofile = async (req, res, next) => {
  try {
    const { firstname, lastname, color } = req.body;
    if (!firstname || !lastname || !color) {
      return res.status(400).send("firstname, lastname and color is required");
    }

    const userData = await userauth.findByIdAndUpdate(
      req.userId,
      {
        firstname,
        lastname,
        color,
        profilesetup: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profilesetup: userData.profilesetup,
      firstname: userData.firstname,
      lastname: userData.lastname,
      color: userData.color,
      image: userData.image ? `/uploads/profiles/${userData.image}` : null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

// ✅ CONTROL PROFILE IMAGE (UPLOAD)
export const controlprofileimage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    const fileName = `${date}_${req.file.originalname}`;
    const destPath = path.resolve("uploads/profiles", fileName);

    // Move file
    renameSync(req.file.path, destPath);

    // Save file name (not full path) to DB
    const updateuser = await userauth.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: `/uploads/profiles/${updateuser.image}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

// ✅ REMOVE IMAGE
export const removeimage = async (req, res, next) => {
  try {
    const user = await userauth.findById(req.userId);
    if (!user) {
      return res.status(400).send("user not found.");
    }

    if (user.image) {
      const fullPath = path.resolve("uploads/profiles", user.image);
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
      }
      user.image = null;
      await user.save();
    }

    return res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};

export const logout = async (req, res, next) => {
  try {
    
    res.cookie("jwt", "", {maxAge : 1, secure : true, sameSite : "None"});

    return res.status(200).send("Logout successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  }
};
