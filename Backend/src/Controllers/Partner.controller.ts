import { asynchandler } from "../utils/asynchandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { NextFunction, Request, Response } from "express";
import {z, ZodString} from "zod"
import { statuscodes } from "../constants";
import { Partner } from "../Models/Partner.model";
import { Partnermetrics } from "../Models/deliverypartnermetrics.model";

//Registration of partner

interface PartnerrequestBody{
    Partnername:string,
    email:string,
    areas:string[],
    start:string,
    end:string,
    password:string,
}


const RegistrationSchema=z.object({
    Partnername:z.string(),
    email:z.string().email(),
    areas:z.array(z.string()),
    start:z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/,"It must be in hh:mm format "),
    end:z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/,"It must be in hh:mm format "),
    password:z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 
         "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit",
    )
})
const LoginSchema=z.object({
    email:z.string().email(),
    password:z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit",
   )

})


const PartnerRegistration=asynchandler(async(req:Request,res:Response)=>{
    //Now we have to register the Partner
    //On registration i.e on creating the account we will require email,password,Name,Areas,Shift he want
    // const {Partnername,email,areas,start,end,password}:PartnerrequestBody=req.body;
    let validdata:PartnerrequestBody;
    try {
        validdata=RegistrationSchema.parse(req.body)
    } catch (err:any) {
        return res.status(statuscodes.BADREQUEST).json(
        new ApiError(statuscodes.BADREQUEST,err.message || "bad request")
        )
    }
    const existuser=await Partner.findOne({email:validdata.email})
    if (existuser){
        return  res.status(statuscodes.BADREQUEST).json(
        new ApiError(statuscodes.BADREQUEST,"Partner already exists")
        )
    }
    const partnermetrics=await Partnermetrics.create()

    const partner=await Partner.create({

        Partnername:validdata.Partnername,
        email:validdata.email,
        areas:validdata.areas,
        shift:{
            start:validdata.start,
            end:validdata.end
        },
        password:validdata.password,
        Partnermetrics:partnermetrics

    }
    )
    if (!partner) {
        return  res.status(statuscodes.BADREQUEST).json(
        new ApiError(statuscodes.INTERNALERROR,"Error while registration of the partenr")
        )
    }
    return res.status(statuscodes.SUCCESFULL).json(
        new ApiResponse(statuscodes.CREATED,partner,"Partner registered Successfullly")
    )


})

const generateaccessandrefreshtoken=async(partner_Id:any)=>{
    const partner= await Partner.findById(partner_Id)
    if (!partner){
        
       throw  new ApiError(statuscodes.INTERNALERROR,"Error while generating tokens")
        
    }
    const accesstoken= await partner.generateaccesstoken();
    const refreshtoken=await partner.generaterefreshtoken();
    partner.refreshtoken=refreshtoken;
    await partner.save({validateBeforeSave:false})
    return {accesstoken,refreshtoken}
}


const LoginPartner=asynchandler(async(req:Request,res:Response,next:NextFunction)=>{

    const {email,password}=req.body
    let validlogin:any;
    try {
        
        validlogin=LoginSchema.parse({email:email,password:password})
    } catch (err) {
        return res.status(statuscodes.BADREQUEST).json(
        new ApiError(statuscodes.BADREQUEST,"Email and password should be in format")
        )
    }

    const partner=await Partner.findOne({email:validlogin.email})
  
    if(!partner){
        return res.status(statuscodes.BADREQUEST).json(
        new ApiError(statuscodes.BADREQUEST,"Partner doesn't exists")
        )
    }
    let validpass= await partner.isPasswordCorrect(validlogin.password)
    if(!validpass){
        return res.status(statuscodes.BADREQUEST).json(
        new ApiError(statuscodes.BADREQUEST,"Incorrect Password")
        )
    }
    const {accesstoken,refreshtoken}= await generateaccessandrefreshtoken(partner._id)
    const loggedinPartner=await Partner.findById(partner._id).select("-password -refreshtoken")

    const options={
        httpOnly:true,
        secure:false,
        sameSite:false
    }

    res.status(statuscodes.SUCCESFULL)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(statuscodes.SUCCESFULL,{loggedinPartner,accesstoken,refreshtoken},"partner logged in successfully")
    )

})






export {PartnerRegistration,LoginPartner}