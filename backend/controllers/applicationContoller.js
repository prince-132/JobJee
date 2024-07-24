import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { Application } from '../models/applicationSchema.js';
import dotenv from 'dotenv'
import cloudinary from 'cloudinary';
import { Job } from '../models/jobSchema.js';

dotenv.config();

cloudinary.v2.config({
  cloud_name: "gyanendracloud",
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET
});

export const employerGetAllApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker is not allowed to access this resource!", 400));
  }

  const { _id } = req.user;
  const application = await Application.find({ 'employerId.user': _id });
  res.status(200).json({
    success: true,
    application
  });
});

export const jobseekerGetAllApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
  }

  const { _id } = req.user;
  const application = await Application.find({ 'applicantId.user': _id });
  res.status(200).json({
    success: true,
    application
  });
});

export const jobseekerDeleteApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
  }

  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Oops, application not found", 404));
  }

  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application deleted successfully"
  });
});

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(new ErrorHandler("Employer is not allowed to access this resource!", 400));
  }
  if (!req.files || Object.keys(req.files).length === 0)
    return next(new ErrorHandler("Resume file required", 400));
  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("Invalid file type", 400));
  }
  const cloudinaryResponse = await cloudinary.v2.uploader.upload(
    resume.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
    return next(new ErrorHandler("Failed to upload Resume", 500));
  }
  const { name, email, coverLetter, phone, jobId } = req.body;
  const applicantId = {
    user: req.user._id,
    role: "Job Seeker"
  };
  if (!jobId)
    return next(new ErrorHandler("Job not found!", 404));
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails)
    return next(new ErrorHandler("Job not found!", 404));
  const employerId = {
    user: jobDetails.postedBy,
    role: "Employer"
  };
  if (!name || !email || !coverLetter || !phone || !applicantId || !employerId || !resume) {
    return next(new ErrorHandler("Please fill all fields!", 400));
  }
  const application = await Application.create({
    name, email, coverLetter, phone, applicantId, employerId, resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    }
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application
  });
});
