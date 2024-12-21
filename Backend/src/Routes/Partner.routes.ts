import { Router } from "express";
import { LoginPartner, PartnerRegistration } from "../Controllers/Partner.controller";

const router=Router()

router.route("/register").post(PartnerRegistration)
router.route("/login").post(LoginPartner)
export default router;