import { getUpdatedUser } from "@/api/profile";
import ProfileComp from "@/components/ProfileComp";
import { redirect } from "next/navigation";

export const metadata = {
  title: 'Account Settings | Library',
};

export default async function ProfilePage() {
  let currentUser = null;

  try {
    currentUser = await getUpdatedUser()
  } catch (error) {
    console.error("PROFILE_SERVER_SESSION_FETCH_ERROR:", error.message);
  }


  if(!currentUser){
    redirect("/login")
  }
  return (
    <ProfileComp currentUser={currentUser} />
  );
}

