
import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { ApiError } from "../utils/ApiError";
import { shiftregex, Timestamps } from "../constants";


export enum partnerstatus{
    active="active",
    inactive="inactive"
}

const timeRegex=shiftregex;
const ShiftSchema = new Schema({
    start: {
        type: String,
        required: true,
        match: [timeRegex, "Invalid time format, should be HH:mm"], // Regex for HH:mm
    },
    end: {
        type: String,
        required: true,
        match: [timeRegex, "Invalid time format, should be HH:mm"], // Regex for HH:mm
    },
});


export interface IPartner extends Document,Timestamps{
    Partnername:string,
    email:string,
    status?:string,
    currentload?:number,
    areas:string[],
    shift:{
        start:string,
        end:string,
    },
    Partnermetrics?:Schema.Types.ObjectId,
    Assignmentmetrics?:Schema.Types.ObjectId,
    password:string,
    refreshtoken?:string,
    isPasswordCorrect(password: string): Promise<boolean>, // Add the method here
    generateaccesstoken(): Promise<string>,
    generaterefreshtoken(): Promise<string>,
}

const PartnerSchema=new Schema({
    Partnername:{
        type:String,
        lowercase:true,
        required:[true,"Partnername is required"],
        unique:true,
        trim:true,
        index:true,

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    status:{
        type:String,
        enum:Object.values(partnerstatus)
    },
    currentload:{
        type:Number,
        max:[3,"Value can't exceed 3"],
        min:0
    },
    areas:{
        type:[String],
        required:true
    },
    shift:{
        type:ShiftSchema,
        required:true
    },
    Partnermetrics:{
        type:Schema.Types.ObjectId,
        ref:"Partnermetrics"
    }
    ,
    password:{
        type:String,
        required:[true,"Password is required"]

    },
    refreshtoken:{
        type:String
    }

},{timestamps:true})

PartnerSchema.pre("save",async function (next) {
    if (!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
    
})
PartnerSchema.methods.isPasswordCorrect=async function (password:string):Promise<Boolean> {
    return await bcrypt.compare(password,this.password)
}


PartnerSchema.methods.generateaccesstoken=async function () {
    const accesstoken=process.env.ACCESS_TOKEN_SECRET;
    if (!accesstoken){
        throw new ApiError(500,"Access token is invalid")
    }
    return jwt.sign({
        _id:this._id,
        Partnername:this.Partnername
    },accesstoken,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
PartnerSchema.methods.generaterefreshtoken=async function () {
    
const refreshtoken=process.env.REFRESH_TOKEN_SECRET;
if (!refreshtoken){
    throw new ApiError(500,"Access token is invalid")
}
    return jwt.sign({
        _id:this._id,
        Partnername:this.Partnername
    },refreshtoken,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const Partner=mongoose.model<IPartner>("Partner",PartnerSchema)