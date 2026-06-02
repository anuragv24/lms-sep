
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBooksAndBookmarks(searchQuery = "", token) {
  try {
    

    // 2. Build URL safely containing the search parameter
    const url = new URL(`${API_BASE_URL}/api/books`);
    
    if (searchQuery) {
      url.searchParams.append("search", searchQuery);
    }

    // 3. Run server-to-server request
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to load catalog." };
    }

    return {
      success: true,
      books: data.books,
      // Convert the incoming array back to a fast Set layout for your UI lookups
      bookmarkedIdSet: new Set(data.bookmarkedIdList) 
    };

  } catch (error) {
    return {
      success: false,
      message: "Unable to connect with remote book services."
    };
  }
}


export async function deleteBook(bookId, frontendCookieToken) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${frontendCookieToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || "Failed to delete book." };
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: "Unable to connect to the administration server." };
  }
}


export async function uploadBook(formData, frontendCookieToken) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/books/upload`, {
      method: "POST",
      headers: {
        // We only pass the Authorization passport header.
        // The browser automatically sets Content-Type to multipart/form-data for FormData payloads!
        "Authorization": `Bearer ${frontendCookieToken}`,
      },
      body: formData, // Passing the raw multi-part binary data payload directly
    });

    const data = await res.json();

    if (!res.ok) {
      return { 
        success: false, 
        message: data.message || "Failed to execute catalogue upload operation." 
      };
    }

    return { success: true, data: data.data };

  } catch (error) {
    console.error("Frontend upload connection error:", error);
    return { 
      success: false, 
      message: "Unable to connect with remote cloud uploading nodes." 
    };
  }
}


export async function getSingleBook(bookId, token) {
  try {
    
    if (!token) return { success: false, message: "No active login session found." };

    const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, status: res.status, message: data.message || "Failed to load book." };
    }

    return { success: true, book: data.book };
  } catch (error) {
    return { success: false, message: "Unable to establish server stream pipeline." };
  }
}
