import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// returns a secure hash of the password
export const hashPassword = (password)=>{
    return bcrypt.hashSync(password, 8);
}

export const comparePassword = (password, hash)=>{
    return bcrypt.compareSync(password, hash);
}

export const generateToken = (user)=>{
    console.log(user)
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: 3600 // expires in 1 hours
    });
}

export const authenticateToken = (req,res, next)=>{
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.user = decoded;
        next();
    });
}