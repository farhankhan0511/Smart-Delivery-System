import mongoose, { Document,Schema} from "mongoose";
import { Timestamps } from "../constants";

export interface ICustomer extends Document,Timestamps{
    Name:string,
    phone:string,
    address:string,
} 

const CustomerSchema:Schema<ICustomer>=new Schema({
    Name:{
        type:String,
        required:true,
        

    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true,
    }
},{timestamps:true})

export const Customer=mongoose.model<ICustomer>("Customer",CustomerSchema)