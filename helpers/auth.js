const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../firebase");

const signIn = async () => {
  return await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_AUTH_EMAIL,
    process.env.FIREBASE_AUTH_PASSWORD
  ).then((userCredential) => {
    console.log('[INFO] - Sucess! - Logged in');
    return true
  }).catch((error) => {
    console.log('[ERROR] - FAILED! - Login failed. Error:', error);
    return false
  });
};

module.exports = {
  signIn
}
