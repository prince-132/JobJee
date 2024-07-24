import express from 'express'
import { deleteJob, getAllJobs, getMyJobs, postJobs, updateJob } from '../controllers/jobController.js';
import { isAuthorised } from '../middlewares/auth.js';

const router = express.Router()

router.get('/getAll', getAllJobs)
router.post('/postJob', isAuthorised, postJobs)
router.get('/getMyJob', isAuthorised, getMyJobs)
router.put('/updateJob/:id', isAuthorised, updateJob)
router.delete('/deleteJob/:id', isAuthorised, deleteJob)

export default router;