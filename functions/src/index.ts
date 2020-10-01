import * as functions from "firebase-functions";
import moment = require("moment");
import { DATE_FORMAT } from "./fitbit/metrics";

export const myStats = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello, logs", { structuredData: true });
  const date = request.query["date"];
  if (!validate(date as string)) {
    response
      .status(400)
      .send(`Date ${date} is not valid. Please use the format ${DATE_FORMAT}`);
    return;
  }
  response.status(400).send("Hello from Firebase! Date is " + date);
});

const validate = (date: string | undefined) => {
  return date && moment(date, DATE_FORMAT, true).isValid();
};
