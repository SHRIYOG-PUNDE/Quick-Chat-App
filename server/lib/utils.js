import jwt from 'jsonwebtoken'

// Function to generate tokens for users

export const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;

}