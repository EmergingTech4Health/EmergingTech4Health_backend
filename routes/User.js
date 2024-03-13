const express = require('expre')
const router = express.Router()


// Import required controllers and middleware functions
const {
    signup,
    login,
    sendotp,
    changePassword
} = require('../controllers/Auth')

const {
    resetPasswordToken,
    updatePassword
} = require('../controllers/ResetPassword')

const {auth} = require('../middlewares/auth')

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************


// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/update-password", updatePassword)

// Export the router for use in the main application
module.exports = router
