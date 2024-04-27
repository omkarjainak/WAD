import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { FindUserByEmail, CreateUser, UpdateUserBio } from "./db.js";
import { authenticateToken, comparePassword, generateToken } from "./auth.js";

const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(helmet());

app.get("/user", authenticateToken, async (req, res)=>{
    const user = await FindUserByEmail(req.user.email);
    if(user){
        res.send({name: user.name, email: user.email, bio: user.bio})
    }else{
        res.status(404).send({message: "User not found"})
    }
});

app.post("/bio", authenticateToken, async (req, res)=>{
    const user = await FindUserByEmail(req.user.email);
    if(user){
        await UpdateUserBio(req.user.email, req.body.bio);
        res.status(200).send({message: "Bio updated successfully"})
    }else{
        res.status(404).send({message: "User not found"})
    }
});

app.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    const user = await FindUserByEmail(email);
    if(user){
        if(comparePassword(password, user.password)){
            res.send({message: "Login successful", token: generateToken({email: user.email, name: user.name})})
        }else{
            res.status(401).send({message: "Invalid credentials"})
        }
    }else{
        res.status(404).send({message: "User not found"})
    } 
});

app.post("/register",  async (req, res)=>{
    const {name, email, password, bio} = req.body;
    // validate the input
    if(!name || !email || !password){
        res.status(400).send({message: "Invalid input"})
    }
    // create the user
    const user = await CreateUser({name, email, password, bio});
    console.log(user)
    res.send({message: "Registred successfully", token: generateToken({email: email, name: name})})
});

app.listen(3002, ()=>{
 console.log("Server listening on port 3000")
});