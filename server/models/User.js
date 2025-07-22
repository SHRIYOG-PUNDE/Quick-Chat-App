import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type:String, 
        required: true,
        unique:true,
    },
    email: {
        type:String, 
        required: true,
        unique:true
    },
    password: {
        type:String, 
        required: true,
        unique:true,
        minlength: 6
    },
    profilePic: {
        type:String, 
        required: true,
        default : 'https://i.imgur.com/placeholder-avatar.png'
    },
    bio: {
        type:String,
        default:''
    },
},{timestamps:true})

const User = mongoose.model('User', userSchema);
export default User;