const admin = require("firebase-admin");

// load your Firebase service key
const serviceAccount = require("./serviceAccountKey.json");

// initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;