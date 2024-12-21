import { asynchandler } from "../utils/asynchandler";
import {ApiError} from "../utils/ApiError"
import jwt,{JwtPayload} from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"
import { Partner } from "../Models/Partner.model";
import { statuscodes } from "../constants";

declare module "express-serve-static-core"{
    interface Request{
        user?:any;
    }
}


export const verifyJWT=asynchandler(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","");


        if (!token){
            throw new ApiError(statuscodes.NOTFOUND,"Unauthorized Request")
        }
        const accesstoken=process.env.ACCESS_TOKEN_SECRET;
        if (!accesstoken){
            throw new ApiError(500,"Access token is invalid")
        }
        const decoded=await jwt.verify(token,accesstoken) as JwtPayload;

        const partner=await Partner.findById(decoded?._id).select("-password -refreshtoken")
        if(!partner){
            throw new ApiError(400,"Invalid Access Token")
        }
        req.user=Partner
        next()
    }
    catch(err:any){
        throw new ApiError(statuscodes.NOTFOUND,err.message || "invalid access token")
    }
})