import express from "express";
import {deleteJob, getAllJobs, getMyJobs, getSingleJob, postJob, updateJob} from "../controllers/jobController.js"
import {isAuthorized} from "../middlewears/Auth.js"

const router = express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthorized, postJob);
router.get("/getmyjobs", isAuthorized, getMyJobs);
router.put("/updatejob/:id", isAuthorized, updateJob);
router.delete("/deletejob/:id", isAuthorized, deleteJob);
router.get("/:id", isAuthorized, getSingleJob);

export default router;