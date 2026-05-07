import express from "express";
import { registerUser, logout, getAllUsers } from "../Controller/userController.js";
import { body } from 'express-validator'
import { protect } from "../middleware/auth.js";
// import { autoSubscribeUserTopics } from "../controllers/pushnotification.js";


const router = express.Router();

// Delegate to userController (which itself is an Express router)
router.post('/signup' ,[
  body('identifier').notEmpty().withMessage('Email or username required'),
body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
] , registerUser )

router.post('/logout' , logout)
router.get('/users' , getAllUsers  ) // Admin user seen All users in dashboard
// routes/auth.js
router.get("/check", protect, (req, res) => {
  
  res.status(200).json({ authenticated: true, user: req.user });
});
export default router;
