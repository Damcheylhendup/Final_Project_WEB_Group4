const express = require("express");
const router = express.Router();
const admin = require("../firebaseAdmin");

// TEST ROUTE (check if working)
router.get("/test", (req, res) => {
  res.send("Auth route working ✅");
});

// VERIFY FIREBASE TOKEN
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(token);

    res.json({
      success: true,
      user: decodedToken,
    });
  } catch (error) {
    console.error("Token error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;