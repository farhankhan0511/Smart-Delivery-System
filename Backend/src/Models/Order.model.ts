import mongoose, { Document, Schema } from "mongoose";
import { shiftregex, Timestamps } from "../constants";


export enum OrderStatus{
    pending="pending",
    assigned="assigned",
    picked="picked",
    delivered="deliverd"
}
const timeRegex=shiftregex;

export interface IOrder extends Document,Timestamps{
    customer:Schema.Types.ObjectId,
    area:string,
    items:Schema.Types.ObjectId[],
    status:OrderStatus,
    scheduledfor:string,
    assignedTo:Schema.Types.ObjectId,
}

const OrderSchema=new mongoose.Schema({
    // orderNumber:{
    //     type:String,
    //     required:true,
    //     unique:true

    // },
    customer:{
        type:Schema.Types.ObjectId,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    items:{
        type:[Schema.Types.ObjectId],
        ref:"Items",
        required:true
    },
    status:{
        type:String,
        enum:Object.values(OrderStatus),
        required:true,
        default:OrderStatus.pending
    },
    scheduledfor:{
        type:String,       
        required:true,
        validate:{
            validator:function(value:string){
                return timeRegex.test(value);
            },
            message: (props: any) => `${props.value} is not a valid time format. Use hh:mm (24-hour format).`,
       
        },
    },
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:"Partner"
    },

},{timestamps:true})

export const Order=mongoose.model("Order",OrderSchema)