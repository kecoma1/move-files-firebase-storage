const check_keys = () => {
  if (
    !process.env.FIREBASE_API_KEY ||
    !process.env.FIREBASE_AUTHDOMAIN ||
    !process.env.FIREBASE_PROJECTID ||
    !process.env.FIREBASE_STORAGEBUCKET ||
    !process.env.FIREBASE_MESSAGINGSENDERID ||
    !process.env.FIREBASE_APPID ||
    !process.env.FIREBASE_MEASUREMENTID
  ) {
    console.log(
      "[ERROR] - FIREBASE KEYS not found! Put them in the .env file."
    );
    console.log("\tExample:");
    console.log("\t\tFIREBASE_API_KEY=example");
    console.log("\t\tFIREBASE_AUTHDOMAIN=example");
    console.log("\t\tFIREBASE_PROJECTID=example");
    console.log("\t\tFIREBASE_STORAGEBUCKET=example");
    console.log("\t\tFIREBASE_MESSAGINGSENDERID=example");
    console.log("\t\tFIREBASE_APPID=example");
    console.log("\t\tFIREBASE_MEASUREMENTID=example");

    return false;
  }

  return true;
};

module.exports = {
    check_keys
}
