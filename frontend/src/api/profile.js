import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export async function getUpdatedUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include",
    });

    if(!res.ok) return null;

    const data = await res.json();
    return data.user
  } catch (error) {
    console.error("Error verifying authenticated user:", error.message);
    return null;
  }
}

