import {
  generateToken,
  generateRefreshToken,
  verifyJwt,
  verifyRefreshToken,
} from "../src/utils/jwt";

console.log("🧪 Testing Refresh Token System\n");

// Test 1: Generate tokens
console.log("1️⃣ Token Generation Test");
const testPayload = { adminId: "test-123" };
const accessToken = generateToken(testPayload, "15m");
const refreshToken = generateRefreshToken(testPayload);
console.log("✅ Access Token:", accessToken.substring(0, 50) + "...");
console.log("✅ Refresh Token:", refreshToken.substring(0, 50) + "...");
console.log("");

// Test 2: Verify access token
console.log("2️⃣ Access Token Verification Test");
const verifiedAccess = verifyJwt(accessToken);
if (verifiedAccess && verifiedAccess.adminId === testPayload.adminId) {
  console.log("✅ Access token verified successfully");
  console.log("   Admin ID:", verifiedAccess.adminId);
} else {
  console.log("❌ Access token verification failed");
}
console.log("");

// Test 3: Verify refresh token
console.log("3️⃣ Refresh Token Verification Test");
const verifiedRefresh = verifyRefreshToken(refreshToken);
if (verifiedRefresh && verifiedRefresh.adminId === testPayload.adminId) {
  console.log("✅ Refresh token verified successfully");
  console.log("   Admin ID:", verifiedRefresh.adminId);
} else {
  console.log("❌ Refresh token verification failed");
}
console.log("");

// Test 4: Verify invalid token
console.log("4️⃣ Invalid Token Test");
const invalidResult = verifyJwt("invalid.token.here");
if (invalidResult === null) {
  console.log("✅ Invalid token correctly rejected");
} else {
  console.log("❌ Invalid token was not rejected");
}
console.log("");

// Test 5: Cross-verification (access token with refresh secret should fail)
console.log("5️⃣ Token Type Security Test");
const crossVerify = verifyRefreshToken(accessToken);
if (crossVerify === null) {
  console.log("✅ Access token correctly rejected by refresh verifier");
} else {
  console.log("❌ Security issue: Access token accepted by refresh verifier");
}
console.log("");

console.log("🎉 All tests completed!\n");
console.log("To run this test:");
console.log("  cd backend");
console.log("  npx ts-node tests/test-refresh-token.ts");
