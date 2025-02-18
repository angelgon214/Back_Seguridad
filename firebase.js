const admin = require("firebase-admin");
const serviceAccount = require("./bd-seguridad-abf1c-firebase-adminsdk-fbsvc-8f7fddda75.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db };
