import * as functions from "firebase-functions";
import * as out from "../../src/input";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const myStats = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello, logs", { structuredData: true });
  const date = request.query["date"];
  response.send("Hello from Firebase! Date is " + date);
});
