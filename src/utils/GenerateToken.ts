import jsonwebtoken from "jsonwebtoken";

interface user{
    id:string;
    name:string;
    email:string;
    role?: "user" | "admin";
    status?: "VALID" | "REJECTED" | "Reported";
}

export const generateToken = (users:user)=>{
    
    const secret = process.env.SECRET_CODE;
    
    return jsonwebtoken.sign({
        id:users.id,
        name:users.name,
        email:users.email,
        role: users.role,
        status: users.status,
    },String(secret),{expiresIn:"30m"})

}

export const refreshToken = (users:user)=>{
    
    const secret = process.env.REFRESH_CODE;
    
    return jsonwebtoken.sign({
        id:users.id,
        name:users.name,
        email:users.email,
        role: users.role,
        status: users.status,
    },String(secret),{expiresIn:"7d"})

}
