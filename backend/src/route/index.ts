import express from "express";
const router = express.Router();
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import awsRoute from "./awsFileRoute";
import passport from "passport";

router.use("/auth", authRoute);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);
router.use("/aws", passport.authenticate("jwt", { session: false }), awsRoute);

export default router;
