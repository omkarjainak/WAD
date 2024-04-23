import mongoose from "mongoose";
import { config} from "dotenv";
import { hashPassword } from "./auth.js";
config();

await mongoose.connect(process.env.MONGO_URL, {
    authSource: "admin",
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PWD
});

const User = mongoose.model('USER', {
    name: String,
    email: String,
    password: String,
    bio: String
})

const FindUserByEmail = async (email) => {
    const user = await User.findOne({email})
    return user
}

const UpdateUserBio = async (email, bio) =>{
    const result = await User.updateOne({email}, {bio});
    return result.modifiedCount;
}

const CreateUser = async (input)=>{
    const newUser = new User({
        name: input.name,
        email: input.email,
        password: hashPassword(input.password),
        bio: input.bio
    })

    const data = await newUser.save();
    return data;
}

const DeleteUser = async (email)=>{
    await User.deleteOne({email});
}

// For cleanup during development
// export const deleteAllUsers = async ()=>{
//     await User.deleteMany({});
// }

export {
    CreateUser,
    FindUserByEmail,
    UpdateUserBio
}