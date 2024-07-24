import express from 'express'
import { isAuthorised } from '../middlewares/auth.js'
import { employerGetAllApplication, jobseekerDeleteApplication, jobseekerGetAllApplication, postApplication } from '../controllers/applicationContoller.js'

const router = express.Router()

router.get('/jobseeker/getall', isAuthorised, jobseekerGetAllApplication)
router.get('/employer/getall', isAuthorised, employerGetAllApplication)
router.delete('/delete/:id', isAuthorised, jobseekerDeleteApplication)
router.post('/post', isAuthorised, postApplication)

export default router;