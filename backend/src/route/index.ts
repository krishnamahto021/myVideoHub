import express from "express";
const router = express.Router();
import authRoute from "./authRoute";
import userRoute from "./userRoute";
import passport from "passport";

router.use("/auth", authRoute);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoute
);

export default router;
