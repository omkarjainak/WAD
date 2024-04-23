import express from "express";
import morgan from "morgan";
import { FindUserByEmail, CreateUser } from "./db.js";
import { comparePassword, generateToken } from "./auth.js";

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

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