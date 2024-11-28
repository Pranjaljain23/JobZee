import express from "express";
import {employerGetAllApplications, jobseekerDeleteApplication, jobseekerGettAllApplications, postApplication} from "../controllers/applicationController.js"
import {isAuthorized} from "../middlewears/Auth.js"

const router = express.Router();

router.get("/jobseeker/getall", isAuthorized, jobseekerGettAllApplications);
router.get("/employer/getall", isAuthorized, employerGetAllApplications);
router.delete("/delete/:id", isAuthorized, jobseekerDeleteApplication);
router.post("/post", isAuthorized, postApplication);

export default router;