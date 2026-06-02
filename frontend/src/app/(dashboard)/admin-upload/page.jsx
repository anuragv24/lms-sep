import UploadComp from "@/components/UploadComp";
import { cookies } from "next/headers";

export default async function adminUpload(){
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || "";
    return (
        <UploadComp token={token} />
    )

}