const mongoose = require('mongoose'); // Correct import
const uri = "mongodb+srv://pkinnera0707:MongoDB2025@online-learning-platfor.o2jmj.mongodb.net/OLPlatformDB?retryWrites=true&w=majority"; // Ensure the database name is included

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully!");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;