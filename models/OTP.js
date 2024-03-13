const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 5*60,
    }
});

async function sendOTP(email,otp){
    try {
        const mailResponse = await mailSender(email, "Verification email from emerging Tech4Health", `Your OTP for verification is ${otp}`);
        console.log("EMail sent successfully", mailResponse);
    } catch (error) {
        console.log("error occur while sending email", error);
        throw error;
    }
}

OTPSchema.pre('save', async function(next){
          await sendOTP(this.email, this.otp);
          next(); 
})
