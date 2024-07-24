import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide job title!"],
        minLength: [3, "Title must contain at least 3 character"],
        maxLength: [50, "Title can contain at most 50 character"]
    },
    description: {
        type: String,
        required: [true, "Please provide job description!"],
        minLength: [50, "Job must contain at least 50 character"],
        maxLength: [350, "Job can contain at most 350 character"]
    },
    category: {
        type: String,
        required: [true, "Job category is required"]
    },
    country: {
        type: String,
        required: [true, "Job country is required"]
    },
    city: {
        type: String,
        required: [true, "Job city is required"]
    },
    location: {
        type: String,
        required: [true, "Please provide exact location"],
        minLength: [50, "Job location must contain at least 50 character!"]
    },
    fixedSalary: {
        type: Number,
        minLength: [4, "Fixed salary must contain at least 4 digits!"],
        maxLength: [10, "Fixed salary must contain at most 10 digits!"]
    },
    salaryFrom: {
        type: Number,
        minLength: [4, "Salary from must contain at least 4 digits!"],
        maxLength: [10, "Salary from can contain at most 10 digits!"]
    },
    salaryTo: {
        type: Number,
        minLength: [4, "SalaryTo must contain at least 4 digits!"],
        maxLength: [10, "SalaryTo must contain at most 10 digits!"]
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
})

export const Job = mongoose.model("Job", jobSchema)