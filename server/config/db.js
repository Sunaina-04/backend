// 1. We import the 'mongoose' library. 
// Why require? It's an ODM (Object Data Mapper) that helps us talk to MongoDB using JavaScript objects.
const mongoose = require('mongoose');

// 2. We define an asynchronous function. 
// Why async? Connecting to a database over the internet takes time; we don't want to freeze our whole app while waiting.
const connectDB = async () => {
  try {
    // 3. We attempt to connect to the database.
    // 'await' pauses this function until the connection is either successful or fails.
    // 'process.env.MONGO_URI' pulls your secret connection string from your .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // 4. If successful, we log the host name (e.g., cluster0.mongodb.net) to the console.
    // This helps us confirm exactly WHICH database we are connected to.
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (err) {
    // 5. If the connection fails (wrong password, no internet, etc.), the code jumps here.
    // 'err.message' tells us exactly what went wrong.
    console.error(`❌ Error: ${err.message}`);
    
    // 6. We kill the process. 
    // Why? If the database isn't working, the rest of your app (which relies on data) won't work anyway.
    process.exit(1); 
  }
};

// 7. We export the function so it can be used in server.js.
// Why? This keeps our code modular—one file for connecting, one file for the server.
module.exports = connectDB;