import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import exp from "constants";

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public"));
app.use(cookieParser());


// Registration of partner route:
import PartnerRouter from "./Routes/Partner.routes"
app.use("/partner",PartnerRouter)


export default app;