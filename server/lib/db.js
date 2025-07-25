import mongoose from "mongoose";

// Function to connet to the mongodb database

export const connectDB = async ()=>{
    try {

        mongoose.connection.on('connected', ()=> console.log('Database Conected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error.message)
    }
}