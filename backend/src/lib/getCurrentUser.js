import { cookies } from "next/headers";

export async function getAuthenticatedUser(passedToken = null) {
  try {
    let token = passedToken;

    if (!token && typeof window === "undefined") {
      const cookieStore = await cookies();
      token = cookieStore.get("accessToken")?.value;
    }

    if (!token) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (error) {
    return null;
  }
}