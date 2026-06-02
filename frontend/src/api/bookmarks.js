// frontend/src/api/bookmarks.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function toggleBookmark(bookId, frontendCookieToken) {
  try {
    if (!frontendCookieToken) {
      return { success: false, message: "You must be logged in to bookmark books." };
    }

    const res = await fetch(`${API_BASE_URL}/api/bookmarks/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${frontendCookieToken}`,
      },
      body: JSON.stringify({ bookId }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to toggle bookmark." };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Unable to connect with bookmark servers." };
  }
}

export async function getBookmarkedVolumes(token) {
  try {
    if (!token) return { success: false, message: "No active user session found." };

    // 2. Query your backend server endpoint
    const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to load bookmarks." };
    }

    return { success: true, bookmarkedVolumes: data.bookmarkedVolumes };

  } catch (error) {
    return { success: false, message: "Unable to reach remote bookmark systems." };
  }
}