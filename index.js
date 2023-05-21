// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express'); // Web framework for Node.js
const mongoose = require('./configs/mongoose'); // MongoDB config file is called to initiate DB connection

// Create an instance of the Express application
const app = express();

// Use middleware to parse incoming requests
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

app.use('/',(req,res,next)=>{
  console.log(req.ip);
  next()
})

// Import and use routes defined in separate modules
app.use('/', require('./routes'));

// Start the server
const port = process.env.PORT || 8000; // Use the port defined in the environment variable, or default to port 8000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});