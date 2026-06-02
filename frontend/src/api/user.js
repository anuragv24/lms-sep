// frontend/src/api/user.js
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAuthenticatedUser() {
  try {
    // 1. Get the token from the frontend server-side cookie store
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    // 2. Make a server-to-server call from port 3000 to port 5000 to verify the token
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure we don't cache stale user sessions
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user; // Returns user data if backend verifies the token successfully

  } catch (error) {
    console.error("Error verifying authenticated user:", error.message);
    return null;
  }
}