import { jwtVerify } from "jose"
import { cookies } from "next/headers"



export default async function getAuthenticatedUser(){
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value;
    if(!token){
        return null;
    }

    try {
        const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
        const {payload} = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        return null;
    }
}