import { cathAsyncErrors } from "../middlewears/catchAsyncErrors.js";
import { Job } from "../modals/jobSchema.js";
import ErrorHandler from "../middlewears/error.js";

// function for getting all jobs
export const getAllJobs = cathAsyncErrors(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs,
    });
});


// function for posting a job
export const postJob = cathAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
    } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(new ErrorHandler("Please provide full job details.", 400));
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            new ErrorHandler(
                "Please either provide fixed salary or ranged salary.",
                400
            )
        );
    }

    if (salaryFrom && salaryTo && fixedSalary) {
        return next(
            new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
        );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy,
    });
    res.status(200).json({
        success: true,
        message: "Job Posted Successfully!",
        job,
    });
});


// function for seeing posted jobs by the logged in user

export const getMyJobs = cathAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const myJobs = await Job.find({
        postedBy: req.user._id
    });
    res.status(200).json({
        success: true,
        myJobs
    });
});

// funnction to update a certain job
export const updateJob = cathAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }

    const { id } = req.params;

    let job = await Job.findById(id);
    if (!job) {
        return next(
            new ErrorHandler("oops! Job not found!", 404)
        );
    }
    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })
    res.status(200).json({
        success: true,
        job,
        message: "Job Updated successfully!"
    });
});


export const deleteJob = cathAsyncErrors(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
        );
    }
    const { id } = req.params;

    let job = await Job.findById(id);
    if (!job) {
        return next(
            new ErrorHandler("oops! Job not found!", 404)
        );
    }
    await Job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
})



export const getSingleJob = cathAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return next(new ErrorHandler("Job not found.", 404));
        }
        res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        return next(new ErrorHandler(`Invalid ID / CastError`, 404));
    }
});