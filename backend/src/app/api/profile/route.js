import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/verifyAuth";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.FRONTEND_URL || "http://localhost:3000",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request) {
  const decoded = verifyToken(request);
  let userObj;

  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401, headers: corsHeaders },
    );
  }

  try {
    await connectDB();
    userObj = await User.findOne({ email: decoded.email })
      .select("name email role profilePic authProvider password")
      .lean();

    if (!userObj) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401, headers: corsHeaders },
      );
    }

    const user = {
      id: decoded.id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role,
      profilePic: userObj.profilePic || "",
      authProvider: userObj.authProvider,
      hasPassword: !!userObj.password,
    };

    return NextResponse.json(
      {
        success: false,
        message: "User details",
        user: user,
      },
      { status: 200, header: corsHeaders },
    );
  } catch (error) {
    console.error("CRASH: Backend profile API failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Unable to retrieve profile  from the database.",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PATCH(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized administrative access.",
        },
        { status: 401, headers: corsHeaders },
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const profilePic = formData.get("profilePic");

    if (!name && !profilePic && !currentPassword && !newPassword) {
      return NextResponse.json(
        { success: false, message: "All fields can't be empty." },
        { status: 400, headers: corsHeaders },
      );
    }

    await connectDB();

    const currentUser = await User.findOne({email: user.email});
    if (!currentUser) {
        return NextResponse.json(
          { success: false, message: "Invalid credentials." },
          { status: 400, headers: corsHeaders }
        );
    }

    let profilePicUrl = currentUser.profilePic;

    if(profilePic && typeof profilePic !== "string" && profilePic.size > 0){
      const imgArrayBuffer = await profilePic.arrayBuffer();
      const imgBuffer = Buffer.from(imgArrayBuffer);

      const profilePicUploadResult = await new Promise((resolve, reject)=> {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "profile_pics",
          },  (error, result) => {
            if(error) reject(error);
            else resolve(result);
          }
        ).end(imgBuffer);
      })

      if(profilePicUploadResult && profilePicUploadResult.secure_url){
        profilePicUrl = profilePicUploadResult.secure_url;
      }
    }

    if(name) currentUser.name = name;
    if(profilePic && profilePic.size > 0) currentUser.profilePic = profilePicUrl;


    if(newPassword){
      if (newPassword.length < 6) {
            return NextResponse.json(
              {
                success: false,
                message: "Password must be at least 6 characters long.",
              },
              { status: 400, headers: corsHeaders }, // Added headers
            );
          }

      const hasExistingPassword = !!currentUser.password;

      if(hasExistingPassword){

        if(!currentPassword){
          return NextResponse.json({
            success: false,
            message: "Current password is required to change your password"
          }, {status: 400, headers: corsHeaders})
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, currentUser.password);

        if (!isPasswordCorrect) {
        return NextResponse.json(
          { success: false, message: "The current password you entered is incorrect." },
          { status: 400, headers: corsHeaders }
        );
      }
      } 

      const salt = await bcrypt.genSalt(10);
      currentUser.password = await bcrypt.hash(newPassword, salt);
    }

    await currentUser.save();


    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        profilePic: currentUser.profilePic,
        role: currentUser.role,
        hasPassword: !!currentUser.password,
      }
    }, {stauts: 200, headers: corsHeaders});

  } catch (error) {
    console.error("PROFILE_PATCH_ENDPOINT_ERROR:", error.message);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
