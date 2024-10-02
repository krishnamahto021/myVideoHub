import express from "express";
import { upload } from "../middleware/multers3Midleware";
import { uploadFile } from "../controller/aws/awsFileController";
const router = express.Router();

router.post("/upload-file", upload, uploadFile);

export default router;
