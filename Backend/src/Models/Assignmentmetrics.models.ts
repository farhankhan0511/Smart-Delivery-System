import mongoose, { Document, Schema } from "mongoose";
import { Timestamps } from "../constants";

const failureschema=new mongoose.Schema({
    reason:{type:String},
    count:{type:Number,default:0}
})

export interface IAssignmentMetrics extends Document,Timestamps{
    totalAssigned:number,
    totalTime:number,
    successRate?:number,
    averageTime?:number,
    failureReasons?:any
}


const AssignmentMetricsSchema:Schema<IAssignmentMetrics>=new mongoose.Schema({
    totalAssigned:{
        type:Number,
        default:0
    },
    totalTime:{
        type:Number,
        default:0
    },
    failureReasons:{
        type:failureschema
    }
   
},{timestamps:true})


export const Assignmentmetrics=mongoose.model<IAssignmentMetrics>("Assignmentmetrics",AssignmentMetricsSchema)