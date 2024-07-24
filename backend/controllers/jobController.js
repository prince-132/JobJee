import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../middlewares/error.js'
import { Job } from '../models/jobSchema.js'

export const getAllJobs = catchAsyncError(async(req,res, next)=>{
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs
    });
});

export const postJobs = catchAsyncError(async(req,res,next) => {
    // const role = req.user.role;
    const {role} = req.user;
    if(role === "Job Seeker")
        return next(new ErrorHandler("Job Seeker can't post the jobs",
        400 ));
    
    const {title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo} = req.body;
    if(!title || !description || !category || !country || !city || !location){
        return next(new ErrorHandler("Please provide full job details",
        400 ));
    }
    if(!fixedSalary && (!salaryFrom || !salaryTo)){
        return next(new ErrorHandler("Please provide either fixed slary or ranged salary",
        400 ));
    }
    if(fixedSalary && salaryFrom && salaryTo){
        return next(new ErrorHandler("Can't provide both fixed slary and ranged salary",
        400 ));
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo, postedBy
    })
    res.status(200).json({
        success: true,
        message: "Job posted successfully",
        job
    })
})

export const getMyJobs = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker can't post the jobs",
        400 ));
    }
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs
    })
})

export const updateJob = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker can't post the jobs",
        400 ));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job)
        return next(new ErrorHandler("Oops job not found!",
        404 ));
    job = await Job.findByIdAndUpdate(id, req.body, {
        new:true,
        runValidators: true,
        userFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Job updated successfully",
        job
    })
})

export const deleteJob = catchAsyncError(async(req, res, next) => {
    const {role} = req.user
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker can't post the jobs",
        400 ));
    }
    const {id} = req.params;
    const job = await Job.findByIdAndDelete(id)
    if(!job)
        return next(new ErrorHandler("Oops job not found!",
        404 ));
    res.status(200).json({
        success: true,
        message: "Job Deleted successfully",
        job
    })
})