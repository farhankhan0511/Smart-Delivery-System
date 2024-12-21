import mongoose, { Document,Schema } from "mongoose";
import { Timestamps } from "../constants";

export interface IItem extends Document,Timestamps{
    itemname:string,
    price:number,
}

const ItemSchema:Schema<IItem>=new Schema({
    itemname:{
        type:String,
        required:true,
        unique:true

    },
    price:{
        type:Number
    }
},{timestamps:true})

export const Items=mongoose.model<IItem>("Item",ItemSchema)