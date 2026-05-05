import express from "express";
import { registerUser, loginUser, logout, getAllUsers } from "../Controller/userController.js";
import { body } from 'express-validator'
import { protect } from "../middleware/auth.js";
// import { autoSubscribeUserTopics } from "../controllers/pushnotification.js";


const router = express.Router();

// Delegate to userController (which itself is an Express router)
router.post('/signup' ,[
 body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
 body('email').isEmail().withMessage('Invalid email'),
 body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
] , registerUser )

router.post('/login',[
  body('identifier').notEmpty().withMessage('Email or username required'),
  body('password').notEmpty().withMessage('Password required')
], loginUser);

router.post('/logout' , logout)
router.get('/users' , getAllUsers  ) // Admin user seen All users in dashboard
// routes/auth.js
router.get("/check", protect, (req, res) => {
  
  res.status(200).json({ authenticated: true, user: req.user });
});
export default router;
