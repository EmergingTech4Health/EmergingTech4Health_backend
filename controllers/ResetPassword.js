const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.resetPasswordToken = async (req, res) => {
    try{
        const email = req.body.email 
        const user = await User.findOne({email: email})
        if(!user) return res.status(404).json({message: "User not found"})

        const token = crypto.randomBytes(32).toString('hex');
        const updatedDetails = await User.findOneAndUpdate({
            email: email
        }, {
            token: token,
        resetPasswordExpires: Date.now() + 3600000,

        },{
            new: true
        })
        console.log("DETAILS", updatedDetails);
        const url = `http://localhost:3000/update-password/${token}`
       
    
        await mailSender(
          email,
          "Password Reset",
          `Your Link for email verification is ${url}. Please click this url to reset your password.`
        )
    
        res.json({
          success: true,
          message:
            "Email Sent Successfully, Please Check Your Email to Continue Further",
        })

    }
    catch(error){
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Sending the Reset Message`,
          })
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const {password , confirmPassword , token} = req.body;
        if(password !== confirmPassword) return res.status(400).json({message: "Password do not match"})
        const userDetails = await User.findOne({token:token})
        if(!userDetails) return res.status(400).json({message: "Invalid Token"})
        if (!(userDetails.resetPasswordExpires > Date.now())) {
            return res.status(403).json({
              success: false,
              message: `Token is Expired, Please Regenerate Your Token`,
            })
          }
          const encryptedPassword = await bcrypt.hash(password, 10)
          await User.findOneAndUpdate(
            { token: token },
            { password: encryptedPassword },
            { new: true }
          )
          res.json({
            success: true,
            message: `Password Reset Successful`,
          })
    } catch (error) {
        return res.json({
            error: error.message,
            success: false,
            message: `Some Error in Updating the Password`,
          })
    }
}