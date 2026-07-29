const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Database...');
    console.log(`📍 Connection: ${process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`);
    console.log(`🗄️  Database Name: ${process.env.DB_NAME}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    // console.log(`📍 Host: ${conn.connection.host}`);
    // console.log(`🗄️  Database: ${conn.connection.name}`);
    // console.log(`💾 All user data will be stored in this database`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
  }
};

module.exports = { connectDB };
