const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const User = require('../models/User')

dotenv.config()

exports.auth = async (req, res, next) => {
    try {
        const token =
        req.cookies.token ||
        req.body.token ||
        req.header("Authorization").replace("Bearer ", "");
        if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}
        try{
           // Verifying the JWT using the secret key stored in environment variables
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log(decode);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
        }
        catch(error){
            return res.status(401).json({ success: false, message: `Invalid Token` });
        }
        next();
    } catch (error) {
        // If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
    }
};

exports.isAdmin = async (req, res, next) => {
    try{
        const userDetails= await User.findOne({email:req.user.email});
        if(userDetails.userType!=="Admin"){
            return res.status(401).json({
				success: false,
				
				message: "This is a Protected Route for Admin",
			});
        }
        next();
    }
    catch(error) {
		return res
			.status(500)
			.json({ success: false, message: `Admin Role Can't be Verified` });
	}
}

exports.isSuperAdmin = async (req, res, next) => {
    try{
        const userDetails= await User.findOne({email:req.user.email});
        if(userDetails.userType!=="SuperAdmin"){
            return res.status(401).json({
				success: false,
				
				message: "This is a Protected Route for SuperAdmin",
			});
        }
        next();
    }
    catch(error) {
		return res
			.status(500)
			.json({ success: false, message: `SuperAdmin Role Can't be Verified` });
	}
}


// // Auth Middleware
// exports.auth = async (req, res, next) => {
//     try {
//         const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
//         if (!token) {
//             return res.status(401).json({ success: false, message: `Token Missing` });
//         }

//         const decode = await jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decode;
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: `Invalid Token` });
//     }
// };

// // Role-Based Access Middleware
// exports.authorize = (...roles) => {
//     return async (req, res, next) => {
//         try {
//             const userDetails = await User.findOne({ email: req.user.email });
//             if (!userDetails || !roles.includes(userDetails.userType)) {
//                 return res.status(403).json({ success: false, message: "Unauthorized Access" });
//             }
//             next();
//         } catch (error) {
//             return res.status(500).json({ success: false, message: `Error: ${error.message}` });
//         }
//     };
// };
