import mongoose, { Document, Schema } from "mongoose";
import { AssignmentStatus, Timestamps } from "../constants";





export interface IAssignment extends Document,Timestamps{
    orderId:Schema.Types.ObjectId,
    partnerId:Schema.Types.ObjectId,
    status:AssignmentStatus,
    reason:string

}

const AssignmentSchema:Schema<IAssignment>=new mongoose.Schema({
    orderId:{
        type:Schema.Types.ObjectId,
        ref:"Order",
        required:true,
        unique:true,        
    },
    partnerId:{
        type:Schema.Types.ObjectId,
        ref:"Partner",
        required:true,             
    },
    status:{
        type:String,
        enum:Object.values(AssignmentStatus)
    },
    reason:{
        type:String
    }

},{timestamps:true})



export const Assignment=mongoose.model<IAssignment>("Assignment",AssignmentSchema)
