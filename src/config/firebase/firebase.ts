// src/firebase.ts
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import * as path from "path";
import * as fs from "fs";

// Load the service account JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "service-account.json"), "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "smkn4-firebase.firebasestorage.app", // Change to your bucket name
});

export const bucket = getStorage().bucket();
