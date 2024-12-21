import mongoose, { Document } from "mongoose";
import { Timestamps } from "../constants";

export interface IPartnermetrics extends Document,Timestamps{
    rating:number,
    completedOrders:number,
    cancelledOrders:number,
    aggregaterating:number,
    totalratedcount:number
}

const PartnerMetricsSchema=new mongoose.Schema({
    rating:{
        type:Number,
        default:0,
        max:[5,"Rating can maximum be 5"],
        min:[0,"Rating can minimum be 1"],

    },
    completedOrders:{
        type:Number,
        default:0
    },
    cancelledOrders:{
        type:Number,
        default:0
    },
    aggregaterating:{
        type:Number,
        default:0
    },
    totalratedcount:{
        type:Number,
        default:0
    }
},{timestamps:true})


export const Partnermetrics=mongoose.model("Partnermetrics",PartnerMetricsSchema)