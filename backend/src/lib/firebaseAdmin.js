import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountRaw) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environmental variable is missing!");
    }

    const serviceAccount = JSON.parse(serviceAccountRaw);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
  } catch (error) {
    console.error("Firebase admin initialization failed:", error.message);
  }
}

export default admin;