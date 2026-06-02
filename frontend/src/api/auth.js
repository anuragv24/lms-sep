// src/api/auth.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Essential for cross-origin cookies!
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Could not connect to the authentication server." };
  }
}


export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Registration failed." };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Could not connect to the registration server." };
  }
}

export async function logoutUser() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // 🌟 Crucial: Passes the cookie context to let the server clear it
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Logout failed." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: "Could not connect to the server to safely log out." };
  }
}
