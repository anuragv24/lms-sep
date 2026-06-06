import { getUpdatedUser } from "@/api/profile";
import ProfileComp from "@/components/ProfileComp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Account Settings | Library',
};

export default async function ProfilePage() {
  let currentUser = null;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || "";

  try {
    currentUser = await getUpdatedUser()
  } catch (error) {
    console.error("PROFILE_SERVER_SESSION_FETCH_ERROR:", error.message);
  }


  if(!currentUser){
    redirect("/login")
  }
  return (
    <ProfileComp currentUser={currentUser} token={token} />
  );
}

