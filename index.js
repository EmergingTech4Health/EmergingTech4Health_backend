const express = require('express')
const database = require('./config/database')
const dotenv = require('dotenv')
const userRoutes = require('./routes/User')
const categoryRoutes = require('./routes/Category')
const profileRoutes = require('./routes/Profile')
const postRoutes = require('./routes/Post')
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const publicationRoutes = require('./routes/Publications')
const frontPageRoutes = require('./routes/FrontPage')
const teamRoutes = require('./routes/Team')
// Load environment variables from .env file
dotenv.config()

// Port
const PORT = process.env.PORT || 4000

// App
const app = express();
// Loading environment variables from .env file
dotenv.config();

// connecting database
database.connect()

// Middlewares
app.use(express.json());

app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	}) 
);

// Connecting to cloudinary
cloudinaryConnect();
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/publication", publicationRoutes);
app.use("/api/v1/frontPage", frontPageRoutes);
app.use("/api/v1/team", teamRoutes);
app.get('/', (req , res)=>{
    res.send('Emerging tech server is up and running')
})

app.listen(PORT, ()=>{
    console.log(`Emerging tech server is up and running on port ${PORT}`)
})