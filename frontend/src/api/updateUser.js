
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateUser(data, token){

    try {

        const formData = new FormData();

        if(data.name) formData.append('name', data.name);
        if (data.currentPassword) formData.append('currentPassword', data.currentPassword);
        if (data.newPassword) formData.append('newPassword', data.newPassword);
        if (data.profilePic) {
            formData.append('profilePic', data.profilePic); 
        }

        const res = await fetch(`${API_BASE_URL}/api/profile`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        }) 

        const updatedData = await res.json();

        if(!res.ok){
            return {
                success: false,
                message: updatedData.message || "failed to update data."
            }
        } 


        return {success: true, data: updatedData.user}
    } catch (error) {
    console.error("API_CLIENT_UPDATE_USER_ERROR:", error);

    return {
      success: false,
      message: error.message === "Failed to fetch" 
        ? "Network error. Please check your internet connection or server status."
        : error.message || "An unexpected error occurred while saving your profile."
    };
  }
}