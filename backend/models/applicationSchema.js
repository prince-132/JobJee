import mongoose from 'mongoose'
import validator from 'validator'

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your Name!"],
        minLength: [3, "Name must contain at least 3 character"],
        maxLength: [30, "Name can contain at most 30 character"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        validate: [validator.isEmail, "Please provide valid email!"]
    },
    coverLetter: {
        type: String,
        required: [true, "Please provide your cover Letter"]
    },
    phone:{
        type: Number,
        required: [true, "Please provide your phone number!"]
    },
    resume: {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    applicantId: {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["Job Seeker"],
            required: true
        }
    },
    employerId: {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["Employer"],
            required: true
        }
    }
})

export const Application = mongoose.model("Application", applicationSchema);