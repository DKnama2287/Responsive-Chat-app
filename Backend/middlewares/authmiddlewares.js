import jwt from "jsonwebtoken"

export const verifytoken = (req, res, next)=>{
    //console.log(req.cookies);
    const token = req.cookies.jwt;
    // console.log({token});
    if(! token) return res.status(401).send("you are not authenticated.");
    jwt.verify(token , process.env.jwt_key, async(err, payload)=>{
        if(err) return res.status(403).send("Token is not valid");
        req.userId = payload.userId;
        next();
    })
}