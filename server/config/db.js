// 1. We import the 'mongoose' library. 
// Why require? It's an ODM (Object Data Mapper) that helps us talk to MongoDB using JavaScript objects.
const mongoose = require('mongoose');

// 2. We define an asynchronous function to connect to MongoDB.
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (err) {
        console.error(`❌ Primary MongoURI failed: ${err.message}`);
        console.warn('Attempting local MongoDB fallback...');
      }
    }

    // Try local fallback
    const localUri = 'mongodb://127.0.0.1:27017/incident-reporting';
    try {
      const connLocal = await mongoose.connect(localUri);
      console.log(`✅ MongoDB Connected (fallback): ${connLocal.connection.host}`);
      return;
    } catch (errLocal) {
      console.error(`❌ Local fallback failed: ${errLocal.message}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Unexpected DB error: ${err.message}`);
    process.exit(1);
  }
};

// 7. We export the function so it can be used in server.js.
module.exports = connectDB;