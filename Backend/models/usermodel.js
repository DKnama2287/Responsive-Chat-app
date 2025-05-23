import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : [true, "email is required"],
        unique : true,
    },
    password : {
        type : String,
        required : [true, "password is required"],
    },
    firstname : {
        type : String,
        required : false,
    },
    lastname : {
        type : String,
        required : false,
    },
    color : {
        type : Number,
        required : false,
    },
    image : {
        type : String,
        required : false,
    },
    profilesetup :{
        type : Boolean,
        default : false,
    }
});

userSchema.pre("save", async function (next){
    const salt = await genSalt();
    this.password = await hash(this.password , salt);
    next();
});

const userauth = mongoose.model("userauth", userSchema);
export default userauth ;
