const admin = require("firebase-admin");

const serviceAccount = require('../../todoapp-89149-firebase-adminsdk-5rbvc-ca8c39f1e1.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://todoapp-89149.firebaseio.com"
});


const db = admin.firestore();

module.exports = { admin, db };