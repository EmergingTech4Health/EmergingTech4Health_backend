const express = require('express')
const database = require('./config/database')

// Load environment variables from .env file
dotenv.config()

// Port
const PORT = process.env.PORT || 4000

// App
const app = express();

// connecting database
database.connect()

// Middlewares
app.use(express.json());


app.get('/', (req , res)=>{
    res.send('Emerging tech server is up and running')
})

app.listen(PORT, ()=>{
    console.log(`Emerging tech server is up and running on port ${port}`)
})